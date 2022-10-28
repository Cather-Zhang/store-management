import {Stock} from "./Stock";

export class Shelf{
    stocks: Stock[];

    constructor(stocks: Stock[]){
        this.stocks = stocks;
    }
}