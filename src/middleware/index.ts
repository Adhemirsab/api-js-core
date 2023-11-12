import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { tryFn } from "../domain/lib/try-fn.js";

type AwsFunction<E, C, R> = (event: E, context: C) => Promise<R>;

type Middleware<E, C, R> = (next: AwsFunction<E, C, R>) => AwsFunction<E, C, R>;

export const middy = <E, C, R>(handler: AwsFunction<E, C, R>) => {
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
  return (next) => async (event, context) => {
    console.log("event |", JSON.stringify(event, null, 2));
    console.log("context |", JSON.stringify(context, null, 2));
    console.log("env |", JSON.stringify(process.env, null, 2));

    const result = await next(event, context);

    console.log("result |", JSON.stringify(result, null, 2));

    return result;
  };
};

export const httpHeaders = <E, C>(
  ...headers: APIGatewayProxyStructuredResultV2["headers"][]
): Middleware<E, C, APIGatewayProxyStructuredResultV2> => {
  return (next) => async (event, context) => {
    const result = await next(event, context);

    const composeHeaders = headers.reduce<
      APIGatewayProxyStructuredResultV2["headers"]
    >((result, header) => {
      return { ...result, ...header };
    }, {});

    result.headers = {
      ...result.headers,
      ...composeHeaders,
    };

    return result;
  };
};

export const httpError = <E, C>(): Middleware<
  E,
  C,
  APIGatewayProxyStructuredResultV2
> => {
  return (next) => async (event, context) => {
    const [ok, result, error] = await tryFn(() => next(event, context));
    if (ok) {
      return result;
    }

    const body = {
      message: ["unhandled error", error.message].join(": "),
    };

    return {
      statusCode: 500,
      body: JSON.stringify(body),
    };
  };
};
