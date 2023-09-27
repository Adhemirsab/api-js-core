import { LoanService, IDRepository, LoanRepository } from "./ports.js";

export const loanUseCase = (
  idRepository: IDRepository,
  loanRepository: LoanRepository,
): LoanService => ({
  createLoan: async ({ name, amount, startAt, count, type }) => {
    const id = idRepository.generateID();

    return await loanRepository.createLoan({
      id,
      name,
      amount,
      startAt,
      count,
      type,
    });
  },
});
