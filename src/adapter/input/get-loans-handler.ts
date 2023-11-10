import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { loanRepository } from "../output/loan-repository.js";
import { listLoansUseCase } from "../../domain/loan/use-case.js";
import { isCustomError } from "../../domain/lib/custom-error.js";

const failure = (error: Error): APIGatewayProxyStructuredResultV2 => ({
  statusCode: isCustomError(error) ? error.statusCode : 500,
  body: JSON.stringify({ message: error.message }),
});

const response = <T>(
  code: number,
  body: T,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode: code,
  body: JSON.stringify(body),
});

export const listLoansHandler =
  async (): Promise<APIGatewayProxyStructuredResultV2> => {
    const loanRepo = loanRepository();

    const [ok, loans, error] = await listLoansUseCase(loanRepo).listLoans();
    if (!ok) {
      return failure(error);
    }

    return response(200, loans);
  };
