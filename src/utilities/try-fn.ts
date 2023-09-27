export type Response<D> = [true, D, undefined] | [false, undefined, unknown];

export const tryFn = async <D = unknown>(
  fn: () => Promise<D> | D,
): Promise<Response<D>> => {
  try {
    const result = await fn();

    return [true, result, undefined];
  } catch (error) {
    return [false, undefined, error];
  }
};

export const tryFnSync = <D = unknown>(fn: () => D): Response<D> => {
  try {
    const result = fn();

    return [true, result, undefined];
  } catch (error) {
    return [false, undefined, error];
  }
};
