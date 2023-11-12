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
};

export type Loan = {
  id: string;
  name: string;
  phone: string;
  amount: number;
  startAt: number;
  paymentTimes: number;
  currency: "USD" | "PEN";
  frecuencyType: FrecuencyType;
  monthlyPayment: number;
  timezoneOffsetMinutes: number;
};
