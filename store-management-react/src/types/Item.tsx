import {ItemLocation} from "./Location";

export class Item {
    sku: string;
    name: string;
    description: string;
    price: number;
    locations: ItemLocation[];
    max: number;

    constructor(sku: string, name: string, description: string, price: number, locations: ItemLocation[], max: number) {
       this.sku = sku;
       this.name = name;
       this.description = description;
       this.price = price;
       this.locations = locations;
       this.max = max;
    }

    copy() {
        return new Item(this.sku, this.name, this.description, this.price, this.locations.map(l => l.copy()), this.max);
    }
}