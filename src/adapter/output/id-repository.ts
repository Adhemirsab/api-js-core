import { ulid } from "ulidx";
import { IDRepository } from "../../domain/loan/ports.js";

export const idRepository = (): IDRepository => ({
  generateID: () => ulid(),
});
