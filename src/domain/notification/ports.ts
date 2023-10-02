import { Response } from "../lib/try-fn.js";
import { NotificationChannel } from "./types.js";

// inbound
export interface NotificationService {
  sendNotification: (
    channel: NotificationChannel,
    message: string,
  ) => Promise<Response<boolean>>;
}

// outbound
export interface DiscordRepository {
  sendDiscord: (message: string) => Promise<Response<boolean>>;
}

export interface WhatssappRepository {
  sendWhatsapp: (message: string) => Promise<Response<boolean>>;
}
