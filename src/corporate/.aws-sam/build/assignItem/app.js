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
// {  body: '{    "sku" : "ABC12345",   "locations" : [{"aisle": "2", "shelf": "2"}, ... ] }'
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
                    return reject("item does not exist, please create it first");
                }
            });
        });
    }
    
    let canAssign = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Locations WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0) {
                    console.log("can not assign item")
                    return reject("Item already assigned");
                } else {
                    console.log("item can be assigned");
                    return resolve(true);
                }
            });
        });
    }
    
    // assign item to location
    let assignItem = (sku, location) => {
        //console.log("in creating store"); 
        let shelf = location.shelf;
        let aisle = location.aisle;
        //console.log("parsing completed"); 
        if (isNaN(shelf) || isNaN(aisle)) {
            return new Promise((reject) => {return reject("unable to assign item, please enter valid location")});
        } else {
            //console.log("starting pool query"); 
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO Locations (shelf, aisle, sku) VALUES (?, ?, ?)", [shelf, aisle, sku], (error, rows) => {
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
        if (exist === true) {
            //TODO
        
            
            const success = await canAssign(info.sku);
            //console.log(success);
            // const ret = await axios(url);
            if (success) {
                
                let successAssign;
                for (let location  of JSON.parse(info.locations)) {
                    let shelf = parseInt(location.shelf);
                    let aisle = parseInt(location.aisle);
                    if (isNaN(shelf) || isNaN(aisle)) {
                        response.status = 400;
                        response.error = "invalid location entry";
                        return response;
                    }
                    let newLocation = new Location(aisle, shelf);
                    
                    successAssign = await assignItem(info.sku, newLocation);
                    
                    if (!(successAssign === true)) {
                        response.status = 400;
                        response.error = "unable to assign item"
                        return response;
                    }
                    else {
                        response.status = 200;
                    }
                }
            }
            else {
                response.status = 400;
                response.error = "This item has already been assigned to a location"
                
            }
        } else {
            response.status = 400;
            response.error = "Item does not exist"
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
