import { DemoBot } from "./demo";
import { Telegram } from "./telegram";
import { IBot } from "./types";

export class HaifaBot implements IBot {
    private bots: IBot[];

    constructor(demo: boolean) {
        if (!demo) {
            const telegramToken = process.env.TOKEN;
            const telegramChatId = process.env.CHAT_ID;

            if (!(telegramToken && telegramChatId)) {
                throw new Error("Configuration error.");
            }

            this.bots = [
                new Telegram(telegramToken, telegramChatId),
                new DemoBot(),
            ];
        }
        // In case I just wanna test some stuff
        else {
            this.bots = [
                new DemoBot(),
            ]
        }
    }

    sendMessage(message: string) {
        this.bots.forEach(bot => {
            bot.sendMessage(message);
        });
    }
}