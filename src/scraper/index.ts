import { Haipo } from "./haipo";
import { N12 } from "./n12";
import { Rotter } from "./rotter";
import { BaseScraper, ScrapedData } from "./types";
import { Website } from "./website";

export class HaifaScraper {
    private scrapers: BaseScraper[];
    static BLOCKED_CREDITS;
    
    constructor() {
        HaifaScraper.BLOCKED_CREDITS = process.env.BLOCKED_CREDITS?.split(",");

        // All scrapers
        this.scrapers = [
            // new Website(),
            new Rotter(),
            new N12(),
            new Haipo(),
        ];
    }

    static checkScrapedData(data: ScrapedData): boolean {
        return data.content.includes("חיפה") && !(HaifaScraper.BLOCKED_CREDITS?.includes(data.credit));
    }

    onScrape(callback: (data: ScrapedData) => void) {
        for (const scraper of this.scrapers) {
            scraper.onScrape((data) => {
                (data.validated || HaifaScraper.checkScrapedData(data)) && callback(data);
            });
        }
    }
}