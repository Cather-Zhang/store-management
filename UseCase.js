//Corporate Use Case
//Create Item: POST  (ItemSku is primary key, auto-generated and -incremented)
const createItemRequest = {
    "name": "string",
    "price": "double",
    "description": "string",
    "maxQuantity": "integer"
};

const createItemResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}


//Assign Item Location: POST
const assignItemLocationRequest = {
    "itemSku": "integer",
    "locations": [{"aisles": "integer", "shelves":"integer"},
    //...
]
}

const assignItemLocationResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}

//Create Store: POST (storeId is primary key, auto-generated and -incremented)
const createStoreRequest = {
    "latitude": "double", 
    "longitude": "double",
    "manager": "string"
}

const createStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stores":[
        {"storeId": "integer", "latitude": "double", "longitude": "double" },
        // ...
    ]
}

//Remove Store: POST
const removeStoreRequest = {
    "storeId": "integer"
}

const removeStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}


//Generate Total Inventory Report: GET
const generateTotalReportResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "value": "double"},
        //...
    ],
    "totalValue": "double"
}

//Generate Inventory Report: GET
const generateIndividualReportRequest = {
    "storeId": "integer"
}

const generateIndividualReportResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "value": "double"},
        //...
    ],
    "totalValue": "double"
}


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

//Manager Use Case

//Process Shipment: POST

const processShipmentRequest = {
    "storeId": "integer",
    "shipments": [
        {"itemName": "string", "quantity": "integer"},
        //...
    ]
}

const processShipmentResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}

//Generate Inventory Report: GET
const generateInventoryReportRequest = {
    "storeId": "integer"
}

const generateInventoryReportResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "value": "double"},
        //...
    ],
    "totalValue": "double"
}


//Generate Overstock Report: GET
const generateOverstockReportRequest = {
    "storeId": "integer"
}

const generateOverstockReportResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "value": "double"},
        //...
    ],
    "totalValue": "double"
}

//Fill Shelves: POST
const fillShelvesRequest = {
    "storeId": "integer"
}

const fillShelvesResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}


//Show Missing Items: GET
const showMissingItemsRequest = {
    "storeId": "integer"
}

const showMissingItemsResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "missingItems": [
        {"itemName": "string", "price": "double", 
        "locations": [{"aisles": "integer", "shelves":"integer"},
                        //...
                    ]       
        }, 
        // ...
    ]
}


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

//Customer Use Case

//List Stores: GET
const listStoreRequest = {
    "latitude": "double", 
    "longitude": "double",
}

const listStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stores":[
        {"storeId": "integer", "latitude": "double", "longitude": "double" },
        // ...
    ]
}

//Items on Shelf In Store: GET
const itemsOnShelfRequest = {
    "storeId": "integer",
    "aisle": "integer",
    "shelf": "integer"
}

const itemsOnShelfResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "price": "double"},
        //...
    ]
}

//Find Item In All Store: GET
const findItemInAllStoreRequest = {
    "inputType": "string", // sku / description / name
    "inputValue": "string"
}

const findItemInAllStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stores":[
        {"storeId": "integer", "latitude": "double", "longitude": "double",
        "locations": [{"aisles": "integer", "shelves":"integer"},
                        //...
                    ]
        },
        // ...
    ]
}

//Find Item In One Store: GET
const findItemInOneStoreRequest = {
    "storeId": "integer",
    "inputType": "string", // sku / description / name
    "inputValue": "string"
}

const findItemInOneStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "price": "double",
        "locations": [{"aisles": "integer", "shelves":"integer"},
                        //...
                    ]
        },
        //...
    ]
}


//Buy Item: POST

const buyItemRequest = {
    "storeId": "integer",
    "itemName": "string",
    "quantity": "integer",
    "shelf": "integer",
    "aisle": "integer"
}

const buyItemResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}