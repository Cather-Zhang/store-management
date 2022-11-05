/**{
"body": "{\"name\": \"Test Store 2\", \"latitude\": \"0.11\", \"longitude\": \"0.22\", \"manager\": \"tester1\", \"password\": \"tester1.1\"}"
}
*/
const addStoreResponse = {
  "headers": {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST"
  },
  "status": 200,
  "stores": [
    {
      "idStores": 8,
      "name": "First store",
      "latitude": 20.3,
      "longitude": 23.4,
      "manager": "Cather Zhang"
    },
    {
      "idStores": 12,
      "name": "Second store",
      "latitude": 21.3,
      "longitude": -23.4,
      "manager": "SomeName"
    },
    {
      "idStores": 14,
      "name": "Origin store",
      "latitude": 0,
      "longitude": 0,
      "manager": "originalManager"
    },
    {
      "idStores": 15,
      "name": "Worcester Store",
      "latitude": 11.3,
      "longitude": -2.49,
      "manager": "Smith"
    },
    {
      "idStores": 16,
      "name": "Test Store 1",
      "latitude": 0.11,
      "longitude": 0.22,
      "manager": "tester1"
    },
    {
      "idStores": 18,
      "name": "Test Store 2",
      "latitude": 0.11,
      "longitude": 0.22,
      "manager": "tester1"
    }
  ]
}

//{} for request
const listAllItemsResponse = 
{
  "headers": {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
  },
  "status": 200,
  "items": [
    {
      "sku": "FAP19452",
      "name": "blanket",
      "description": "Weighted blanket",
      "price": 18.99,
      "max": 5,
      "locations": [
        {
          "aisle": 1,
          "shelf": 1
        },
        {
          "aisle": 2,
          "shelf": 2
        },
        {
          "aisle": 3,
          "shelf": 3
        }
      ]
    },
    {
      "sku": "FTG13342",
      "name": "conditioner",
      "description": "Panteen conditioner",
      "price": 8.99,
      "max": 10,
      "locations": [
        {
          "aisle": 1,
          "shelf": 4
        },
        {
          "aisle": 2,
          "shelf": 5
        },
        {
          "aisle": 1,
          "shelf": 6
        }
      ]
    },
    {
      "sku": "MGD12183",
      "name": "chocolate",
      "description": "yummy milk chocolate",
      "price": 5.99,
      "max": 50,
      "locations": []
    },
    {
      "sku": "STF21341",
      "name": "shampoo",
      "description": "2-in-1 shampoo",
      "price": 22.3,
      "max": 10,
      "locations": [
        {
          "aisle": 2,
          "shelf": 1
        },
        {
          "aisle": 1,
          "shelf": 5
        }
      ]
    }
  ]
}

/**
 {
  "body": "{\"sku\": \"WAA14122\", \"name\": \"water bottle\", \"price\": \"4.99\", \"description\": \"Plastic sports waterbottle\", \"max\": \"10\"}"
}
*/
const addItemResponse = {
  "headers": {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST"
  },
  "status": 200
}



/**
 {
  "body": "{\"sku\": \"FAP19452\", \"locations\": [{\"shelf\": \"1\", \"aisle\": \"1\"}, {\"shelf\": \"2\", \"aisle\": \"2\"}, {\"shelf\": \"3\", \"aisle\": \"3\"}]}"
}
 */
 
 const assignItemResponse = {
  "headers": {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST"
  },
  "status": 200
}
