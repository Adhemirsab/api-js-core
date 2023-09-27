export const parseJson = <T>(src = ""): T => {
  return JSON.parse(src) as T;
};
