import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from "axios";
import { tryFn } from "../utilities/try-fn.js";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<unknown>> => {
  const { n } = JSON.parse(event.body || "{ number: 2 }") as { n: number };

  const [ok, name] = await tryFn(() =>
    axios.get(`https://rickandmortyapi.com/api/character/${n}`),
  );

  const result = {
    message: ok ? name : "NOONE",
  };

  console.log(JSON.stringify(result, null, 2));

  return result;
};
