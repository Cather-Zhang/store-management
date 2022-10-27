class Store {
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

}