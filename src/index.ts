import * as dotenv from 'dotenv';
import { HaifaBot } from './bot';
import { Rotter } from './scraper/rotter';

dotenv.config();

const rotter = new Rotter();
const bot = new HaifaBot();

rotter.scrape(data => {
    const message =
        `${data.content}
        פורסם על ידי - ${data.credit}`;
    bot.sendMessage(message);
});