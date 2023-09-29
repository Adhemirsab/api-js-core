import { withEpoch } from "../lib/epoch.js";
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
      switch (frecuencyType) {
        case "daily":
          return withEpoch(startAt).addDays(times).toEpoch();
        case "weekly":
          return withEpoch(startAt).addWeeks(times).toEpoch();
        case "monthly":
          return withEpoch(startAt).addMonths(times).toEpoch();
      }
    };

    const startAt = withEpoch(loan.startAt)
      .addDays(1)
      .setHoursMinutesSeconds(0, 720 + loan.timezoneOffsetMinutes, 0)
      .toEpoch();

    const endAt = addTime(startAt, loan.times, loan.type);

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
