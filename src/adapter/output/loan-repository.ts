import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LoanRepository } from "../../domain/loan/ports.js";
import { tryFn } from "../../domain/lib/try-fn.js";

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
});
