import {ItemLocation} from "./ItemLocation";

export class Item {
    sku: string;
    name: string;
    description: string;
    price: number;
    locations: ItemLocation[];
    max: number;

    constructor(sku: string, name: string, description: string, price: number, max: number) {
       this.sku = sku;
       this.name = name;
       this.description = description;
       this.price = price;
       this.locations = [];
       this.max = max;
    }

    assignLocations(locations: ItemLocation[]) {
        this.locations = locations;
    }

    getLocationString() {
        return this.locations.length > 0 ? this.locations.join("; ") : "None"
    }

    copy() {
        let item = new Item(this.sku, this.name, this.description, this.price, this.max);
        item.assignLocations(this.locations.map(l => l.copy()));
        return item;
    }
}