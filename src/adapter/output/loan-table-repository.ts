import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LoanTableRepository } from "../../domain/loan/ports.js";

export const loanTableRepository = (): LoanTableRepository => ({
  saveLoan: async (loan) => {
    const client = new DynamoDBClient();
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const command = new PutCommand({
      TableName: process.env.ENV_LOAN_TABLE_NAME,
      Item: loan,
    });

    await ddbDocClient.send(command);

    return loan;
  },
});
