import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { CreateLoanParams } from "../../domain/loan/types.js";
import { tryParseJson } from "../../utilities/parse-json.js";
import { idRepository } from "../output/id-repository.js";
import { loanTableRepository } from "../output/loan-table-repository.js";
import { loanUseCase } from "../../domain/loan/use-case.js";
import { loanSchedulerRepository } from "../output/loan-scheduler-repository.js";

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
  const [ok, body, error] = tryParseJson<CreateLoanParams>(event.body);
  if (!ok) {
    console.log("createLoanHandler", error);
    return response(400, { message: "Invalid body" });
  }

  const idRepo = idRepository();
  const loanTableRepo = loanTableRepository();
  const loanSchedulerRepo = loanSchedulerRepository();

  const loan = await loanUseCase(
    idRepo,
    loanTableRepo,
    loanSchedulerRepo,
  ).createLoan(body);

  return response(201, loan);
};
