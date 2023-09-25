import { tryFn } from "../utilities/tryFn";

export const handler = async () => {
  const message = await tryFn(async () => "dummy");

  return { message };
};
