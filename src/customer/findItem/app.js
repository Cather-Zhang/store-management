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
    
    function getDistance(latitude_1, latitude_2, longitude_1, longitude_2) {
        const R = 6373.0
        
        // Convert from degrees to radians.
        Math.radians = function(degrees) {
        	return degrees * Math.PI / 180;

        }
        
        let lat1 = Math.radians(latitude_1);
        let lon1 = Math.radians(longitude_1);
        let lat2 = Math.radians(latitude_2);
        let lon2 = Math.radians(longitude_2);
        
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;

        let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * (Math.pow(Math.sin(dlon / 2), 2));
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        let distance = R * c
        return distance;

    }
                        
    //list stores from closest to fartest
    let listAllStores = (latitude, longitude) => {
        let user_latitude = parseFloat(latitude);
        let user_longitude = parseFloat(longitude);
        if (isNaN(user_latitude) || isNaN(user_longitude)) {
            return new Promise((reject) => { return reject("invalid location input")});
        }
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
                            let distance = getDistance(store_latitude, user_latitude, store_longitude, user_longitude);
                            //console.log(distance);
                            store.distance = distance.toFixed(2);
                            stores.push(store);
                        }

                        stores.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
                        return resolve(stores);
                    } else {
                        return reject("no store in database");
                    }
                });
            });
    }
    

    
    try {
            //returns the list of all stores in order
        const stores = await listAllStores(info.latitude, info.longitude);
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
