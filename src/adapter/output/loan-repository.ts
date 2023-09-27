import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LoanRepository } from "../../domain/loan/ports.js";

export const loanRepository = (): LoanRepository => ({
  saveLoanAndSchedules: async (loan) => {
    const client = new DynamoDBClient();
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const command = new PutCommand({
      TableName: process.env.LOAN_TABLE_NAME,
      Item: loan,
    });

    const result = await ddbDocClient.send(command);

    console.log("createLoan | ", JSON.stringify(result, null, 2));

    return loan;
  },
});
