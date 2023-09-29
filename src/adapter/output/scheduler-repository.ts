import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";
import { epochToMillis } from "../../utilities/time.js";
import { SchedulerRepository } from "../../domain/loan/ports.js";
import { tryFn } from "../../domain/lib/try-fn.js";
import { FrecuencyType } from "../../domain/loan/types.js";

const cronMap: Record<FrecuencyType, string> = {
  daily: "cron(0 0 * * ? *)",
  weekly: "cron(0 0 ? * MON *)",
  monthly: "cron(0 0 1 * ? *)",
};

export const schedulerRepository = (): SchedulerRepository => ({
  createSchedule: async (id, startAt, endAt, frecuencyType, payload) => {
    const cronExpression = cronMap[frecuencyType];

    const client = new SchedulerClient();

    const command = new CreateScheduleCommand({
      Name: id,
      Description: `schedule for item ${id}`,
      ScheduleExpression: cronExpression,
      FlexibleTimeWindow: { Mode: "OFF" },
      Target: {
        Arn: process.env.ENV_NOTIFICATION_FUNCTION_ARN,
        RoleArn: process.env.ENV_SCHEDULER_ROLE_ARN,
        Input: JSON.stringify(payload),
        RetryPolicy: {
          MaximumRetryAttempts: 2,
        },
      },
      ActionAfterCompletion: "NONE", // TODO: change to DELETE
      State: "ENABLED",
      StartDate: new Date(epochToMillis(startAt)),
      EndDate: new Date(epochToMillis(endAt)),
    });

    const [ok, _, error] = await tryFn(() => client.send(command));
    if (!ok) {
      return [false, undefined, error];
    }

    return [true, true, undefined];
  },
});
