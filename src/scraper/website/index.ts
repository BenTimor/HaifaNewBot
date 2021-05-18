import { DateTime } from "luxon";
import fetch from "node-fetch";
import { BaseScraper, ScrapedData } from "../types";

export class Website extends BaseScraper {
    async scrape(): Promise<ScrapedData[]> {
        const resp = await fetch("https://haifapdates.herokuapp.com/events.json");
        const body = await resp.json();
        const scrapes: ScrapedData[] = [];
        
        for (const item of body) {
            const itemTime = DateTime.fromJSDate(new Date(item.time)).setZone("UTC+3");

            if (itemTime < this.lastUpdate) continue;

            scrapes.push({
                content: item.description,
                credit: item.user,
                url: item.url,
            });
        }

        return scrapes;
    }
} 