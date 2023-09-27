import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { eventLog, middy } from "../middleware/index.js";
import { parseJson } from "../utilities/parse-json.js";
import { CreateLoanParams, Loan } from "../domain/loan/types.js";
import { loanUseCase } from "../domain/loan/use-case.js";
import { uuidRepository } from "../adapter/uuid-repository.js";
import { loanRepository } from "../adapter/loan-repository.js";

const createLoanHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<Loan>> => {
  const body = parseJson<CreateLoanParams>(event.body);

  const uuidRepo = uuidRepository();
  const loanRepo = loanRepository();

  const loan = await loanUseCase(uuidRepo, loanRepo).createLoan(body);

  return loan;
};

export const handler = middy(createLoanHandler).use(eventLog()).start();
