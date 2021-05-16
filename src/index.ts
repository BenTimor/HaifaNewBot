import * as dotenv from 'dotenv';
import { HaifaBot } from './bot';
import { HaifaScraper } from './scraper';

dotenv.config();

const bot = new HaifaBot(process.env.DEMO === "true");
const rotter = new HaifaScraper();

rotter.scrape(data => {
    const message =
        `${data.content}
        פורסם על ידי - ${data.credit}
        ${data.url || ""}`;
    bot.sendMessage(message);
});