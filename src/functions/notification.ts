import { CustomError, isCustomError } from "../domain/lib/custom-error.js";
import { isError } from "../domain/lib/try-fn.js";
import { eventLog, middy } from "../middleware/index.js";

export const handler = middy(() => {
  const something: unknown = new CustomError(400, "fadfasdf");

  const isCustom = isCustomError(something);

  const isErr = isError(something);

  console.log("handler", isErr, isCustom);

  return Promise.resolve({});
})
  .use(eventLog())
  .start();
