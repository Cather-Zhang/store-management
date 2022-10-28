//Corporate Use Case
//Create Item: POST  (ItemSku is primary key, auto-generated and -incremented)
const createItemRequest = {
    "sku": "String",
    "name": "string",
    "price": "double",
    "description": "string",
    "max": "integer"
};

const createItemResponse = {
    "status": "integer", //200 or 400
    "error": "string"
}


//Assign Item Location: POST
const assignItemLocationRequest = {
    "sku": "string",
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
    "name": "string",
    "latitude": "double", 
    "longitude": "double",
    "manager": "string",
    "password": "string"
}

const createStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stores":[
        {"storeId": "integer", "latitude": "double", "longitude": "double", "manager": "string" },
        // ...
    ]
}

//Remove Store: POST
const removeStoreRequest = {
    "storeId": "integer"
}

const removeStoreResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stores":[
        {"storeId": "integer", "latitude": "double", "longitude": "double", "manager": "string" },
        // ...
    ]
}


//Generate Total Inventory Report: GET
const generateTotalReportResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "cost": "double", "description": "string","maxQuantity": "integer",
            "locations": [{"aisles": "integer", "shelves":"integer"},]
        },
        //...
    ],
    "totalValue": "double"
}

//Generate Inventory Report: GET
const generateIndividualReportRequest = {
    "storeId": "integer",
    "option": "string"
}

const generateIndividualReportResponse = {
    "status": "integer", //200 or 400
    "error": "string",
    "stocks": [
        {"itemName": "string", "quantity": "integer", "cost": "double", "description": "string", "maxQuantity": "integer",
            "locations": [{"aisles": "integer", "shelves":"integer"},]
        },
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
        {"itemName": "string", "quantity": "integer", "cost": "double", "description": "string","maxQuantity": "integer",
            "locations": [{"aisles": "integer", "shelves":"integer"},]
        },
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
        {"itemName": "string", "quantity": "integer", "price": "double", "description": "string", "maxQuantity": "integer",
            "locations": [{"aisles": "integer", "shelves":"integer"},]
        },
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
        {"itemName": "string", "price": "double", "description": "string", "maxQuantity": "integer",
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
        {"storeId": "integer", "latitude": "double", "longitude": "double", "distance": "double" },
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
        {"itemName": "string", "quantity": "integer", "price": "double", "description": "string", "maxQuantity": "integer"},
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
        {"storeId": "integer", "quantity": "integer", "price": "double",
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
        {"itemName": "string", "quantity": "integer", "price": "double", "description": "string", "maxQuantity": "integer",
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