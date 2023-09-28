import {
  LoanService,
  IDRepository,
  LoanTableRepository,
  LoanSchedulerRepository,
} from "./ports.js";

export const loanUseCase = (
  idRepository: IDRepository,
  loanTableRepository: LoanTableRepository,
  loanSchedulerRepository: LoanSchedulerRepository,
): LoanService => ({
  createLoan: async (params) => {
    const id = idRepository.generateID();

    const loan = await loanTableRepository.saveLoan({ id, ...params });

    await loanSchedulerRepository.createLoanSchedule(loan);

    return loan;
  },
});
