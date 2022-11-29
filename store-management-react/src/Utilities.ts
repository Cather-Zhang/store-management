import {Item} from "./types/Item";
import {Store} from "./types/Store";
import {ItemLocation} from "./types/ItemLocation";

let baseURLs = ["https://vek78vup05.execute-api.us-east-2.amazonaws.com/Prod", "https://243g1cmra7.execute-api.us-east-2.amazonaws.com/Prod", "https://errouju1tk.execute-api.us-east-2.amazonaws.com/Prod"];

export enum APINamespace {
    Manager = 0,
    Corporate = 1,
    Customer = 2
}

export function makeSKU() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function sendRequest(namespace: APINamespace, endpoint: string, data: any) {
    let baseURL = baseURLs[namespace];

    let response;
    if (data) {
        response = await fetch(baseURL + endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({body: JSON.stringify(data)})
        });
    } else {
        response = await fetch(baseURL + endpoint, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
    }
    let output = await response.json();
    return output.errorType ? null : output;
}

export function itemJSONToTS(items: any) {
    return items.items.map((i: any) => {
        return new Item(i.sku, i.name, i.description, i.price, i.max, i.locations[0] ? new ItemLocation(i.locations[0].aisle, i.locations[0].shelf) : null);
    });
}

export function storeJSONtoTS(stores: any) {
    return stores.store.map((i: any) => {
        return new Store(i.number, i.name, i.aisle, i.manager, i.overstock, i.gps);
    });
}

export function getById(id: string) {
    return (document.getElementById(id) as HTMLInputElement)?.value;
}