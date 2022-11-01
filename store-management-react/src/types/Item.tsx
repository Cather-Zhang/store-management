export class Item {
    sku: string;
    name: string;
    description: string;
    price: number;
    aisle: number;
    shelf: number;
    max: number;

    constructor(sku: string, name: string, description: string, price: number, aisle: number, shelf: number, max: number) {
       this.sku = sku;
       this.name = name;
       this.description = description;
       this.price = price;
       this.aisle = aisle;
       this.shelf = shelf;
       this.max = max;
    }

    copy() {
        return new Item(this.sku, this.name, this.description, this.price, this.aisle, this.shelf, this.max);
    }
}