import { DateTime } from "luxon";
import fetch from "node-fetch";
import { BaseScraper } from "../types";

const URL = "https://www.mako.co.il/AjaxPage?jspName=getNewsChatMessages.jsp&count=100&page=1&topic=1";

export class N12 extends BaseScraper {
    constructor() {
        super();
        this.scrapeChat();
    }

    async scrapeChat() {
        const reports = await (await fetch(URL)).json();
        const currentTime = this.lastUpdate;

        for (const report of reports) {
            const reportTime = DateTime.fromMillis(report.publishedDate).setZone("UTC+3");

            if (reportTime < currentTime) continue;
            console.log(`[N12] We're calling callbacks because item time ${reportTime.toMillis()} (${reportTime.hour}:${reportTime.minute}:${reportTime.second}) is bigger than current time ${currentTime.toMillis()} (${currentTime.hour}:${currentTime.minute}:${currentTime.second})`);

            this.callScrapeCallbacks({
                content: report.messageContent,
                credit: `${report.reporter.reporter.name} / צ'אט הכתבים`
            });
        }
    }
}