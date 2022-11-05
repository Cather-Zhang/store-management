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
    
    //get the max quantity of an item
    let getMax = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Items WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows[0].max);
                } else {
                    return reject("item does not exist, please create it first");
                }
            });
        });
    }
    
    // get all the stocks that are on shelf in given store
    let getStocksOnShelf = (idStore) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND onshelf=true", [idStore], (error, rows) => {
                if (error) { return reject(error); }
                let stocks = [];
                if (rows) {
                    for (let r of rows) {
                        let shelf = r.shelf;
                        let aisle = r.aisle;
                        let location = new Location (aisle, shelf);
                        let stock = new Stock(idStore, r.sku, location, r.quantity);
                        stocks.push(stock);
                    }
                    return resolve(stocks);
                } else {
                    //console.log("item has not yet been assigned to locations");
                    return resolve(stocks);
                }
            });
        });
    }
    
    //update stock on shelf
    let updateStockShelf = (idStore, sku, location, quantity) => {
        //console.log("update shelf stock for " + sku);
        let aisle = location.aisle;
        let shelf = location.shelf;
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Stocks SET quantity=? WHERE aisle=? AND shelf=? AND idStores=? AND sku=?", [quantity, aisle, shelf, idStore, sku], (error, rows) => {
                if (error) { 
                    return reject(error); }
                else {
                    //console.log("update shelf success");
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

        const idStore = info.storeId;
        let allStocksOnShelf = await getStocksOnShelf(idStore);
        for (let stock of allStocksOnShelf) {
            let sku = stock.sku;
            let max = await getMax(sku);
            let location = stock.location;
            let overStockQuantity = await findOverstock(idStore, sku);
            if (isNaN(overStockQuantity) || isNaN(max)) {
                response.error = "can not get overstock";
                response.status = 400;
            }
            else {
                if (overStockQuantity >= max) {
                    let updateSuccess = await updateStockShelf(idStore, sku, location, max);
                    updateSuccess = await updateOverstock(idStore, sku, overStockQuantity - (max - stock.quantity));
                    if (updateSuccess == true) {
                        response.status = 200;
                    }
                    else {
                        response.status = 400;
                        response.error = "unable to fill shelves";
                    }
                }
            }
        }

    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
