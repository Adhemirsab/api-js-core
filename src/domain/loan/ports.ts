import { Response } from "../lib/try-fn.js";
import { CreateLoanParams, Loan } from "./types.js";

// inbound
export interface CreateLoanService {
  createLoan: (
    params: CreateLoanParams,
    createScheduleFunctionName: string,
  ) => Promise<Response<Loan>>;
}

export interface ListLoansService {
  listLoans: () => Promise<Response<Loan[]>>;
}

// outbound
export interface IDRepository {
  generateID: () => string;
}

export interface LoanRepository {
  saveLoan: (loan: Loan) => Promise<Response<Loan>>;
  listLoans: () => Promise<Response<Loan[]>>;
}

export interface LambdaRepository {
  invoke: (lambdaName: string, payload: unknown) => Promise<Response<unknown>>;
}
