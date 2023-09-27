import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LoanRepository } from "../../domain/loan/ports.js";
import { Loan } from "../../domain/loan/types.js";

export const loanRepository = (): LoanRepository => ({
  createLoan: async ({ id, name, amount, startAt, count, type }) => {
    const client = new DynamoDBClient();
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const item: Loan = { id, name, amount, startAt, count, type };

    const command = new PutCommand({
      TableName: "loans",
      Item: item,
    });

    const result = await ddbDocClient.send(command);

    console.log("createLoan | ", JSON.stringify(result, null, 2));

    return item;
  },
});
