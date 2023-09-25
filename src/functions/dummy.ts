import { tryFn } from "../utilities/tryFn2";

export const handler = async () => {
  const message = await tryFn(async () => "dummy");

  return { message };
};
