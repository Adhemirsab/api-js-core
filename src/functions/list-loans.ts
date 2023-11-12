import {
  eventLog,
  httpError,
  httpHeaders,
  middy,
} from "../middleware/index.js";
import { listLoansHandler } from "../adapter/input/list-loans-handler.js";
import { HEADERS } from "../utilities/constants.js";

export const handler = middy(listLoansHandler)
  .use(eventLog())
  .use(httpHeaders(HEADERS.Json))
  .use(httpError())
  .start();
