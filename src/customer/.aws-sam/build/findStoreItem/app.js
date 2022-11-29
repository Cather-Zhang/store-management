// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const mysql = require('mysql');

var config = require('./config.json');
var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

class Store {
    constructor(id, name, latitude, longitude, managername) {
        this.idStores = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.manager = managername;
    }
}

class Item {
    constructor(sku, name, description, price, max) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.max = max;
    }
}

class Inventory {
    constructor(id, item, location, quantity) {
        this.idStores = id;
        this.item = item;
        this.location = location;
        this.quantity = quantity;
    }
}

class Location {
    constructor(aisle, shelf) {
        this.aisle = aisle;
        this.shelf = shelf;
    }
}

function query(conx, sql, params) {
    return new Promise((resolve, reject) => {
        //console.log("connecting to db"); 
        conx.query(sql, params, function(err, rows) {
            if (err) {
                // reject because there was an error
                reject(err);
            } else {
                //console.log("rows resolved"); 
                // resolve because we have result(s) from the query. it may be an empty rowset or contain multiple values
                resolve(rows);
            }
        });
    });
}

// Take in as input a payload.
//
// {  body: '{    "latitude" : "12.1",   "longitude" : "81.2",  "type": "sku",  "value": "2"    }'
//
// }
//
// ===>  { "stores": [{"storeId": "4", "item": [...], "location": ["aisle": "1", "shelf": "2"], quantity": "30" ...] }
//


exports.lambdaHandler = async (event, context, callback) => {
    
    context.callbackWaitsForEmptyEventLoop = false;

   // ready to go for CORS. To make this a completed HTTP response, you only need to add a statusCode and a body.
    let response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere
            "Access-Control-Allow-Methods": "POST" // Allow POST request
        }
    }; // response
    
    console.log(event);
    let actual_event = event.body;
    let info = JSON.parse(actual_event);
    console.log("info:" + JSON.stringify(info)); 
    
    // find item(s) given the type (sku, name, or description) within a store
    let findItem = (idStore, searchType, searchQuery) => {
        // let searchType = JSON.stringify(type);
        // let searchQuery = JSON.stringify(value);
        // console.log(searchType)
        
        switch(searchType) {
            case "sku":
                console.log("SKU pls")
                return new Promise((resolve, reject) => {
                    pool.query("SELECT I.*, S.idStores, S.quantity, S.aisle, S.shelf FROM Items I " + 
                                "JOIN (SELECT * FROM Stocks WHERE idStores=? AND sku=? AND onShelf=true AND quantity>0) S ON I.sku = S.sku", [idStore, searchQuery], (error, rows) => {
                        if (error) { return reject(error); }
                        let inventories = [];
                        if (rows.length > 0) {
                            for (let r of rows) {
                                let newItem = new Item(r.sku, r.name, r.description, r.price, r.max);
                                let newInventory = new Inventory(r.idStores, newItem, new Location(r.aisle, r.shelf), r.quantity)
                                inventories.push(newInventory);
                            }
                            return resolve(inventories);
                        } else {
                            return resolve(false);
                        }
                    });
                });
                
            case "name":
                let name = ''.concat('%',searchQuery,'%');
                console.log("Name pls")
                return new Promise((resolve, reject) => {
                    pool.query("SELECT I.*, S.idStores, S.quantity, S.aisle, S.shelf FROM Items I " + 
                                "JOIN (SELECT * FROM Stocks WHERE idStores=? AND onShelf=true AND quantity>0) S " +
                                "ON I.sku=S.sku WHERE I.name LIKE ?", [idStore, name], (error, rows) => {
                        if (error) { return reject(error); }
                        let inventories = [];
                        if (rows.length > 0) {
                            for (let r of rows) {
                                let newItem = new Item(r.sku, r.name, r.description, r.price, r.max);
                                let newInventory = new Inventory(r.idStores, newItem, new Location(r.aisle, r.shelf), r.quantity)
                                inventories.push(newInventory);
                            }
                            return resolve(inventories);
                        } else {
                            return resolve(false);
                        }
                    });
                });
                
            case "description":
                let desc = ''.concat('%',searchQuery,'%');
                console.log("Desc pls")
                return new Promise((resolve, reject) => {
                    pool.query("SELECT I.*, S.idStores, S.quantity, S.aisle, S.shelf FROM Items I " + 
                                "JOIN (SELECT * FROM Stocks WHERE idStores=? AND onShelf=true AND quantity>0) S " +
                                "ON I.sku=S.sku WHERE I.description LIKE ?", [idStore, desc], (error, rows) => {
                        if (error) { return reject(error); }
                        let inventories = [];
                        if (rows.length > 0) {
                            for (let r of rows) {
                                let newItem = new Item(r.sku, r.name, r.description, r.price, r.max);
                                let newInventory = new Inventory(r.idStores, newItem, new Location(r.aisle, r.shelf), r.quantity)
                                inventories.push(newInventory);
                            }
                            return resolve(inventories);
                        } else {
                            return resolve(false);
                        }
                    });
                });
            default:
                return new Promise((reject) => { return reject(false)});
        }
    }
    

    
    try {
        const idStore = parseInt(info.storeId);
        const items = await findItem(idStore, info.type, info.value);
        
        if (items) {
            
            response.status = 200;
            response.stocks = JSON.parse(JSON.stringify(items));
        }
        else {
            response.status = 400;
            response.error = "can not list all stores";
        }
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
