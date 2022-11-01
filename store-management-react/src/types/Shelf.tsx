import {Stock} from "./Stock";

export class Shelf{
    stocks: Stock[];

    constructor(stocks: Stock[]){
        this.stocks = stocks;
    }

    copy() {
        let stocks = this.stocks.map(s => s.copy())
        return new Shelf(stocks);
    }
}