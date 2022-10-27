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
    constructor(id, name, latitude, longitude) {
        this.idStores = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    assignManager(managername, password) {
        this.manager = managername;
        this.password = password;
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
// {  body: '{    "latitude" : "12.1",   "longitude" : "81.2",  "manager": "John Smith",  "password": "12345678"}'
//
// }
//
// ===>  { "storeId" : "2" }
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
    
    // create store
    let createStore = (name, latitude, longitude, manager, password) => {
        //console.log("in creating store"); 
        let latitude_value = parseFloat(latitude);
        let longitude_value = parseFloat(longitude);
        //console.log("parsing completed"); 
        if (isNaN(latitude_value) || isNaN(longitude_value)) {
            return new Promise((reject) => {return reject("unable to create store, please enter valid location")});
        } else {
            //console.log("starting pool query"); 
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO Stores (name, latitude, longitude, manager, password) VALUES (?, ?, ?, ?, ?)", [name, latitude_value, longitude_value, manager, password], (error, rows) => {
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
    
    let listAllStores = () => {
        return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Stores", [], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        let stores = [];
                        for (let r of rows) {
                            let id = r.idStores;
                            let name = r.name;
                            let latitude = r.latitude;
                            let longitude = r.longitude;
                            let store = new Store(id, name, latitude, longitude);
                            stores.push(store);
                        }
                        return resolve(stores);
                    } else {
                        return reject("no store in database");
                    }
                });
            });
    }
    
    
    try {
        const success = await createStore(info.name, info.latitude, info.longitude, info.manager, info.password);
        // const ret = await axios(url);
        if (success) {
            response.status = 200;
            //returns the list of all stores
            const stores = await listAllStores();
            if (stores) {
                response.stores = JSON.parse(JSON.stringify(stores));
            }
            else {
                response.status = 400;
                response.error = "store created but failed to list all stores"
            }
        }
        else {
            response.status = 400;
            response.error = "unable to create store"
        }

    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
