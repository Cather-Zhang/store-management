import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";

export default function ItemInStoreTable(props: { stockWithLocation: {location: ItemLocation, stock: Stock}[] }) {
    console.log(props.stockWithLocation)
    return <BaseTable className={"itemInStoreTable"} headers={["Name", "Aisle", "Shelf", "Price ($)", "Quantity"]}
                      data={props.stockWithLocation.map((swl: {location: ItemLocation, stock: Stock }, i) => {
                          let item = swl.stock.item;
                          return {
                              id: i,
                              columns: [item.name, swl.location.aisle, swl.location.shelf, item.price, swl.stock.quantity]
                          };
                      })}/>
}