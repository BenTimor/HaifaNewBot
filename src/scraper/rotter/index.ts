import { BaseScraper, ScrapedData } from "../types";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

function parseDateString(dateString?: string): Date {
    if (!dateString) {
        return new Date(0);
    }

    const [hourText, dateText] = dateString.split(" ") || [];
    const [hour, minutes] = hourText.split(":");
    const [day, month] = dateText.split("/");

    const date = new Date();
    date.setDate(+day);
    date.setMonth(+month - 1);
    date.setHours(+hour, +minutes, 0, 0);

    return date;
}

export class Rotter extends BaseScraper {
    private lastUpdate: Date;
    private interval: NodeJS.Timeout;

    constructor() {
        super();

        this.lastUpdate = new Date();

        this.startScraping();

        this.interval = setInterval(() => {
            this.startScraping();
        }, 1000 * +(process.env.SCRAPE_WAIT || 60));
    }

    private async scrapeFeed(document: Document) {
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

            const date = parseDateString(newsParts[0].textContent || undefined);

            // Set lastUpdate if not exist
            if (!this.lastUpdate) {
                this.lastUpdate = date;
                this.lastUpdate.setSeconds(1);
                break;
            }

            // Don't continue if it's old news
            if (date < currentLastDate) continue;

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

            this.callScrapeCallbacks(scrapeData);
        }
    }

    private async scrapeMovingFeed(document: Document) {
        const newsItems = document.querySelectorAll("div[style='margin-top: 10px;']");

        const lastUpdateHour = this.lastUpdate.getHours();
        const lastUpdateMinutes = this.lastUpdate.getMinutes();

        newsItems.forEach(item => {
            const timeText = item.getElementsByTagName("span")[0].textContent;
            if (!timeText) return;

            const [hour, minutes] = timeText.split(":") || [];

            // We don't want if it's right after a new day or posted already
            if (!(lastUpdateHour > (+hour+12) || (+hour >= lastUpdateHour && +minutes >= lastUpdateMinutes))) {
                return;
            }

            this.callScrapeCallbacks({
                content: item.getElementsByTagName("a")[0].textContent || "",
                credit: "רוטר",
            });
        });
    }

    private async startScraping() {
        console.log("Starting to scrape data");

        // Getting source and creating dom
        const resp = await fetch("https://rotter.net/news/news.php");
        const document = (new JSDOM(await resp.textConverted())).window.document;

        // Scraping main feed
        await this.scrapeFeed(document);
        // Scraping small bottom right moving feed
        await this.scrapeMovingFeed(document);
    }
}