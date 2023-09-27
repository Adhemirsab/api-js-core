import { CreateLoanParams, Loan } from "./types.js";

// inbound
export interface LoanService {
  createLoan: (params: CreateLoanParams) => Promise<Loan>;
}

// outbound
export interface IDRepository {
  generateID: () => string;
}

export interface LoanRepository {
  saveLoanAndSchedules: (loan: Loan) => Promise<Loan>;
}
