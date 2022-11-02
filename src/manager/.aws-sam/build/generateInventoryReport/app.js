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

class Item {
    constructor(sku, name, description, price, max) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.max = max;
    }
    assignLocations (locations) {
        this.locations = locations;
    }
}

class Stock {
    constructor(item, inventorys) {
        this.item = item;
        this.inventorys = inventorys;
    }
}

class Location {
    constructor(aisle, shelf) {
        this.aisle = aisle;
        this.shelf = shelf;
    }
}

class Inventory {
    constructor(location, quantity) {
        this.location = location;
        this.quantity = quantity;
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
// {  body: '{    "storeId" : "13"   }'
//
// }
//
/** ===>  {     
 * "stocks": [
        {"itemName": "string", "quantity": "integer", "cost": "double", "description": "string","maxQuantity": "integer",
            "locations": [{"aisles": "integer", "shelves":"integer"},]
        },
        //...
    ],
    "totalValue": "double"}
*/


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
                        
    //list all items
    let listAllItems = () => {
        return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Items", [], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        let items = [];
                        for (let r of rows) {
                            let sku = r.sku;
                            let name = r.name;
                            let price = r.price;
                            let max = r.max;
                            let description = r.description;
                            let newItem = new Item(sku, name, description, price, max);

                            items.push(newItem);
                        }

                        return resolve(items);
                    } else {
                        return resolve(false);
                    }
                });
            });
    }
    
        
    // return the locations of an item
    let getLocations = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Locations WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                let locations = [];
                console.log(rows)
                if (rows) {
                    for (let r of rows) {
                        let shelf = r.shelf;
                        let aisle = r.aisle;
                        let location = new Location (aisle, shelf);
                        locations.push(location);
                    }
                    return resolve(locations);
                } else {
                    //console.log("item has not yet been assigned to locations");
                    return resolve(locations);
                }
            });
        });
    }
    
        //find if items are already stored on shelf
    let findStockShelf = (idStore, sku, location) => {
        
        let aisle = location.aisle;
        let shelf = location.shelf;
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND shelf=? AND aisle=?", [idStore, sku, shelf, aisle], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0) {
                    return resolve(rows[0].quantity);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    let totalValue = (stocks) => {
        let total = 0;
        for (let stock of stocks) {
            let price = stock.item.price;
            for (let inventory of stock.inventorys) {
                let quantity = inventory.quantity;
                total = total + price * quantity;
            }
        }
        return total;
    }
    
    try {
            //returns the list of all stores
        const idStore = parseInt(info.storeId);
        
        const items = await listAllItems();
        if (!(items == false)) {
        let stocks = [];
            for (let item of items) {
                let locations = await getLocations(item.sku);
                let inventorys = [];
                
                for (let location of locations) {
                    let newInventory = new Inventory(location, 0);
                    let findStockShelfReturn = await findStockShelf(idStore, item.sku, location);
                    if (!(findStockShelfReturn == false)) {
                        newInventory.quantity = findStockShelfReturn;
                    }
                    inventorys.push(newInventory);
                    
                }
                let stock = new Stock(item, inventorys);
                stocks.push(stock);
            }
            response.status = 200;
            response.stocks = JSON.parse(JSON.stringify(stocks));
            response.totalValue = totalValue(stocks);
        }
        else {
            response.status = 400;
            response.error = "can not generate report";
        }


    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
