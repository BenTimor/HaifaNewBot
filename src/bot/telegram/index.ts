import TelegramBot from "node-telegram-bot-api";
import { IBot } from "../types";

export class Telegram implements IBot {
    private bot: TelegramBot;

    constructor(botToken: string, private chatId: string) {
        this.bot = new TelegramBot(botToken, { polling: false });
    }

    sendMessage(message: string) {
        this.bot.sendMessage(this.chatId, message);
    }
}

