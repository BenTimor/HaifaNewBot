import { ScrapedDataBase } from "../data";

export type ScrapedData = {
    content: string;
    credit: string;
    url?: string;
}

export class BaseScraper {
    protected scrapingCallbacks: ((data: ScrapedData) => void)[] = [];

    scrape(callback: (data: ScrapedData) => void) {
        this.scrapingCallbacks.push(callback);
    }

    callScrapeCallbacks(data: ScrapedData) {
        if (ScrapedDataBase.hasScrapedData(data)) return;

        ScrapedDataBase.addScrapedData(data);
        this.scrapingCallbacks.forEach(callback => {
            callback(data);
        });
    }
}