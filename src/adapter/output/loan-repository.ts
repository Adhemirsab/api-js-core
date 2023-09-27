import { LoanRepository } from "../../domain/loan/ports.js";

export const loanRepository = (): LoanRepository => ({
  createLoan: ({ id, name, amount, startAt, count, type }) => {
    return Promise.resolve({
      id,
      name,
      amount,
      startAt,
      count,
      type,
    });
  },
});
