export type Response<D> =
  | [ok: true, data: D, error: undefined]
  | [ok: false, data: undefined, error: Error];

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const tryFn = async <D = unknown>(
  fn: () => Promise<D> | D,
): Promise<Response<D>> => {
  try {
    const result = await fn();

    return [true, result, undefined];
  } catch (error) {
    if (isError(error)) {
      return [false, undefined, error];
    }

    return [false, undefined, new Error(JSON.stringify(error))];
  }
};

export const tryFnSync = <D = unknown>(fn: () => D): Response<D> => {
  try {
    const result = fn();

    return [true, result, undefined];
  } catch (error) {
    if (isError(error)) {
      return [false, undefined, error];
    }

    return [false, undefined, new Error(JSON.stringify(error))];
  }
};
