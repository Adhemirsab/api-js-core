export type FrecuencyType = "monthly" | "weekly";

export type CreateLoanParams = {
  name: string;
  phone: string;
  amount: number;
  startAt: number;
  paymentTimes: number;
  currency: "USD" | "PEN";
  frecuencyType: FrecuencyType;
  timezoneOffsetMinutes: number;
  interestRate: number;
  loanType: "lend" | "borrow";
};

export type Loan = CreateLoanParams & {
  id: string;
  monthlyPayment: number;
};
