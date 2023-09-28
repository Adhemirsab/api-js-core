import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";
import { LoanSchedulerRepository } from "../../domain/loan/ports.js";

export const loanSchedulerRepository = (): LoanSchedulerRepository => ({
  createLoanSchedule: async (loan) => {
    const client = new SchedulerClient({ logger: console });

    const expression = new Date(loan.startAt).toISOString().substring(0, 19);

    const command = new CreateScheduleCommand({
      Name: loan.id,
      ScheduleExpression: `at(${expression})`,
      FlexibleTimeWindow: {
        Mode: "FLEXIBLE",
        MaximumWindowInMinutes: 15,
      },
      Target: {
        Arn: process.env.ENV_NOTIFICATION_FUNCTION_ARN,
        RoleArn: process.env.ENV_SCHEDULER_ROLE_ARN,
        Input: JSON.stringify(loan),
      },
      ActionAfterCompletion: "DELETE",
    });

    await client.send(command);

    return true;
  },
});
