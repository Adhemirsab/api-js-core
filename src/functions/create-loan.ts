import { eventLog, httpError, middy } from "../middleware/index.js";
import { createLoanHandler } from "../adapter/input/create-loan-handler.js";

export const handler = middy(createLoanHandler)
  .use(eventLog())
  .use(httpError())
  .start();
