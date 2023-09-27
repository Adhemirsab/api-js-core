import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { CreateLoanParams } from "../../domain/loan/types.js";
import { tryParseJson } from "../../utilities/parse-json.js";
import { idRepository } from "../output/id-repository.js";
import { loanRepository } from "../output/loan-repository.js";
import { loanUseCase } from "../../domain/loan/use-case.js";

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
  const loanRepo = loanRepository();

  const loan = await loanUseCase(idRepo, loanRepo).createLoan(body);

  return response(201, loan);
};
