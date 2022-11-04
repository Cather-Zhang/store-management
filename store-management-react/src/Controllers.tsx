import {Corporate} from "./types/Corporate";
import {Store} from "./types/Store";
import {AuthorizedUser} from "./types/AuthorizedUser";
import {GPS} from "./types/GPS";
import {Item} from "./types/Item";
import {Aisle} from "./types/Aisle";
import {Shelf} from "./types/Shelf";
import {ItemLocation} from "./types/ItemLocation";

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

// I think the SKU should be returned from the database, but simulated for now
function makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function createItemController(corporate: Corporate, name: string, desc: string, price: number, maxQuantity: number) {
    let c = corporate.copy();
    c.items.push(new Item(makeid(8), name, desc, price, maxQuantity));
    return c;
}

export function assignItemLocationController(corporate: Corporate, sku: string, location: string) {
    let c = corporate.copy();
    let locations = location.split(";");
    let parsedLocations = locations.map(l => {
        let loc = l.split(",")
        return new ItemLocation(+loc[0], +loc[1]);
    });
    const itemIndex = corporate.items.findIndex(item => { return item.sku === sku; });
    c.items[itemIndex].assignLocations(parsedLocations);
    return c;
}