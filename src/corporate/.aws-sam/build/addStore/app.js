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


function query(conx, sql, params) {
    return new Promise((resolve, reject) => {
        conx.query(sql, params, function(err, rows) {
            if (err) {
                // reject because there was an error
                reject(err);
            } else {
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
    let createStore = (name, latitude, longitude) => {
        let store_name = name;
        let latitude_value = parseFloat(latitude);
        let longitude_value = parseFloat(longitude);
        if (isNaN(latitude_value) || isNaN(longitude_value)) {
            return new Promise((reject) => {return reject("unable to create store, please enter valid location")});
        } else {
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO Stores (name, latitude, longitude) VALUES (?, ?, ?)", [store_name, latitude_value, longitude_value], (error, rows) => {
                    if (error) { return reject(error); }
                    else {return resolve(true);}
                });
            });
        }
    }
    
    
    try {
        const success = await createStore(info.name, info.latitude, info.longitude);
        // const ret = await axios(url);
        if (success) {
            response.status = 200;
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
