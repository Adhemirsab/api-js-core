import { WhatssappRepository } from "../../domain/notification/ports.js";
import axios from "axios";
import { tryFn } from "../../domain/lib/try-fn.js";
import { Loan } from "../../domain/loan/types.js";

export const whatssappRepository = (): WhatssappRepository => ({
  sendWhatsapp: async (message) => {
    const { phone, name } = JSON.parse(message) as Loan;

    const token =
      "EAAMfZCGrCvQcBO9LzvN91VIOYkMD3nNzcVzCwrJznqTUwZAnKDJoMsGuD9aaIMsPOFyiSdZCA7geqgT5I5OwtZCJOY89ha8StI54TPAsxCBXZCG6hoZBErUgBqIVks0IwBcnZAWDEZAyRBWm94U9kgks6mMCxTIStghgQRZC3ifo4jTJ5bTmTCDl7BJe1B9If";

    const result = await tryFn(async () => {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v17.0/128041223734612/messages?access_token=${token}`,
        data: {
          messaging_product: "whatsapp",
          to: `51${phone}`,

          type: "template",
          template: {
            name: "message",
            language: {
              code: "es",
            },
          },
          components: [
            {
              type: "BODY",
              parameters: [
                {
                  type: "text",
                  text: name,
                },
              ],
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    });
    return result;
  },
});
