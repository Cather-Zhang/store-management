import {Item} from "./Item";
import {Store} from "./Store";

export class Corporate {
    items: Item[];
    stores: Store[];

    constructor(items: Item[], stores: Store[]) {
        this.items = items;
        this.stores = stores;
    }

    copy() {
        let items = this.items.map(i => i.copy());
        let stores = this.stores.map(s => s.copy());
        return new Corporate(items, stores);
    }
}