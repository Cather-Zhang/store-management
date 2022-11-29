import * as React from 'react';
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";
import {ItemLocation} from "../../types/ItemLocation";

export default function ItemInMissingItemsTable(props: { missingItems: {stock: Stock, location: ItemLocation}[] }) {
    return <BaseTable className={"itemInStoreTable"} headers={["Name", "Price ($)", "Aisle", "Shelf"]}
                      data={props.missingItems.map((swl: {location: ItemLocation, stock: Stock }, i) => {
                          let item = swl.stock.item;
                          return {
                              id: i,
                              columns: [item.name, item.price, swl.location.aisle, swl.location.shelf]
                          };
                      })} noRowsMessage={"No Missing Items"}/>
}