import { withEpoch } from "../lib/epoch.js";
import {
  LoanService,
  IDRepository,
  SchedulerRepository,
  LoanRepository,
} from "./ports.js";
import { FrecuencyType } from "./types.js";

const getStartEnd = (
  initStartAt: number,
  times: number,
  frecuencyType: FrecuencyType,
): [startAt: number, endAt: number] => {
  switch (frecuencyType) {
    case "daily": {
      const startAt = withEpoch(initStartAt).addDays(1).toEpoch();
      const endAt = withEpoch(startAt)
        .addDays(times - 1)
        .toEpoch();

      return [startAt, endAt];
    }
    case "weekly": {
      const startAt = withEpoch(initStartAt).addWeeks(1).toEpoch();
      const endAt = withEpoch(startAt)
        .addWeeks(times - 1)
        .toEpoch();

      return [startAt, endAt];
    }
    case "monthly": {
      const startAt = withEpoch(initStartAt).addMonths(1).toEpoch();
      const endAt = withEpoch(startAt)
        .addMonths(times - 1)
        .toEpoch();

      return [startAt, endAt];
    }
  }
};

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

    const initStartAt = withEpoch(loan.startAt)
      .addDays(1)
      .setHoursMinutesSeconds(0, 720 + loan.timezoneOffsetMinutes, 0)
      .toEpoch();

    const [startAt, endAt] = getStartEnd(initStartAt, loan.times, loan.type);

    const [schedulerOk, _, schedulerError] =
      await schedulerRepository.createSchedule(
        loan.id,
        startAt,
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
