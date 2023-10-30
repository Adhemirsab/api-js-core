import {
    eventLog,
    httpError,
    httpHeaders,
    middy,
  } from "../middleware/index.js";
  import { getLoansHandler } from "../adapter/input/get-loans-handler.js";
  import { HEADERS } from "../utilities/constants.js";
  
  export const handler = middy(getLoansHandler)
    .use(eventLog())
    .use(httpHeaders(HEADERS.Json))
    .use(httpError())
    .start();
  