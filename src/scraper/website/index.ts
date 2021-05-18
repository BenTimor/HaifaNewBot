import { DateTime } from "luxon";
import fetch from "node-fetch";
import { BaseScraper } from "../types";

export class Website extends BaseScraper {
    constructor() {
        super();

        this.scrapeEventsJSON();

        setInterval(() => {
            this.scrapeEventsJSON();
        }, 1000 * +(process.env.SCRAPE_WAIT || 60))
    }

    async scrapeEventsJSON() {
        const resp = await fetch("https://haifapdates.herokuapp.com/events.json");
        const body = await resp.json();

        const currentTime = this.lastUpdate;
        
        for (const item of body) {
            const itemTime = DateTime.fromJSDate(new Date(item.time)).setZone("UTC+3");

            if (itemTime < currentTime) continue;

            this.callScrapeCallbacks({
                content: item.description,
                credit: item.user,
                url: item.url,
            });
        }
    }
} 