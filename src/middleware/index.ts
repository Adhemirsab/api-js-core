type AwsFunction<E, C, R> = (event: E, context: C) => Promise<R>;

type Middleware<E, C, R> = (
  handler: AwsFunction<E, C, R>,
) => AwsFunction<E, C, R>;

export const middleware = <E, C, R>(handler: AwsFunction<E, C, R>) => {
  const ms: Middleware<E, C, R>[] = [];

  const state = (middlewares: Middleware<E, C, R>[]) => {
    const use = (middleware: Middleware<E, C, R>) =>
      state([...middlewares, middleware]);

    const start = (): AwsFunction<E, C, R> =>
      middlewares.reduceRight((next, middleware) => middleware(next), handler);

    return { use, start };
  };

  return state(ms);
};

export const eventLog = <E, C, R>(): Middleware<E, C, R> => {
  return (handler: AwsFunction<E, C, R>) =>
    async (event: E, context: C): Promise<R> => {
      console.log("event", JSON.stringify(event, null, 2));
      console.log("context", JSON.stringify(context, null, 2));
      console.log("env", JSON.stringify(process.env, null, 2));

      const result = await handler(event, context);

      console.log("result", JSON.stringify(result, null, 2));

      return result;
    };
};