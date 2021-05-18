import { JSDOM } from "jsdom";
import { DateTime } from "luxon";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { BaseScraper, ScrapedData } from "../types";
import { requestBody } from "./constants";

export class Haipo extends BaseScraper {
    constructor() {
        super()
    }

    async scrape(): Promise<ScrapedData[]> {
        const formData = new URLSearchParams();

        Object.entries(requestBody).forEach(([key, value]) => {
            formData.append(key, value);
        })

        const HTML = (await (await fetch("https://haipo.co.il/wp-admin/admin-ajax.php", {
            method: "POST",
            body: formData 
        })).json()).output;

        const document = new JSDOM(HTML).window.document;
        const articles = document.getElementsByTagName("article");

        const scrapes: ScrapedData[] = [];

        for (const i in articles) {
            const article = articles[i];

            if (!article.getElementsByClassName) continue;

            const date = DateTime.fromISO(article.getElementsByClassName("post-published")[0].getAttribute("datetime") || "", { zone: "UTC+3" });

            if (date < this.lastUpdate) continue;
            
            scrapes.push({
                content: article.getElementsByClassName("title")[0].textContent?.replace(/(\t|\n)/g, "") || "ישנה שגיאה עם תוכן הכתבה",
                credit: `${article.getElementsByClassName("post-author")[0].textContent?.replace(/(\t|\n)/g, "")} / Haipo` || "ישנה שגיאה עם קרדיט הכתבה",
                url: article.getElementsByClassName("post-url")[0].getAttribute("href") || "ישנה שגיאה עם קישור הכתבה",
                validated: true,
            });
        }

        return scrapes;
    }
}