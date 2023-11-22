import { Response, tryFnSync } from "../domain/lib/try-fn.js";

export const tryJsonParse = (str = ""): Response<unknown> =>
  tryFnSync(() => JSON.parse(str) as unknown);
