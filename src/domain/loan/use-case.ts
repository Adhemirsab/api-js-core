import { LoanService, UUIDRepository, LoanRepository } from "./ports.js";

export const loanUseCase = (
  uuidRepository: UUIDRepository,
  loanRepository: LoanRepository,
): LoanService => ({
  createLoan: async ({ name, amount, startAt, count, type }) => {
    const id = uuidRepository.generateUUID();

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
