export type FrecuencyType = "monthly" | "weekly" | "daily";

export type CreateLoanParams = {
  name: string;
  amount: number;
  startAt: number;
  times: number;
  type: FrecuencyType;
  timezoneOffsetMinutes: number;
};

export type Loan = {
  id: string;
  name: string;
  amount: number;
  startAt: number;
  times: number;
  type: FrecuencyType;
  timezoneOffsetMinutes: number;
};
