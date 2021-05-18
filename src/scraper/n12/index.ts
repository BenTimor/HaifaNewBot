import { DateTime } from "luxon";
import fetch from "node-fetch";
import { BaseScraper, ScrapedData } from "../types";

const URL = "https://www.mako.co.il/AjaxPage?jspName=getNewsChatMessages.jsp&count=100&page=1&topic=1";

export class N12 extends BaseScraper {
    async scrape(): Promise<ScrapedData[]> {
        const reports = await (await fetch(URL)).json();
        const scrapes: ScrapedData[] = [];

        for (const report of reports) {
            const reportTime = DateTime.fromMillis(report.publishedDate).setZone("UTC+3");

            if (reportTime < this.lastUpdate) continue;

            scrapes.push({
                content: report.messageContent,
                credit: `${report.reporter.reporter.name} / צ'אט הכתבים`
            });
        }

        return scrapes;
    }
}