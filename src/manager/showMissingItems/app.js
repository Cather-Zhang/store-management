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
    assignLocations(locations) {
        this.locations = locations;
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

/**
const processShipmentRequest = {
    "storeId": "integer",
    "shipments": [
        {"sku": "string", "quantity": "integer"},
        //...
    ]
}
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
    
    
    //find if items are in store
    let findItemInStore = (idStore, sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND onShelf=true", [idStore, sku], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0 && rows[0].quantity > 0) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }


    
    try 
    {
        const idStore = parseInt(info.storeId);
        let allItems = await listAllItems();
        if (!(allItems == false)) {
            let exist;
            let missingItemsReturn = [];
            //console.log(allItems);
            for (let item of allItems) {
                //console.log(item);
                exist = await findItemInStore(idStore, item.sku);
                if (exist == false) {
                    let locations = await getLocations(item.sku);
                    if (locations.length > 0) {
                        item.assignLocations(locations);
                        missingItemsReturn.push(item);
                    }
                }
            }
            response.status = 200;
            response.missingItems = JSON.parse(JSON.stringify(missingItemsReturn));
            
        }
        
        else {
            response.status = 400;
            response.error = "can not get all items"
        }
        
    

    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
