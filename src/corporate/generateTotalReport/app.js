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

class Stock {
    constructor(item,quantity) {
        this.item = item;
        this.quantity = quantity;
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
// {  body: '{    "storeId" : "13"   }'
//
// }
//
/** ===>  {     
 * "stocks": [
        {"itemName": "string", "quantity": "integer", "cost": "double", "description": "string","maxQuantity": "integer",
            "locations": [{"aisles": "integer", "shelves":"integer"},]
        },
        //...
    ],
    "totalValue": "double"}
*/


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
    
  
        //find if items are already stored on shelf
    let getStocks = (sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE sku=?", [sku], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0) {
                    let sum = 0;
                    for (let r of rows) {
                        sum = sum + r.quantity;
                    }
                    return resolve(sum);
                } else {
                    return resolve(0);
                }
            });
        });
    }
    
    
    let totalValue = (stocks) => {
        let total = 0;
        for (let stock of stocks) {
            let price = stock.item.price;
            let quantity = stock.quantity;
            total = total + price * quantity;
           
        }
        return total;
    }
    
    try {

        const items = await listAllItems();
        if (!(items == false)) {
            let stocks = [];
            
            for (let item of items) {
                let inventoriesOnShelf = await getStocks(item.sku);
                let s = new Stock(item, inventoriesOnShelf);
                stocks.push(s);
                
            }
            response.status = 200;
            response.stocks = JSON.parse(JSON.stringify(stocks));
            response.totalValue = totalValue(stocks);
        }
        else {
            response.status = 400;
            response.error = "can not generate total inventory report";
        }


    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response
};
