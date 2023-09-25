import { tryFn } from "../utilities/tryFn";

export const handler = async () => {
  const [_, data] = await tryFn(() => "hello");

  return {
    message: data,
  };
};
