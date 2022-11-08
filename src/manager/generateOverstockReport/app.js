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
    constructor(item, quantity) {
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
            "Access-Control-Allow-Methods": "POST" // Allow POST request
        }
    }; // response
    
    console.log(event);
    let actual_event = event.body;
    let info = JSON.parse(actual_event);
    console.log("info:" + JSON.stringify(info)); 
                        
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
    
     
        //store item in overstock that can not be fit on shelves
    let findOverstock = (idStore, sku) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Stocks WHERE idStores=? AND sku=? AND onShelf=false", [idStore, sku], (error, rows) => {
                if (error) { return reject(error); }
                if (rows.length > 0) {
                    //console.log("item " + sku + " in overstock");
                    return resolve(rows[0].quantity);
                } else {
                    //console.log("item " + sku + " not in overstock");
                    return resolve(false);
                }
            });
        });
    }
    
    
    let totalValue = (stocks) => {
        let total = 0;
        for (let stock of stocks) {
            let price = stock.item.price;
            total = total + price * stock.quantity;
        }
        return total;
    }
    
    try {
            //returns the list of all stores
        const idStore = parseInt(info.storeId);
        
        const items = await listAllItems();
        if (!(items == false)) {
        let stocks = [];
            for (let item of items) {
                let quantity = 0;
                    let findOverstockReturn = await findOverstock(idStore, item.sku);
                    if (!(findOverstockReturn == false)) {
                        quantity = findOverstockReturn;
                        let stock = new Stock(item, quantity);
                        stocks.push(stock);
                    }
            }
            response.status = 200;
            response.stocks = JSON.parse(JSON.stringify(stocks));
            response.totalValue = totalValue(stocks);
        }
        else {
            response.status = 400;
            response.error = "can not generate report";
        }


    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 400;
        response.error = error;
    }

    return response;
};
