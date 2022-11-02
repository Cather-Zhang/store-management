import {Corporate} from "./types/Corporate";
import {Store} from "./types/Store";
import {AuthorizedUser} from "./types/AuthorizedUser";
import {GPS} from "./types/GPS";

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