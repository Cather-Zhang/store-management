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
// {  body: '{    "latitude" : "12.1",   "longitude" : "81.2"    }'
//
// }
//
// ===>  { "stores": [{"storeId": "4", "name": "Worcester Store", "latitude": "23.412", "longitude": "-12.342", "distance": "12"}, ...] }
//


exports.lambdaHandler = async (event, context, callback) => {
    
    context.callbackWaitsForEmptyEventLoop = false;

   // ready to go for CORS. To make this a completed HTTP response, you only need to add a statusCode and a body.
    let response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere
            "Access-Control-Allow-Methods": "GET" // Allow GET request
        }
    }; // response
    
                        
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
    let isAssignedLocation = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Locations WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                console.log(rows)
                if (rows.length > 0) {
                    return resolve(true);
                } else {
                    //console.log("item has not yet been assigned to locations");
                    return resolve(false);
                }
            });
        });
    }
    
    try {
            //returns the list of all stores
        const items = await listAllItems();
        let validItems = [];
        if (!(items == false)) {
            for (let item of items) {
                let assigned = await isAssignedLocation(item.sku);
                if (assigned == true) {
                    validItems.push(item);
                }

            }
            response.status = 200;
            response.items = JSON.parse(JSON.stringify(validItems));
        }
        else {
            response.status = 400;
            response.error = "can not list all items that are assigned to a location";
        }


    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
