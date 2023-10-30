import { Response } from "../lib/try-fn.js";
import { CreateLoanParams, FrecuencyType, Loan } from "./types.js";

// inbound
export interface LoanService {
  createLoan: (params: CreateLoanParams) => Promise<Response<Loan>>;
  getLoans: () => Promise<Response<Loan[]>>;
}

// outbound
export interface IDRepository {
  generateID: () => string;
}

export interface LoanRepository {
  saveLoan: (loan: Loan) => Promise<Response<Loan>>;
  getLoans: () => Promise<Response<Loan[]>>;
}

export interface SchedulerRepository {
  createSchedule: <T>(
    id: string,
    startAt: number,
    endAt: number,
    frecuencyType: FrecuencyType,
    payload: T,
  ) => Promise<Response<boolean>>;
}
