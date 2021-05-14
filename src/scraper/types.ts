export type ScrapedData = {
    content: string;
    credit: string;
}

export abstract class IScraper {
    abstract scrape(callback: (data: ScrapedData) => void): void;

    checkScrapedData(data: ScrapedData): boolean {
        return true; // TODO Implement check for scraped data if it contains haifa stuff
    }
}