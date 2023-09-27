import { UUIDRepository } from "../../domain/loan/ports.js";

export const uuidRepository = (): UUIDRepository => ({
  generateUUID: () => {
    return "123";
  },
});
