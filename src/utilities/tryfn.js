export const tryFn = async (fn) => {
  try {
    const result = await fn();

    return [true, result, null];
  } catch (error) {
    return [false, null, error];
  }
};
