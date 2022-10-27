// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
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
// {  body: '{    "storeId" : "1"}'
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
    
    let getStore = (storeId) => {
        let index = parseInt(storeId);
        if (isNaN(index)) {
            return new Promise((reject) => { return reject("invalid store id"); });
        } else {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Stores WHERE idStores=?", [index], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length == 1)) {
                        let id = rows[0].idStores;
                        let name = rows[0].name;
                        let latitude = rows[0].latitude;
                        let longitude = rows[0].longitude;
                        let s = new Store(id, name, latitude, longitude);
                        return resolve(s);
                    } else {
                        return reject("unable to find store '" + index + "'");
                    }
                });
            });
        }
    }
    
    // remove store
    let removeStore = (storeId) => {
        //console.log("in creating store"); 
        let index = parseInt(storeId);

        //console.log("parsing completed"); 
        if (isNaN(index)) {
            return new Promise((reject) => {return reject("invalid store id")});
        } else {
            //console.log("starting pool query"); 
            return new Promise((resolve, reject) => {
                pool.query("DELETE FROM Stores WHERE idStores=?", [index], (error, rows) => {
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
        const store = await getStore(info.storeId);
        // const ret = await axios(url);
        if (store) {
            try {
                const success = await removeStore(info.storeId);
                if (success) {
                    response.status = 200;
                }
                else {
                    response.status = 400;
                    response.error = "unable to remove store"
                }
            } catch (error) {
                console.log("ERROR: " + error);
                response.status = 400;
                response.error = error;
            }
            
        }
        else {
            response.status = 400;
            response.error = "store does not exist"
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
