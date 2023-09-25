export const handler = async () => {
  const result = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World!",
    }),
  };

  return result;
};
