import toNoCase from "to-no-case";
import { tryFn } from "../../utilities/tryfn";

export const handler = async () => {
  const [data] = await tryFn(() => toNoCase("hello"));

  return {
    message: data,
  };
};
