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
    
    function hash(string) {
        //set variable hash as 0
        var hash = 0;
        // if the length of the string is 0, return 0
        if (string.length == 0) return hash;
        for (let i = 0 ;i<string.length ; i++)
        {
        let ch = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
        }
        return hash;
    }
    
    let password_hashed = hash(info.password)
    
    // check corporate, if yes return true, else return false
    let isCorporate = (username, password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Users WHERE username=? AND password=?", [username, password], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    // check manager, if is return store id, if not return false
    let isManager = (username, password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stores WHERE manager=? AND password=?", [username, password], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows[0].idStores);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    
    try {
        
        const isCorporateReturn = await isCorporate(info.username, password_hashed);
        // const ret = await axios(url);
        if (isCorporateReturn == true) {
            response.status = 200;
            response.role = "corporate";

        }
        else {
            const isManagerReturn = await isManager(info.username, password_hashed);
            if (isManagerReturn == false) {
                response.status = 400;
                response.error = "invalid username and password"
                
            }
            else {
                response.status = 200;
                response.role = "manager";
                response.storeId = isManagerReturn;
            }
        }

    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
