import {Shelf} from "./Shelf";

export class Aisle {
    shelves: Shelf[];

    constructor(shelves: Shelf[]) {
        this.shelves = shelves;
    }
}