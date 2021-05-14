import * as dotenv from 'dotenv';
import { HaifaBot } from './bot';
import { Rotter } from './scraper/rotter';
import { ScrapedData } from './scraper/types';

dotenv.config();

const bot = new HaifaBot();
const rotter = new Rotter();

function checkScrapedData(data: ScrapedData): boolean {
    return data.content.includes("חיפה");
}

rotter.scrape(data => {
    if (!checkScrapedData(data)) return;
    
    const message =
        `${data.content}
        פורסם על ידי - ${data.credit}`;
    bot.sendMessage(message);
});