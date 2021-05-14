import TelegramBot from "node-telegram-bot-api";
import { BotType } from "../types";

export class Telegram implements BotType {
    private bot;

    constructor(botToken: string, private chatId: string) {
        this.bot = new TelegramBot(botToken/*, { polling: true }*/);
    }

    sendMessage(message: string) {
        this.bot.sendMessage(this.chatId, message);
    }
}

