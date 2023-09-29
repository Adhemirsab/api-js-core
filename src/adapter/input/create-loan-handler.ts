import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { CreateLoanParams } from "../../domain/loan/types.js";
import { tryParseJson } from "../../utilities/parse-json.js";
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

const validateBody = (body: unknown): body is CreateLoanParams => {
  if (typeof body !== "object" || body === null) return false;

  const { name, amount, startAt, times, type, timezoneOffsetMinutes } =
    body as Record<string, unknown>;

  if (typeof name !== "string") return false;
  if (typeof amount !== "number" || amount < 0) return false;
  if (typeof startAt !== "number" || amount < 0) return false;
  if (typeof times !== "number" || amount < 0) return false;
  if (typeof type !== "string" || ["monthly", "weekly", "daily"].includes(type))
    return false;
  if (typeof timezoneOffsetMinutes !== "number") return false;

  return true;
};

export const createLoanHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const [ok, body, error] = tryParseJson<CreateLoanParams>(
    event.body,
    validateBody,
  );
  if (!ok) {
    return failure(error);
  }

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
