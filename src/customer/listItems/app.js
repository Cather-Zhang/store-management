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
}

class Stock {
    constructor(item, location, quantity) {
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
// {  body: '{"storeId" : "4", "type": "location", "aisle": "1", "shelf": "2"}'
//
// }
//
// ===>  [{ "item": "name", "location": ["aisle": "1", "shelf": "2"], "quantity": "3"}
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
    
    let listItemsOnShelf = (idStore, sku, aisle, shelf) => {
        let item_aisle = parseInt(aisle);
        let item_shelf = parseInt(shelf);
        if (isNaN(item_aisle) || isNaN(item_shelf)) {
            return new Promise((reject) => { return reject("invalid item's location input")});
        }
        
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND aisle=? AND shelf=? AND onShelf=true AND quantity>0", [idStore, sku, item_aisle, item_shelf], (error, rows) => {
                if (error) { return reject(error); }
                let inventories = [];
                if (rows.length > 0) {
                    for (let r of rows) {
                        let newInventory = new Inventory(new Location(r.aisle, r.shelf), r.quantity)
                        inventories.push(newInventory);
                    }
                    return resolve(inventories);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    try {
        const idStore = parseInt(info.storeId);
        const checkType = JSON.Parse(info.type);
        if(!(checkType == "location")){
            response.status = 400;
            response.error = "can not fetch location";
        }
        
        const items = await listAllItems();
        if (!(items == false)) {
            let stocks = [];
            for (let item of items) {
                let itemsOnShelf = await listItemsOnShelf(idStore, item.sku, info.aisle, info.shelf);
                if (!(itemsOnShelf == false)) {
                    for (let i of itemsOnShelf) {
                        let stock = new Stock(item, i.location, i.quantity);
                        stocks.push(stock);
                    }
                }
            }
            response.status = 200;
            response.stocks = JSON.parse(JSON.stringify(stocks));
        }
        else {
            response.status = 400;
            response.error = "can not list items for a location";
        }


    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
