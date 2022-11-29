import {Corporate} from "./types/Corporate";
import {Store} from "./types/Store";
import {GPS} from "./types/GPS";
import {Item} from "./types/Item";
import {ItemLocation} from "./types/ItemLocation";
import {APINamespace, itemJSONToTS, makeSKU, sendRequest} from "./Utilities";
import {Shelf} from "./types/Shelf";
import {Aisle} from "./types/Aisle";
import {Stock} from "./types/Stock";

export async function deleteStoreController(corporate: Corporate, id: number) {
    let c = corporate.copy();
    let response = await sendRequest(APINamespace.Corporate, "/removeStore", {"storeId": id});
    c = updateStoresController(c, response);
    return c;
}

export async function createStoreController(corporate: Corporate, name: string, lat: number, long: number, manager: string, password: string, handleClose: any) {
    let c = corporate.copy();

    let response = await sendRequest(APINamespace.Corporate, "/addStore", {
        "name": name,
        "latitude": lat,
        "longitude": long,
        "manager": manager,
        "password": password
    });

    if (response.status === 200) {
        handleClose();
        updateStoresController(corporate, response);
    }

    return c;
}

export async function createItemController(corporate: Corporate, sku: string, name: string, desc: string, price: number, maxQuantity: number, handleClose: any) {
    let c = corporate.copy();
    let response = await sendRequest(APINamespace.Corporate, "/addItem", {
        "sku": sku,
        "name": name,
        "price": price,
        "description": desc,
        "max": maxQuantity
    });
    if (response.status === 200) {
        handleClose();
        c.items.push(new Item(sku, name, desc, price, maxQuantity, null));
    }
    return c;
}

export function buyItemsController(corporate: Corporate, storeId: number | null, location: ItemLocation | null,
                                         sku: string | null, buyQuantity: number | null) {
    let c = corporate.copy();
    let item = c.stores.find((s: Store) => s.id === storeId)?.aisles.find((a: Aisle) => a.id === location?.aisle)?.
        shelves.find((sh: Shelf) => sh.id === location?.shelf)?.stocks.find((stock: Stock) => stock.item.sku === sku);
    if(item) {
        item.quantity -= buyQuantity ?? 0;
    }
    return c;
}

export async function assignItemLocationController(corporate: Corporate, sku: string, location: string, handleClose: any) {
    let c = corporate.copy();
    let locations = location.split(";");
    let parsedLocations = locations.map(l => {
        let loc = l.split(",")
        return new ItemLocation(+loc[0], +loc[1]);
    });
    const itemIndex = corporate.items.findIndex(item => {
        return item.sku === sku;
    });

    let response = await sendRequest(APINamespace.Corporate, "/assignItem", {
        "sku": corporate.items[itemIndex].sku,
        "locations": "[" + parsedLocations.map((loc: ItemLocation) => loc.toJSONString()).join(", ") + "]"
    });
    if (response.status === 200) {
        handleClose();
        c.items[itemIndex].assignLocation(parsedLocations[0]);
    }

    return c;
}

function assignStores(corporate: Corporate, stores: any) {
    corporate.stores = stores.stores.map((s: any) =>
        new Store(s.idStores, s.name, [], s.manager, [],
            new GPS(s.longitude, s.latitude))
    );
}

function assignItems(corporate: Corporate, items: any) {
    corporate.items = itemJSONToTS(items);
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