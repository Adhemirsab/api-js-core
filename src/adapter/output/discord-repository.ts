import axios from "axios";
import { DiscordRepository } from "../../domain/notification/ports.js";

export const discordRepository = (): DiscordRepository => ({
  sendDiscord: async (message) => {
    const channelId = "1157443834125484145";

    const token =
      "NzkwMDU4OTU5NzEyNTUwOTUz.GdIo9y.OsQroib911ckDfWFb0NAST7ZWas-2UxJq6FR8c";

    await axios.post(
      `https://discord.com/api/channels/${channelId}/messages`,
      { content: message },
      {
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return [true, true, undefined];
  },
});
