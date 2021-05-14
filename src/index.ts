import * as dotenv from 'dotenv';
import { HaifaBot } from './bot';
import { Rotter } from './scraper/rotter';

dotenv.config();

const bot = new HaifaBot();
const rotter = new Rotter();

rotter.scrape(data => {
    const message =
        `${data.content}
        פורסם על ידי - ${data.credit}`;
    bot.sendMessage(message);
});