export type ScrapedData = {
    content: string;
    credit: string;
}

export abstract class IScraper {
    protected scrapingCallbacks: ((data: ScrapedData) => void)[] = [];

    abstract scrape(callback: (data: ScrapedData) => void): void;
}