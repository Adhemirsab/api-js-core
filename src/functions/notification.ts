import { notificationHandler } from "../adapter/input/notification-handler.js";
import { eventLog, middy } from "../middleware/index.js";

export const handler = middy(notificationHandler).use(eventLog()).start();
