import toNoCase from "to-no-case";

export const handler = async () => {
  return {
    message: toNoCase("hello"),
  };
};
