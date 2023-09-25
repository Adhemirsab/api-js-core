import { tryFn } from "../utilities/tryfn";

export const handler = async () => {
  const [_, data] = await tryFn(() => "hello");

  return {
    message: data,
  };
};
