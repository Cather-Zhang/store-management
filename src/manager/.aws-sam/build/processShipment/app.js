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

class Stock {
    constructor(id, sku, location, quantity) {
        this.idStores = id;
        this.sku = sku;
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
    let shipments = info.shipments;
    console.log("shipments:" + JSON.stringify(shipments)); 
    
    let doesItemExist = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Items WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    //console.log(rows[0]);
                    return resolve(rows[0].max);
                } else {
                    return reject("item does not exist, please create it first");
                }
            });
        });
    }
    
    // return the locations of an item
    let getLocations = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Locations WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                let location;
                if (rows) {
                    let shelf = rows[0].shelf;
                    let aisle = rows[0].aisle;
                    location = new Location (aisle, shelf);
                    
                    
                    return resolve(location);
                } else {
                    console.log("item has not yet been assigned to locations");
                    return false;
                }
            });
        });
    }
    
    //find if items are already stored on shelf
    let findStockShelf = (idStore, sku) => {
        
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND onShelf=true", [idStore, sku], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0) {
                    return resolve(rows[0].quantity);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    //find if items are already stored on shelf
    let updateStockShelf = (idStore, sku, quantity) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Stocks SET quantity=? WHERE onShelf=true AND idStores=? AND sku=?", [quantity, idStore, sku], (error, rows) => {
                if (error) { 
                    return reject(error); }
                else {
                    //console.log("update shelf success");
                    return resolve(true);
                    
                }
            });
        });
    }
    
    //fill up a shelf
    let insertStockShelf = (sku, quantity, location, idStore) => {
        //console.log("insert shelf stock for " + sku);
        let aisle = location.aisle;
        let shelf = location.shelf;
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Stocks (onshelf, quantity, idStores, sku, shelf, aisle) VALUES (true, ?, ?, ?, ?, ?)", [quantity, idStore, sku, shelf, aisle], (error, rows) => {
                if (error) { 
                    return reject(error); }
                else {
                    //console.log("insert shelf success");
                    return resolve(true);
                    
                }
            });
        });
    }
    
    //store item in overstock that can not be fit on shelves
    let findOverstock = (idStore, sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND onShelf=false", [idStore, sku], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0) {
                    //console.log("item " + sku + " in overstock");
                    return resolve(rows[0].quantity);
                } else {
                    //console.log("item " + sku + " not in overstock");
                    return resolve(false);
                }
            });
        });
    }
    
    // insert a new overstock row
    let insertOverstock = (idStore, sku, quantity) => {
        //console.log("insert over stock for " + sku);
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Stocks (quantity, onShelf, idStores, sku) VALUES (?, false, ?, ?)", [quantity, idStore, sku], (error, rows) => {
                if (error) { 
                    return reject(error); }
                else {
                    //console.log("insert overstock success");
                    return resolve(true);
                    
                }
            });
        });
    }
    
    //update over stock row
    let updateOverstock = (idStore, sku, quantity) => {
        //console.log("update over stock for " + sku);
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Stocks SET quantity=? WHERE onShelf=false AND idStores=? AND sku=?", [quantity, idStore, sku], (error, rows) => {
                if (error) { 
                    return reject(error); }
                else {
                    //console.log("update overstock success");
                    return resolve(true);
                    
                }
            });
        });
    }

    
    try {
        //first check if all sku are valid
        let exist;
        const idStore = info.storeId;

        
        for (let shipment of JSON.parse(shipments)) {
            //console.log(shipment);
            let newQuantity = parseInt(shipment.quantity)
            //console.log(newQuantity);
            let sku = shipment.sku;
            let max = await doesItemExist(sku);
            //console.log(max);
            let location = await getLocations(sku);
            //console.log(location);
            //console.log("process shipment "+ sku);
            
            console.log("item max on shelf is: " + max);
            let remainingQuantity = newQuantity;

            console.log("on location aisle "+ location.aisle + " shelf " + location.shelf);
            let stock = await findStockShelf(idStore, sku, location);
            let addQuantity;
            //item has never been on the shelf
            if (stock == false) {
                if (remainingQuantity > max) addQuantity = max;
                else addQuantity = remainingQuantity;
                let insertStockShelfSuccess = await insertStockShelf(sku, addQuantity, location, idStore);
                remainingQuantity = remainingQuantity - max;
                
            }
            
            //add to existing stock 
            else {
                if (stock < max){
                    if (remainingQuantity > (max - stock)) addQuantity = max;
                    else addQuantity = stock + remainingQuantity;
                    let updateStockShelfSuccess = await updateStockShelf(idStore, sku, location, addQuantity);
                    remainingQuantity = remainingQuantity - (max - stock);
                }
            }
            console.log("remaining quantity is: " + remainingQuantity);
                
                
            
            //it can't fit on shelf, need to store in overstock
            if (remainingQuantity > 0) {
                console.log("going to overstock")
                let overstock = await findOverstock(idStore, sku);
                
                if (overstock == false) {
                    console.log("insert new overstock");
                    let insertOverstockSuccess = await insertOverstock(idStore, sku, remainingQuantity);
                    if (!(insertOverstockSuccess == true)) {
                        response.status = 400;
                        response.error = "unable to insert overstock"
                    }
                }
                else {
                    console.log("update overstock");
                    let updateOverstockSuccess = await updateOverstock(idStore, sku, overstock+remainingQuantity);
                    if (!(updateOverstockSuccess == true)) {
                        response.status = 400;
                        response.error = "unable to update overstock"
                    }
                }
            }
            response.status = 200;
            
        
        }

    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
