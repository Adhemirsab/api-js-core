export type FrecuencyType = "monthly" | "weekly" | "daily";

export type CreateLoanParams = {
  name: string;
  codeLoan: string;
  idUser: string;
  phone: string;
  amount: number;
  startAt: number;
  endAt: number;
  paymentTimes: number;
  currency: "USD" | "PEN";
  frecuencyType: FrecuencyType;
  timezoneOffsetMinutes: number;
};

export type Loan = {
  id: string;
  name: string;
  codeLoan: string;
  idUser: string;
  phone: string;
  amount: number;
  startAt: number;
  endAt: number;
  paymentTimes: number;
  currency: "USD" | "PEN";
  frecuencyType: FrecuencyType;
  typetype: number;
  timezoneOffsetMinutes: number;
};
