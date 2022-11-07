import {Aisle} from "./Aisle";
import {GPS} from "./GPS";
import {Stock} from "./Stock";
import {AuthorizedUser} from "./AuthorizedUser";

export class Store {
    id: number;
    aisles: Aisle[];
    manager: AuthorizedUser;
    overstock: Stock[];
    gps: GPS;
    name: string;

    constructor(number: number, name: string, aisles: Aisle[], manager: AuthorizedUser, overstock: Stock[], gps: GPS) {
        this.id = number;
        this.aisles = aisles;
        this.manager = manager;
        this.overstock = overstock;
        this.gps = gps;
        this.name = name;
    }

    copy() {
        let aisles = this.aisles.map(a => a.copy())
        let overstock = this.overstock.map(o => o.copy())
        return new Store(this.id, this.name, aisles, this.manager, overstock, this.gps.copy());
    }
}