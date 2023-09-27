import { CreateLoanParams, Loan } from "./types.js";

export interface LoanService {
  createLoan: (params: CreateLoanParams) => Promise<Loan>;
}

export interface IDRepository {
  generateID: () => string;
}

export interface LoanRepository {
  createLoan: (loan: Loan) => Promise<Loan>;
}
