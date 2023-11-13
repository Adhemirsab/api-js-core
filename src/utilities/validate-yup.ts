import { ObjectSchema, ValidationError } from "yup";
import { tryFnSync, Response } from "../domain/lib/try-fn.js";

export const validate = <T extends { [key: string]: unknown }>(
  obj: unknown,
  schema: ObjectSchema<T>,
): Response<T> => {
  const [ok, result, error] = tryFnSync(
    () => schema.validateSync(obj, { abortEarly: false }) as T,
  );
  if (!ok) {
    return [
      false,
      undefined,
      new Error(
        error instanceof ValidationError
          ? error.errors.join(", ")
          : error.message,
      ),
    ];
  }

  return [true, result, undefined];
};
