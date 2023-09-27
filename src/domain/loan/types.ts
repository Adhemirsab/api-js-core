export type LoanType = "monthly" | "weekly" | "daily";

export type CreateLoanParams = {
  name: string;
  amount: number;
  startAt: number;
  count: number;
  type: LoanType;
};

export type Loan = {
  id: string;
  name: string;
  amount: number;
  startAt: number;
  count: number;
  type: LoanType;
};
