import { DateTime } from "luxon";
import { ScrapedDataBase } from "../data";

export type ScrapedData = {
    content: string;
    credit: string;
    url?: string;
    validated?: boolean;
}

export abstract class BaseScraper {
    protected scrapingCallbacks: ((data: ScrapedData) => void)[] = [];
    protected lastUpdate: DateTime;
    static showedWarning: boolean = false;

    constructor(private timeZone?: string) {
        this.lastUpdate = this.getTime();
        BaseScraper.showedWarning = BaseScraper.showedWarning || console.log(`Make sure the hour in Israel now is ${this.lastUpdate.hour}`) || true;
    
        const callScrape = async () => {
            this.callScrapeCallbacks(await this.scrape());
        }

        callScrape();

        setInterval(callScrape, 1000 * +(process.env.SCRAPE_WAIT || 60));
    }

    abstract scrape(): Promise<ScrapedData[]>;

    onScrape(callback: (data: ScrapedData) => void) {
        this.scrapingCallbacks.push(callback);
    }

    callScrapeCallbacks(datas: ScrapedData[]) {
        datas.forEach(data => {
            this.lastUpdate = this.getTime();
            if (ScrapedDataBase.hasScrapedData(data)) return;

            ScrapedDataBase.addScrapedData(data);
            this.scrapingCallbacks.forEach(callback => {
                callback(data);
            });
        })
    }

    getTime(): DateTime {
        return DateTime.now().setZone(this.timeZone || "UTC+3");
    }
}