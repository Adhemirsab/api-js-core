import { CreateLoanParams, Loan } from "./types.js";

// inbound
export interface LoanService {
  createLoan: (params: CreateLoanParams) => Promise<Loan>;
}

// outbound
export interface IDRepository {
  generateID: () => string;
}

export interface LoanTableRepository {
  saveLoan: (loan: Loan) => Promise<Loan>;
}

export interface LoanSchedulerRepository {
  createLoanSchedule: (loan: Loan) => Promise<boolean>;
}
