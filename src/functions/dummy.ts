import { eventLog, middy } from "../middleware/index.js";

export const handler = middy(() => {
  return Promise.resolve({});
})
  .use(eventLog())
  .start();
