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

class Shopping {
    constructor(sku, location, remain) {
        this.sku = sku;
        this.location = location;
        this.remain = remain;
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
// {  body: '{    "username" : "SomeName", "password": "12345678"}'
//
// }
//
// ===>  { "role": "manager", "storeId": "2"}
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
    
    // check availability of an item given storeID, sku, aisle and shelf
    let checkItemAvailability = (idStore, sku, aisle, shelf, quantity) => {
        let item_aisle = parseInt(aisle);
        let item_shelf = parseInt(shelf);
        let item_quantity = parseInt(quantity);
        if (isNaN(item_aisle) || isNaN(item_shelf) ||  isNaN(item_quantity)) {
            return new Promise((reject) => { return reject(false)});
        }
        
        if(item_quantity <=0){
            return new Promise((reject) => { return reject(false)});
        }
        
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND aisle=? AND shelf=? AND quantity>=? AND onShelf=true", [idStore, sku, item_aisle, item_shelf, item_quantity], (error, rows) => {
                if (error) { return reject(error); }
                let shopping = [];
                if (rows.length > 0) {
                    for (let r of rows) {
                        let remaining = r.quantity - item_quantity;
                        let cart = new Shopping(r.sku, new Location(r.aisle, r.shelf), remaining);
                        console.log(r.sku);
                        shopping.push(cart);
                    }
                    return resolve(shopping);
                } else {
                    console.log("Out here?");
                    return resolve(false);
                }
            });
        });
    }
    
    // update availability of an item given storeID, sku, aisle and shelf
    let updateAvailability = (idStore, sku, location, quantity) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Stocks SET quantity=? WHERE idStores=? AND sku=? AND aisle=? AND shelf=? AND onShelf=true", [quantity, idStore, sku, location.aisle, location.shelf], (error, rows) => {
                if (error) { return reject(error);} 
                else {
                    return resolve(true);
                }
            });
        });
    }
    
    try {
        const idStore = parseInt(info.storeId);
        if(!(info.type == "buy")){
            response.status = 400;
            response.error = "can not fetch purchase";
        }
     
        const items = await checkItemAvailability(idStore, info.sku, info.aisle, info.shelf, info.quantity);
        if (!(items == false)) {
            console.log("Item in!")
            for (let item of items) {
                let update = await updateAvailability(idStore, item.sku, item.location, item.remain);
                if(update){
                    response.status = 200;
                }else{
                    response.status = 400;
                    response.error = "cannot update availability";
                }
            }
            
        }
        else {
            response.status = 400;
            response.error = "no item available";
        }

    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
