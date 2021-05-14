export type ScrapedData = {
    content: string;
    credit: string;
}

export class BaseScraper {
    protected scrapingCallbacks: ((data: ScrapedData) => void)[] = [];

    scrape(callback: (data: ScrapedData) => void) {
        this.scrapingCallbacks.push(callback);
    }

    callScrapeCallbacks(data: ScrapedData) {
        this.scrapingCallbacks.forEach(callback => {
            callback(data);
        });
    }
}