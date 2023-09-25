import isNumber from "is-number";

export const handler = async () => {
  return {
    message: "world " + isNumber(42),
  };
};
