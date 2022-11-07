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
            "Access-Control-Allow-Methods": "GET" // Allow POST request
        }
    }; // response
    
    //list all stores
    let listAllStores = () => {
        return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Stores", [], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        let stores = [];
                        for (let r of rows) {
                            let id = r.idStores;
                            let name = r.name;
                            let store_latitude = r.latitude;
                            let store_longitude = r.longitude;
                            let manager = r.manager;
                            let store = new Store(id, name, store_latitude, store_longitude, manager);
                            
                            stores.push(store);
                        }

                        
                        return resolve(stores);
                    } else {
                        return resolve(true);
                    }
                });
            });
    }
    

    
    try {
            //returns the list of all stores
        const stores = await listAllStores();
        if (stores) {
            response.status = 200;
            response.stores = JSON.parse(JSON.stringify(stores));
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
