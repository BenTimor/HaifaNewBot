import { Telegram } from "./telegram";
import { IBot } from "./types";

export class HaifaBot implements IBot {
    private bots: IBot[];
    
    constructor() {
        const telegramToken = process.env.TOKEN;
        const telegramChatId = process.env.CHAT_ID;

        if (!(telegramToken && telegramChatId)) {
            throw new Error("Configuration error.");
        }

        this.bots = [
            new Telegram(telegramToken, telegramChatId),
        ];
    }

    sendMessage(message: string) {
        this.bots.forEach(bot => {
            bot.sendMessage(message);
        });
    }
}