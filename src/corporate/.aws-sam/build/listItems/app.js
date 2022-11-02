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
    constructor(sku, name, description, price, max, locations) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.max = max;
        this.locations = [];
    }
}

class Location {
    constructor(aisle, shelf) {
        this.aisle = aisle;
        this.shelf = shelf;
    }
}

function assignLocations(item, locations) {
    item.locations = locations;
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
    
    try {
            //returns the list of all stores
        const items = await listAllItems();
        if (!(items == false)) {
            for (let item of items) {
                let locations = await getLocations(item.sku);
                console.log(locations);
                assignLocations(item, locations);
            }
            response.status = 200;
            response.items = JSON.parse(JSON.stringify(items));
        }
        else {
            response.status = 400;
            response.error = "can not list all items";
        }


    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
