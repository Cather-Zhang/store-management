import {Aisle} from "./Aisle";
import {AuthorizedUser} from "./AuthorizedUser";
import {GPS} from "./GPS";
import {Stock} from "./Stock";

export class Store {
    number: number;
    aisles: Aisle[];
    manager: AuthorizedUser;
    overstock: Stock[];
    gps: GPS;

    constructor(number: number, aisles: Aisle[], manager: AuthorizedUser, overstock: Stock[], gps: GPS) {
        this.number = number;
        this.aisles = aisles;
        this.manager = manager;
        this.overstock = overstock;
        this.gps = gps;
    }

    copy() {
        let aisles = this.aisles.map(a => a.copy())
        let overstock = this.overstock.map(o => o.copy())
        return new Store(this.number, aisles, this.manager.copy(), overstock, this.gps.copy());
    }
}