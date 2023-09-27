import {
  eventLog,
  httpError,
  httpHeaders,
  middy,
} from "../middleware/index.js";
import { createLoanHandler } from "../adapter/input/create-loan-handler.js";
import { HEADERS } from "../utilities/constants.js";

export const handler = middy(createLoanHandler)
  .use(eventLog())
  .use(httpHeaders(HEADERS.Json))
  .use(httpError())
  .start();
