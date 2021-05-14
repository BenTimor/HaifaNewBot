import { Rotter } from "./rotter";
import { IScraper, ScrapedData } from "./types";

export class HaifaScraper extends IScraper {
    private scrapers: IScraper[];
    
    constructor() {
        super();
        // All scrapers
        this.scrapers = [
            new Rotter()
        ];
    }

    scrape(callback: (data: ScrapedData) => void) {
        for (const scraper of this.scrapers) {
            scraper.scrape(callback);
        }
    }
}