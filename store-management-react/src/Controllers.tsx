import {Corporate} from "./types/Corporate";
import {Store} from "./types/Store";
import {AuthorizedUser} from "./types/AuthorizedUser";
import {GPS} from "./types/GPS";
import {Item} from "./types/Item";
import {Aisle} from "./types/Aisle";
import {Shelf} from "./types/Shelf";
import {ItemLocation} from "./types/Location";

export function deleteStoreController(corporate: Corporate, i: number) {
    let c = corporate.copy();
    c.stores.splice(i, 1);
    return c;
}

export function createStoreController(corporate: Corporate, lat: number, long: number, manager: string, password: string) {
    let c = corporate.copy();
    c.stores.push(new Store(corporate.stores.length, [], new AuthorizedUser("manager", manager, password), [],
        new GPS(long, lat)));
    return c;
}

export function createItemController(corporate: Corporate, name: string, desc: string, price: number, maxQuantity: number, location: string) {
    let c = corporate.copy();
    let locations = location.split(";");
    let parsedLocations = locations.map(l => {
        let loc = l.split(",")
        return new ItemLocation(+loc[0], +loc[1]);
    });
    console.log(new Item("123", name, desc, price, parsedLocations, maxQuantity));
    c.items.push(new Item("123", name, desc, price, parsedLocations, maxQuantity));
    return c;
}