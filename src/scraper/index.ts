import { N12 } from "./n12";
import { Rotter } from "./rotter";
import { BaseScraper, ScrapedData } from "./types";
import { Website } from "./website";

export class HaifaScraper extends BaseScraper {
    private scrapers: BaseScraper[];
    static BLOCKED_CREDITS;
    
    constructor() {
        super();

        HaifaScraper.BLOCKED_CREDITS = process.env.BLOCKED_CREDITS?.split(",");

        // All scrapers
        this.scrapers = [
            // new Website(),
            new Rotter(),
            new N12(),
        ];
    }

    static checkScrapedData(data: ScrapedData): boolean {
        return data.content.includes("חיפה") && !(HaifaScraper.BLOCKED_CREDITS?.includes(data.credit));
    }

    scrape(callback: (data: ScrapedData) => void) {
        for (const scraper of this.scrapers) {
            scraper.scrape((data) => {
                HaifaScraper.checkScrapedData(data) && callback(data);
            });
        }
    }
}