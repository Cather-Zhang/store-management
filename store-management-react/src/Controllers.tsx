import {Corporate} from "./types/Corporate";
import {Store} from "./types/Store";
import {AuthorizedUser} from "./types/AuthorizedUser";
import {GPS} from "./types/GPS";
import {Item} from "./types/Item";
import {ItemLocation} from "./types/ItemLocation";
import {APINamespace, makeSKU, sendRequest} from "./Utilities";

export async function deleteStoreController(corporate: Corporate, id: number) {
    let c = corporate.copy();
    let response = await sendRequest(APINamespace.Corporate, "/removeStore", { "storeId": id });
    c = updateStoresController(c, response);
    console.log(response)
    return c;
}

export function createStoreController(corporate: Corporate, lat: number, long: number, manager: string, password: string) {
    let c = corporate.copy();
    c.stores.push(new Store(corporate.stores.length, [], new AuthorizedUser("manager", manager, password), [],
        new GPS(long, lat)));
    return c;
}

export async function createItemController(corporate: Corporate, name: string, desc: string, price: number, maxQuantity: number, handleClose: any) {
    let c = corporate.copy();
    let sku = makeSKU();
    let response = await sendRequest(APINamespace.Corporate, "/addItem", {
        "sku": sku,
        "name": name,
        "price": price,
        "description": desc,
        "max": maxQuantity
    });
    if (response.status === 200) {
        handleClose();
        c.items.push(new Item(sku, name, desc, price, maxQuantity));
    }
    return c;
}

export function assignItemLocationController(corporate: Corporate, sku: string, location: string) {
    let c = corporate.copy();
    let locations = location.split(";");
    let parsedLocations = locations.map(l => {
        let loc = l.split(",")
        return new ItemLocation(+loc[0], +loc[1]);
    });
    const itemIndex = corporate.items.findIndex(item => {
        return item.sku === sku;
    });
    c.items[itemIndex].assignLocations(parsedLocations);
    return c;
}

function assignStores(corporate: Corporate, stores: any) {
    corporate.stores = stores.stores.map((s: any) =>
        new Store(s.idStores, [], new AuthorizedUser("manager", s.manager, ""), [],
            new GPS(s.longitude, s.latitude))
    );
}

function assignItems(corporate: Corporate, items: any) {
    corporate.items = items.items.map((i: any) => {
        let item = new Item(i.sku, i.name, i.description, i.price, i.max);
        item.assignLocations(i.locations.map((l: { aisle: number, shelf: number }) => new ItemLocation(l.aisle, l.shelf)));
        return item;
    });
}

export function updateItemsController(corporate: Corporate, items: any) {
    let c = corporate.copy();
    assignItems(c, items);
    return c;
}

export function updateStoresController(corporate: Corporate, stores: any) {
    let c = corporate.copy();
    assignStores(c, stores);
    return c;
}

export function updateStateController(corporate: Corporate, stores: any, items: any) {
    let c = corporate.copy();
    assignStores(c, stores);
    assignItems(c, items);
    return c;
}