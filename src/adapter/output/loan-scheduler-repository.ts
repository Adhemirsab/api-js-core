import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";
import { LoanSchedulerRepository } from "../../domain/loan/ports.js";
import { epochToMillis, minutesToSeconds } from "../../utilities/time.js";

const SECONDS_GRACE_PERIOD = 60;

export const loanSchedulerRepository = (): LoanSchedulerRepository => ({
  createLoanSchedule: async (loan) => {
    const client = new SchedulerClient();

    const start = loan.startAt;
    const end = start + SECONDS_GRACE_PERIOD + minutesToSeconds(5) * loan.count;

    const command = new CreateScheduleCommand({
      Name: loan.id,
      Description: `schedule for loan ${loan.id}`,
      ScheduleExpression: `cron(0/5 * * * ? *)`,
      FlexibleTimeWindow: { Mode: "OFF" },
      Target: {
        Arn: process.env.ENV_NOTIFICATION_FUNCTION_ARN,
        RoleArn: process.env.ENV_SCHEDULER_ROLE_ARN,
        Input: JSON.stringify(loan),
        RetryPolicy: {
          MaximumRetryAttempts: 2,
        },
      },
      ActionAfterCompletion: "DELETE",
      State: "ENABLED",
      StartDate: new Date(epochToMillis(start)),
      EndDate: new Date(epochToMillis(end)),
    });

    await client.send(command);

    return true;
  },
});
