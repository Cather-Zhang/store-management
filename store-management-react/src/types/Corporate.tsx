import {Item} from "./Item";
import {Store} from "./Store";

export class Corporate {
    items: Item[];
    stores: Store[];

    constructor(items: Item[], stores: Store[]) {
        this.items = items;
        this.stores = stores;
    }
}