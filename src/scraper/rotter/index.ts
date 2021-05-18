import { BaseScraper, ScrapedData } from "../types";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { DateTime } from "luxon";

const ZONE = "UTC+3";

function parseDateString(dateString?: string): Date {
    if (!dateString) {
        return new Date(0);
    }

    const [hourText, dateText] = dateString.split(" ") || [];
    const [hour, minutes] = hourText.split(":");
    const [day, month] = dateText.split("/");

    console.log(`Building date from hour ${hourText} date ${dateText} hour ${hour} minutes ${minutes} day ${day} month ${month}`);
    

    const date = new Date();
    date.setDate(+day);
    date.setMonth(+month - 1);
    date.setHours(+hour-1, +minutes, 0, 0);

    return date;
}

export class Rotter extends BaseScraper {
    private interval: NodeJS.Timeout;

    constructor() {
        super();

        this.startScraping();

        this.interval = setInterval(() => {
            this.startScraping();
        }, 1000 * +(process.env.SCRAPE_WAIT || 60));
    }

    private async scrapeFeed(document: Document) {
        // Getting news feed
        const news = document.getElementsByTagName("tbody")[3].getElementsByTagName("tr");

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

            const date = DateTime.fromJSDate(parseDateString(newsParts[0].textContent || undefined)).setZone(ZONE);

            // Don't continue if it's old news
            if (date < currentLastDate) continue;
            console.log(`[Rotter] We're calling callbacks because item time ${date.toMillis()} (${date.hour}:${date.minute}:${date.second}) is bigger than current time ${currentLastDate.toMillis()} (${currentLastDate.hour}:${currentLastDate.minute}:${currentLastDate.second})`);


            // Organize our data
            const scrapeData: ScrapedData = {
                content: newsParts[2].textContent || "ישנה בעיה עם המבזק",
                credit: newsParts[1].textContent || "ישנה בעיה עם הקרדיט",
                url: newsParts[2].getElementsByTagName("a")[0].getAttribute("href") || undefined,
            }

            this.callScrapeCallbacks(scrapeData);
        }
    }

    private async scrapeMovingFeed(document: Document) {
        const newsItems = document.querySelectorAll("div[style='margin-top: 10px;']");

        const lastUpdateHour = this.lastUpdate.hour;
        const lastUpdateMinutes = this.lastUpdate.minute;

        newsItems.forEach(item => {
            const timeText = item.getElementsByTagName("span")[0].textContent;
            if (!timeText) return;

            const [hour, minutes] = timeText.split(":") || [];

            const isDayAfter = lastUpdateHour > (+hour + 12);
            // We don't want if it's right after a new day or posted already
            if (!(isDayAfter || (+hour >= lastUpdateHour && +minutes >= lastUpdateMinutes))) {
                return;
            }

            const textElem = item.getElementsByTagName("a")[0];
            const text = textElem.textContent || "";
            const link = textElem.getAttribute("href");

            // Rotter has some 'announcement' topics like this
            if (text.includes("אשכול מרוכז")) return;

            this.callScrapeCallbacks({
                content: text,
                credit: "רוטר",
                url: link || undefined,
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