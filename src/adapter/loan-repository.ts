import { LoanRepository } from "../domain/loan/ports.js";

export const loanRepository = (): LoanRepository => ({
  createLoan: async ({ id, name, amount, startAt, count, type }) => {
    return {
      id,
      name,
      amount,
      startAt,
      count,
      type,
    };
  },
});
