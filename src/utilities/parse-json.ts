import { Response, tryFnSync } from "./try-fn.js";

export const parseJson = <T>(str = ""): T => {
  return JSON.parse(str) as T;
};

export const tryParseJson = <T>(str = ""): Response<T> =>
  tryFnSync(() => parseJson<T>(str));
