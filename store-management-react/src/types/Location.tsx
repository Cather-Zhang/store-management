export class ItemLocation {
    aisle: number;
    shelf: number;

    constructor(aisle: number, shelf: number) {
        this.aisle = aisle;
        this.shelf = shelf;
    }

    copy() {
        return new ItemLocation(this.aisle, this.shelf);
    }
}