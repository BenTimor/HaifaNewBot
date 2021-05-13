import * as dotenv from 'dotenv';
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const botToken = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

if (!botToken || !chatId) {
    throw new Error("You have to set a token and chatid for the bot!");
}

const bot = new TelegramBot(botToken/*, { polling: true }*/);

// TODO do something