import {
  DiscordRepository,
  NotificationService,
  WhatssappRepository,
} from "./ports.js";

export const notificationUseCase = (
  discordRepository: DiscordRepository,
  whatssappRepository: WhatssappRepository,
): NotificationService => ({
  sendNotification: async (channel, message) => {
    switch (channel) {
      case "discord": {
        return await discordRepository.sendDiscord(message);
      }
      case "whatsapp": {
        return await whatssappRepository.sendWhatsapp(message);
      }
    }
  },
});
