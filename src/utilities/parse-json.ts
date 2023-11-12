import { ValidationError } from "yup";
import { Response, tryFnSync } from "../domain/lib/try-fn.js";

export const tryParseJson = <T>(
  str = "",
  validator: (obj: unknown) => obj is T,
): Response<T> => {
  const [ok, data, error] = tryFnSync(() => JSON.parse(str) as unknown);
  if (!ok) {
    return [false, undefined, error];
  }

  const [yupOk, result, yupError] = tryFnSync(() => {
    if (validator(data)) {
      return data;
    }

    throw new Error("Invalid body");
  });
  if (!yupOk) {
    return [
      false,
      undefined,
      new Error(
        yupError instanceof ValidationError
          ? yupError.errors.join(", ")
          : yupError.message,
      ),
    ];
  }

  return [true, result, undefined];
};
