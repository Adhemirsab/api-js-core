import { CustomError } from "../domain/lib/custom-error.js";
import { Response, tryFnSync } from "../domain/lib/try-fn.js";

export const tryParseJson = <T>(
  str = "",
  validator: (obj: unknown) => obj is T,
): Response<T> => {
  const [ok, data, error] = tryFnSync(() => JSON.parse(str) as unknown);
  if (!ok) {
    return [ok, data, new CustomError(400, error.message)];
  }

  if (validator(data)) {
    return [true, data, undefined];
  }

  return [false, undefined, new CustomError(400, "Invalid body")];
};
