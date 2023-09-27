import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from "axios";
import { tryFn } from "../utilities/try-fn.js";
import { eventLog, middleware } from "../middleware/index.js";

const createLoanHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<unknown>> => {
  const { n } = JSON.parse(event.body || "{}") as {
    n: number;
  };

  const [ok, name] = await tryFn(async () => {
    const { data } = await axios.get<{ name: string }>(
      `https://rickandmortyapi.com/api/character/${n}`,
    );

    console.log(data);

    return data.name;
  });

  const result = {
    message: ok ? name : "BRUH",
  };

  return result;
};

export const handler = middleware(createLoanHandler).use(eventLog()).start();
