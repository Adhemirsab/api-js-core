export const getErrorMessage = (error: unknown): string => {
  if (typeof error !== "object" || error === null || !("message" in error)) {
    return JSON.stringify(error);
  }

  const message = error["message"];

  if (typeof message !== "string") {
    return JSON.stringify(error);
  }

  return message;
};
