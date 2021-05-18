import { DateTime } from "luxon";
import { ScrapedDataBase } from "../data";

export type ScrapedData = {
    content: string;
    credit: string;
    url?: string;
}

export class BaseScraper {
    protected scrapingCallbacks: ((data: ScrapedData) => void)[] = [];
    protected lastUpdate: DateTime;
    static showedWarning: boolean = false;

    constructor(private timeZone?: string) {
        this.lastUpdate = this.getTime();
        BaseScraper.showedWarning = BaseScraper.showedWarning || console.log(`Make sure the hour in Israel now is ${this.lastUpdate.hour}`) || true;
    }

    scrape(callback: (data: ScrapedData) => void) {
        this.scrapingCallbacks.push(callback);
    }

    callScrapeCallbacks(data: ScrapedData) {
        this.lastUpdate = this.getTime();
        if (ScrapedDataBase.hasScrapedData(data)) return;

        ScrapedDataBase.addScrapedData(data);
        this.scrapingCallbacks.forEach(callback => {
            callback(data);
        });
    }

    getTime(): DateTime {
        return DateTime.now().setZone(this.timeZone || "UTC+3");
    }
}