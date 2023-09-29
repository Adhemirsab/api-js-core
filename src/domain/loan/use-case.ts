import { CustomError } from "../lib/custom-error.js";
import { getCurrentEpoch, withEpoch } from "../lib/epoch.js";
import {
  LoanService,
  IDRepository,
  SchedulerRepository,
  LoanRepository,
} from "./ports.js";
import { FrecuencyType } from "./types.js";

export const loanUseCase = (
  idRepository: IDRepository,
  loanRepository: LoanRepository,
  schedulerRepository: SchedulerRepository,
): LoanService => ({
  createLoan: async (params) => {
    const currentEpoch = getCurrentEpoch();

    if (params.startAt < currentEpoch) {
      return [
        false,
        undefined,
        new CustomError(400, "start date must be greater than current date"),
      ];
    }

    const id = idRepository.generateID();

    const [ok, loan, error] = await loanRepository.saveLoan({ id, ...params });
    if (!ok) {
      return [false, undefined, error];
    }

    const addTime = (
      startAt: number,
      times: number,
      frecuencyType: FrecuencyType,
    ): number => {
      const operator = withEpoch(startAt);

      switch (frecuencyType) {
        case "daily":
          return operator.addDays(times).toEpoch();
        case "weekly":
          return operator.addWeeks(times).toEpoch();
        case "monthly":
          return operator.addMonths(times).toEpoch();
      }
    };

    const endAt = addTime(loan.startAt, loan.times, loan.type);

    const [schedulerOk, _, schedulerError] =
      await schedulerRepository.createSchedule(
        loan.id,
        loan.startAt,
        endAt,
        loan.type,
        loan,
      );

    if (!schedulerOk) {
      return [false, undefined, schedulerError];
    }

    return [true, loan, undefined];
  },
});
