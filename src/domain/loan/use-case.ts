import { withEpoch } from "../lib/epoch.js";
import {
  IDRepository,
  SchedulerRepository,
  LoanRepository,
  CreateLoanService,
  ListLoansService,
} from "./ports.js";
import { CreateLoanParams, FrecuencyType, Loan } from "./types.js";

const generateLoan = (params: CreateLoanParams, id: string): Loan => ({
  id,
  monthlyPayment: params.amount / params.paymentTimes,
  ...params,
});

const calculateStartEnd = (
  epoch: number,
  frecuency: FrecuencyType,
  times: number,
  timezoneOffsetMinutes: number,
): [startAt: number, endAt: number] => {
  const normalizedEpoch = withEpoch(epoch)
    .setHoursMinutesSeconds(12, timezoneOffsetMinutes, 0)
    .toEpoch();

  switch (frecuency) {
    case "monthly": {
      const startAt = withEpoch(normalizedEpoch).addMonths(1).toEpoch();
      const endAt = withEpoch(normalizedEpoch).addMonths(times).addDays(1).toEpoch();

      return [startAt, endAt];
    }
    case "weekly": {
      const startAt = withEpoch(normalizedEpoch).addWeeks(1).toEpoch();
      const endAt = withEpoch(normalizedEpoch).addWeeks(times).addDays(1).toEpoch();

      return [startAt, endAt];
    }
  }
};

export const createLoanUseCase = (
  idRepository: IDRepository,
  loanRepository: LoanRepository,
  schedulerRepository: SchedulerRepository,
): CreateLoanService => ({
  createLoan: async (params) => {
    const id = idRepository.generateID();

    const tempLoan = generateLoan(params, id);

    const [ok, loan, error] = await loanRepository.saveLoan(tempLoan);
    if (!ok) {
      return [false, undefined, error];
    }

    const [startAt, endAt] = calculateStartEnd(
      loan.startAt,
      loan.frecuencyType,
      loan.paymentTimes,
      loan.timezoneOffsetMinutes,
    );

    const [schedulerOk, _, schedulerError] =
      await schedulerRepository.createSchedule(
        loan.id,
        startAt,
        endAt,
        loan.frecuencyType,
        loan,
      );

    if (!schedulerOk) {
      return [false, undefined, schedulerError];
    }

    return [true, loan, undefined];
  },
});

export const listLoansUseCase = (
  loanRepository: LoanRepository,
): ListLoansService => ({
  listLoans: () => loanRepository.listLoans(),
});
