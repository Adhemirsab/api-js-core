import { tryFn } from "../../domain/lib/try-fn.js";
import { LambdaRepository } from "../../domain/loan/ports.js";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export const newLambdaRepository = (): LambdaRepository => ({
  invoke: async (lambdaName, payload) => {
    const client = new LambdaClient();

    const command = new InvokeCommand({
      FunctionName: lambdaName,
      Payload: JSON.stringify(payload),
    });

    const [ok, result, error] = await tryFn(() => client.send(command));
    if (!ok) {
      return [false, undefined, error];
    }

    const something = result.Payload?.transformToString();

    return [true, something, undefined];
  },
});
