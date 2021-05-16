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
        ];
    }

    static checkScrapedData(data: ScrapedData): boolean {
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