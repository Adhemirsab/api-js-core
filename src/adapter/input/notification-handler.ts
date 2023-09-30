import { notificationUseCase } from "../../domain/notification/use-case.js";
import { discordRepository } from "../output/discord-repository.js";

export const notificationHandler = async (event: unknown): Promise<boolean> => {
  const discordRepo = discordRepository();

  const message = JSON.stringify(event);

  const [ok, result, error] = await notificationUseCase(
    discordRepo,
  ).sendNotification("discord", message);

  if (!ok) {
    throw error;
  }

  return result;
};
