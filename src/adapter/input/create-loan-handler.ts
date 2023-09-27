import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { CreateLoanParams, Loan } from "../../domain/loan/types.js";
import { tryParseJson } from "../../utilities/parse-json.js";
import { uuidRepository } from "../output/uuid-repository.js";
import { loanRepository } from "../output/loan-repository.js";
import { loanUseCase } from "../../domain/loan/use-case.js";

export const createLoanHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<Loan>> => {
  const [ok, body, error] = tryParseJson<CreateLoanParams>(event.body);
  if (!ok) {
    return { statusCode: 400, body: JSON.stringify({ error }) };
  }

  const uuidRepo = uuidRepository();
  const loanRepo = loanRepository();

  const loan = await loanUseCase(uuidRepo, loanRepo).createLoan(body);

  return loan;
};
