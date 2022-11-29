import {ItemLocation} from "./ItemLocation";

export class Item {
    sku: string;
    name: string;
    description: string;
    price: number;
    location: ItemLocation | null;
    max: number;

    constructor(sku: string, name: string, description: string, price: number, max: number, location: ItemLocation | null) {
       this.sku = sku;
       this.name = name;
       this.description = description;
       this.price = price;
       this.location = location;
       this.max = max;
    }

    assignLocation(location: ItemLocation | null) {
        this.location = location;
    }

    getLocationString() {
        return this.location != null ? this.location.toString() : "None"
    }

    copy() {
        let item = new Item(this.sku, this.name, this.description, this.price, this.max, this.location);
        item.assignLocation(this.location);
        return item;
    }
}