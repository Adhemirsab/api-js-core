import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { LoanRepository } from "../../domain/loan/ports.js";
import { tryFn } from "../../domain/lib/try-fn.js";
import { FrecuencyType, Loan } from "../../domain/loan/types.js";

const toValue = <T>(
  validator: (obj: unknown) => obj is T,
  value: unknown,
  def: T,
): T => {
  if (!validator(value)) {
    return def;
  }

  return value;
};

export const loanRepository = (): LoanRepository => ({
  saveLoan: async (loan) => {
    const client = new DynamoDBClient();
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const command = new PutCommand({
      TableName: process.env.ENV_LOAN_TABLE_NAME,
      Item: loan,
    });

    const [ok, _, error] = await tryFn(() => ddbDocClient.send(command));
    if (!ok) {
      return [false, undefined, error];
    }

    return [true, loan, undefined];
  },
  getLoans: async () => {
    const client = new DynamoDBClient();
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const command = new ScanCommand({
      TableName: process.env.ENV_LOAN_TABLE_NAME,
    });

    const [ok, data, error] = await tryFn(() => ddbDocClient.send(command));
    if (!ok) {
      return [false, undefined, error];
    }

    const items = data.Items || [];

    const loans = items.map<Loan>((i) => ({
      id: toValue<string>((o): o is string => typeof o === "string", i.id, ""),
      name: toValue<string>(
        (o): o is string => typeof o === "string",
        i.name,
        "",
      ),
      codeLoan: toValue<string>(
        (o): o is string => typeof o === "string",
        i.codeLoan,
        "",
      ),
      idUser: toValue<string>(
        (o): o is string => typeof o === "string",
        i.idUser,
        "",
      ),
      phone: toValue<string>(
        (o): o is string => typeof o === "string",
        i.phone,
        "",
      ),
      amount: toValue<number>(
        (o): o is number => typeof o === "number",
        i.amount,
        0,
      ),
      startAt: toValue<number>(
        (o): o is number => typeof o === "number",
        i.startAt,
        0,
      ),
      endAt: toValue<number>(
        (o): o is number => typeof o === "number",
        i.endAt,
        0,
      ),
      paymentTimes: toValue<number>(
        (o): o is number => typeof o === "number",
        i.paymentTimes,
        0,
      ),
      currency: toValue<"USD" | "PEN">(
        (o): o is "USD" | "PEN" =>
          typeof o === "string" && ["USD", "PEN"].includes(o),
        i.currency,
        "USD",
      ),
      frecuencyType: toValue<FrecuencyType>(
        (o): o is FrecuencyType =>
          typeof o === "string" && ["monthly", "weekly", "daily"].includes(o),
        i.frecuencyType,
        "monthly",
      ),
      monthlyPayment: toValue<number>(
        (o): o is number => typeof o === "number",
        i.monthlyPayment,
        0,
      ),
      timezoneOffsetMinutes: toValue<number>(
        (o): o is number => typeof o === "number",
        i.timezoneOffsetMinutes,
        0,
      ),
    }));

    return [true, loans, undefined];
  },
});
