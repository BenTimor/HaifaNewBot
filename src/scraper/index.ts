import { N12 } from "./n12";
import { Rotter } from "./rotter";
import { BaseScraper, ScrapedData } from "./types";
import { Website } from "./website";

const BLOCKED_CREDITS = process.env.BLOCKED_CREDITS?.split(",");

export class HaifaScraper extends BaseScraper {
    private scrapers: BaseScraper[];
    
    constructor() {
        super();
        // All scrapers
        this.scrapers = [
            // new Website(),
            new Rotter(),
            new N12(),
        ];
    }

    static checkScrapedData(data: ScrapedData): boolean {
        console.log(`Blocked Credits: ${BLOCKED_CREDITS}. Credit: ${data.credit}`);
        
        return data.content.includes("חיפה") && !(BLOCKED_CREDITS?.includes(data.credit));
    }

    scrape(callback: (data: ScrapedData) => void) {
        for (const scraper of this.scrapers) {
            scraper.scrape((data) => {
                HaifaScraper.checkScrapedData(data) && callback(data);
            });
        }
    }
}