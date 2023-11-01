import { WhatssappRepository } from "../../domain/notification/ports.js";
import axios from "axios";
import { tryFn } from "../../domain/lib/try-fn.js";
import { Loan } from "../../domain/loan/types.js";

export const whatssappRepository = (): WhatssappRepository => ({
  sendWhatsapp: async (message) => {
    const { phone, name } = JSON.parse(message) as Loan;

    const token =
      "EAAMfZCGrCvQcBO7ZBoTuTC1xypUBcXinKMtUQRBnNSXDK7o3zH7tDPvviPnXIuG2XEY4w7PQgh7KaqtEkj3FbNmzFVFSceXqu7f36OTVqdNssXGZCYe3fusnLhcuaEYVPS28ZC2ctRXx85iozNbYCbBfCYXy8Vyk1AT8Q4eC9UcpNtTZBcDGYZAAEdeys9FtPsJsgBZCetaXvuLCSoe";

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
