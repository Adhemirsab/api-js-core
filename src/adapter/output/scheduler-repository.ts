import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";
import { epochToMillis, epochToUTC } from "../../utilities/time.js";
import { SchedulerRepository } from "../../domain/loan/ports.js";
import { tryFn } from "../../domain/lib/try-fn.js";
import { FrecuencyType } from "../../domain/loan/types.js";

const cronMap = (epochStartAt: number): Record<FrecuencyType, string> => {
  const { minutes, hours, dayOfTheMonth, dayOfTheWeek } =
    epochToUTC(epochStartAt);

  return {
    daily: `cron(${minutes} ${hours} * * ? *)`,
    weekly: `cron(${minutes} ${hours} ? * ${dayOfTheWeek} *)`,
    monthly: `cron(${minutes} ${hours} ${dayOfTheMonth} * ? *)`,
  };
};

export const schedulerRepository = (): SchedulerRepository => ({
  createSchedule: async (id, startAt, endAt, frecuencyType, payload) => {
    const cronExpression = cronMap(startAt)[frecuencyType];

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
