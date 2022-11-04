import {Shelf} from "./Shelf";

export class Aisle {
    id: number;
    shelves: Shelf[];

    constructor(id: number, shelves: Shelf[]) {
        this.id = id;
        this.shelves = shelves;
    }

    copy() {
        let shelves = this.shelves.map(s => s.copy())
        return new Aisle(this.id, shelves);
    }
}