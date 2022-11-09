import {Stock} from "./Stock";

export class Shelf {
    id: number;
    stocks: Stock[];

    constructor(id: number, stocks: Stock[]) {
        this.id = id;
        this.stocks = stocks;
    }

    copy() {
        let stocks = this.stocks.map(s => s.copy())
        return new Shelf(this.id, stocks);
    }
}