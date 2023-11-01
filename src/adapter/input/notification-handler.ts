import { notificationUseCase } from "../../domain/notification/use-case.js";
import { discordRepository } from "../output/discord-repository.js";
import { whatssappRepository } from "../output/whatsapp-repository.js";

export const notificationHandler = async (event: unknown): Promise<boolean> => {
  const discordRepo = discordRepository();
  const whatssappRepo = whatssappRepository();

  const message = JSON.stringify(event);

  const [ok, result, error] = await notificationUseCase(
    discordRepo,
    whatssappRepo,
  ).sendNotification("whatsapp", message);

  if (!ok) {
    throw error;
  }

  return result;
};
