type Response = [true, string, null] | [false, null, unknown];

export const tryFn = async (fn: () => Promise<string> | string): Promise<Response> => {
  try {
    const result = await fn();

    return [true, result, null];
  } catch (error) {
    return [false, null, error];
  }
};
