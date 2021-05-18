import { DateTime } from "luxon";
import fetch from "node-fetch";
import { BaseScraper, ScrapedData } from "../types";

export class Website extends BaseScraper {
    async scrape(): Promise<ScrapedData[]> {
        const resp = await fetch("https://haifa-news.co.il/events.json");
        const body = await resp.json();
        const scrapes: ScrapedData[] = [];
        
        for (const item of body) {
            const itemTime = DateTime.fromJSDate(new Date(item.created_at)).setZone("UTC+3");

            if (itemTime < this.lastUpdate) continue;

            scrapes.push({
                content: item.description,
                credit: item.user,
                url: "https://haifa-news.co.il",
            });
        }

        return scrapes;
    }
} 