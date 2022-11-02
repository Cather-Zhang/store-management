import {Corporate} from "./types/Corporate";

export function deleteStoreController(corporate: Corporate, i: number) {
    let c = corporate.copy();
    c.stores.splice(i, 1);
    return c;
}