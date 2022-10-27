export default class Store {
    constructor(id, name, latitude, longitude) {
        this.idStores = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    assignManager(managername, password) {
        this.manager = managername;
        this.password = password;
    }
}

export class Item {
    constructor(sku, name, description, price, maxQuantity) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.max = maxQuantity;
    }
    
    assignLocation(locations) {
        this.locations = locations;
    }
}


export class Location {
    constructor(aisle, shelf) {
        this.aisle = aisle;
        this.shelf = shelf;
    }
}

