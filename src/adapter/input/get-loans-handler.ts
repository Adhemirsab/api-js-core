import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { idRepository } from "../output/id-repository.js";
import { loanRepository } from "../output/loan-repository.js";
import { schedulerRepository } from "../output/scheduler-repository.js";
import { loanUseCase } from "../../domain/loan/use-case.js";
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

export const getLoansHandler =
  async (): Promise<APIGatewayProxyStructuredResultV2> => {
    const idRepo = idRepository();
    const loanRepo = loanRepository();
    const schedulerRepo = schedulerRepository();

    const [loanOk, loans, loanError] = await loanUseCase(
      idRepo,
      loanRepo,
      schedulerRepo,
    ).getLoans();

    if (!loanOk) {
      return failure(loanError);
    }

    return response(200, loans);
  };
