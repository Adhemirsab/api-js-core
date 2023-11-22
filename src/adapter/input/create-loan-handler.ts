import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { CreateLoanParams } from "../../domain/loan/types.js";
import { idRepository } from "../output/id-repository.js";
import { createLoanUseCase } from "../../domain/loan/use-case.js";
import { loanRepository } from "../output/loan-repository.js";
import { CustomError, isCustomError } from "../../domain/lib/custom-error.js";
import { tryJsonParse } from "../../utilities/parse-json.js";
import { object, number, string, ObjectSchema } from "yup";
import { validate } from "../../utilities/validate-yup.js";
import { newLambdaRepository } from "../output/lambda-repository.js";

export const createLoanHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const [ok, body, parseError] = tryJsonParse(event.body);
  if (!ok) {
    return failure(new CustomError(400, parseError.message));
  }

  const [valOk, params, validateError] = validate(body, schema());
  if (!valOk) {
    return failure(new CustomError(400, validateError.message));
  }

  // TODO refactor this
  const functionName = process.env.ENV_CREATE_SCHEDULE_FUNCTION_NAME || "";

  const idRepo = idRepository();
  const loanRepo = loanRepository();
  const lambdaRepository = newLambdaRepository();

  const [loanOk, loan, loanError] = await createLoanUseCase(
    idRepo,
    loanRepo,
    lambdaRepository,
  ).createLoan(params, functionName);

  if (!loanOk) {
    return failure(loanError);
  }

  return response(201, loan);
};

const schema = (): ObjectSchema<CreateLoanParams> =>
  object({
    name: string().required(),
    phone: string().required(),
    amount: number().positive().required(),
    startAt: number().integer().positive().required(),
    paymentTimes: number().integer().min(1).required(),
    currency: string().oneOf(["USD", "PEN"]).required(),
    frecuencyType: string().oneOf(["monthly", "weekly"]).required(),
    timezoneOffsetMinutes: number().required(),
    interestRate: number().positive().required(),
    loanType: string().oneOf(["lend", "borrow"]).required(),
  }).strict();

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
