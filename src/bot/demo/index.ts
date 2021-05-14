import { IBot } from "../types";

export class DemoBot implements IBot {
    sendMessage(message: string): void {
        console.log(message);
    }
}