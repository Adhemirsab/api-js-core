import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { LoanRepository } from "../../domain/loan/ports.js";
import { tryFn } from "../../domain/lib/try-fn.js";
import { Loan } from "../../domain/loan/types.js";
import { validate } from "../../utilities/validate-yup.js";
import { ObjectSchema, number, object, string } from "yup";

const schema = (): ObjectSchema<Loan> =>
  object({
    id: string().required(),
    name: string().required(),
    phone: string().required(),
    amount: number().positive().required(),
    startAt: number().integer().positive().required(),
    paymentTimes: number().integer().min(1).required(),
    currency: string().oneOf(["USD", "PEN"]).required(),
    frecuencyType: string().oneOf(["monthly", "weekly"]).required(),
    timezoneOffsetMinutes: number().required(),
    interestRate: number().positive().required(),
    loanType: string().oneOf(["lend", "borrow"]).required(),
    monthlyPayment: number().positive().required(),
  }).strict();

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
  listLoans: async () => {
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

    const loans = items.filter<Loan>((i): i is Loan => {
      const [ok] = validate(i, schema());
      if (!ok) {
        // TODO log error
      }

      return ok;
    });

    return [true, loans, undefined];
  },
});
