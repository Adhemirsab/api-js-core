import { DiscordRepository, NotificationService } from "./ports.js";

export const notificationUseCase = (
  discordRepository: DiscordRepository,
): NotificationService => ({
  sendNotification: async (channel, message) => {
    switch (channel) {
      case "discord": {
        return await discordRepository.sendDiscord(message);
      }
    }
  },
});
