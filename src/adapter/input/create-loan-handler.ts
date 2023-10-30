import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { CreateLoanParams } from "../../domain/loan/types.js";
import { idRepository } from "../output/id-repository.js";
import { loanUseCase } from "../../domain/loan/use-case.js";
import { loanRepository } from "../output/loan-repository.js";
import { schedulerRepository } from "../output/scheduler-repository.js";
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

export const createLoanHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const body = JSON.parse(event.body || "{}") as CreateLoanParams;

  const idRepo = idRepository();
  const loanRepo = loanRepository();
  const schedulerRepo = schedulerRepository();

  const [loanOk, loan, loanError] = await loanUseCase(
    idRepo,
    loanRepo,
    schedulerRepo,
  ).createLoan(body);

  if (!loanOk) {
    return failure(loanError);
  }

  return response(201, loan);
};
