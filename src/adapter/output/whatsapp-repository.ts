import { WhatssappRepository } from "../../domain/notification/ports.js";
import axios from "axios";
import { tryFn } from "../../domain/lib/try-fn.js";
import { Loan } from "../../domain/loan/types.js";

export const whatssappRepository = (): WhatssappRepository => ({
  sendWhatsapp: async (message) => {
    const { phone, name } = JSON.parse(message) as Loan;

    const token =
      "EAAMfZCGrCvQcBO9LzvN91VIOYkMD3nNzcVzCwrJznqTUwZAnKDJoMsGuD9aaIMsPOFyiSdZCA7geqgT5I5OwtZCJOY89ha8StI54TPAsxCBXZCG6hoZBErUgBqIVks0IwBcnZAWDEZAyRBWm94U9kgks6mMCxTIStghgQRZC3ifo4jTJ5bTmTCDl7BJe1B9If";

    const url = "https://graph.facebook.com/v18.0/128041223734612/messages";

    const headers = {
      authorization: `Bearer ${token}`,
    };

    const data = {
      messaging_product: "whatsapp",
      to: `51${phone}`,
      type: "template",
      template: {
        name: "message",
        language: { code: "es" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: name }],
          },
        ],
      },
    };

    const result = await tryFn(async () => {
      await axios.post(url, data, { headers });

      return true;
    });

    return result;
  },
});
