import {Item} from "./Item";

export class Stock{
    item: Item;
    quantity: number;

    constructor(item: Item, quantity: number) {
        this.item = item;
        this.quantity = quantity;
    }

    copy() {
        return new Stock(this.item.copy(), this.quantity);
    }
}