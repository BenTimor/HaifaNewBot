import { ScrapedData } from "../scraper/types";

export class ScrapedDataBase {
    static data: ScrapedData[] = [];

    static hasScrapedData(data: ScrapedData): boolean {
        return ScrapedDataBase.data.filter(savedData => savedData.content == data.content).length != 0;
    }

    static addScrapedData(data: ScrapedData) {
        ScrapedDataBase.data.push(data);
    }
}