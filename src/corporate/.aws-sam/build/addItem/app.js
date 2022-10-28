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
// {  body: '{    "sku" : "12.1",   "name" : "shampoo",  "price": "20",  "description": "hair shampoo", "max": "10"}'
//
// }
//
// ===>  { }
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
    
    let doesItemExist = (sku) => {
        
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Items WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    
    // create item
    let createItem = (sku, name, price, description, max) => {

        let price_value = parseFloat(price);
        let maxQuantity_value = parseInt(max);

        if (isNaN(price_value) || isNaN(maxQuantity_value)) {
            return new Promise((reject) => {return reject("unable to create store, please enter valid location")});
        } else {
            //console.log("starting pool query"); 
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO Items (sku, name, description, price, max) VALUES (?, ?, ?, ?, ?)", [sku, name, description, price_value, maxQuantity_value], (error, rows) => {
                    if (error) { 
                        //console.log("reject"); 
                        return reject(error); }
                    else {
                        //console.log("resolved"); 
                        return resolve(true);
                        
                    }
                });
            });
        }
    }
    
    
    try {
        const exist = await doesItemExist(info.sku);
        // const ret = await axios(url);
        if (exist) {
            response.status = 400;
            response.error = "item already exist with given sku"

        }
        else {
            const success = await createItem(info.sku, info.name, info.price, info.description, info.max);
            if (success) {
                response.status = 200;
            }
            else {
                response.status = 400;
                response.error = "unable to create item"
            }
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
