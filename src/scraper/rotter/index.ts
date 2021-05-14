import { IScraper, ScrapedData } from "../types";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

export class Rotter extends IScraper {
    private lastUpdate: Date;
    private interval: NodeJS.Timeout;

    constructor() {
        super();

        this.lastUpdate = new Date();

        this.interval = setInterval(() => {
            this.startScraping();
        }, 1000 * +(process.env.SCRAPE_WAIT || 60));
    }

    private async startScraping() {
        console.log("Starting to scrape data");

        // Getting source and creating dom
        const resp = await fetch("https://rotter.net/news/news.php");
        const document = (new JSDOM(await resp.textConverted())).window.document;

        // Getting news feed
        const news = document.getElementsByTagName("tbody")[3].getElementsByTagName("tr");
        let dateUpdated = false;

        // We're changing the lastUpdate in the loop, so we have to save it somewhere for conditions
        const currentLastDate = this.lastUpdate;

        // Checking all of the news
        for (const newsItemNumber in news) {
            const newsItem = news[newsItemNumber];

            if (!newsItem.getElementsByTagName) {
                continue;
            }

            const newsParts = newsItem.getElementsByTagName("td");

            if (newsParts.length < 3) continue;

            // Creating date object
            const [hourText, dateText] = newsParts[0].textContent?.split(" ") || [];
            const [hour, minutes] = hourText.split(":");
            const [day, month] = dateText.split("/");

            const date = new Date();
            date.setDate(+day);
            date.setMonth(+month - 1);
            date.setHours(+hour, +minutes, 0, 0);

            // Set lastUpdate if not exist
            if (!this.lastUpdate) {
                this.lastUpdate = date;
                this.lastUpdate.setSeconds(1);
                break;
            }

            // Don't continue if we already updated the news from here
            if (date < currentLastDate) break;
            
            // UPdate date if needed
            if (!dateUpdated) {
                this.lastUpdate = date;
                this.lastUpdate.setSeconds(1);
                dateUpdated = true;
            };

            // Organize our data
            const scrapeData: ScrapedData = {
                content: newsParts[2].textContent || "ישנה בעיה עם המבזק",
                credit: newsParts[1].textContent || "ישנה בעיה עם הקרדיט"
            }

            // Send the data to scrape callbacks
            this.scrapingCallbacks.forEach(callback => {
                callback(scrapeData);
            });
        }

        console.log("Data scraped and sent");
    }

    scrape(callback: (data: ScrapedData) => void) {
        this.scrapingCallbacks.push(callback);
    }
}