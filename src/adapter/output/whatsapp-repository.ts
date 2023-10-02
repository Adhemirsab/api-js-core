import { WhatssappRepository } from "../../domain/notification/ports.js";

export const whatssappRepository = (): WhatssappRepository => ({
  sendWhatsapp: (_) => {
    // TODO: implement whast send message code here

    return Promise.resolve([true, true, undefined]);
  },
});
