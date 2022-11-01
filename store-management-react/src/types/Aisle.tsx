import {Shelf} from "./Shelf";

export class Aisle {
    shelves: Shelf[];

    constructor(shelves: Shelf[]) {
        this.shelves = shelves;
    }

    copy() {
        let shelves = this.shelves.map(s => s.copy())
        return new Aisle(shelves);
    }
}