import { Rotter } from "./rotter";
import { BaseScraper, ScrapedData } from "./types";

export class HaifaScraper extends BaseScraper {
    private scrapers: BaseScraper[];
    
    constructor() {
        super();
        // All scrapers
        this.scrapers = [
            new Rotter()
        ];
    }

    static checkScrapedData(data: ScrapedData): boolean {
        return data.content.includes("חיפה") || data.content.includes("לבנון");
    }

    scrape(callback: (data: ScrapedData) => void) {
        for (const scraper of this.scrapers) {
            scraper.scrape((data) => {
                HaifaScraper.checkScrapedData(data) && callback(data);
            });
        }
    }
}