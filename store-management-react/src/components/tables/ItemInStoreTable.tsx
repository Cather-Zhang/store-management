import * as React from 'react';
import {Store} from "../../types/Store";
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";

export default function ItemInStoreTable(props: { store: Store }) {
    let stockAndLoc = props.store.aisles.map(a => a.shelves.map(sh =>
        sh.stocks.map(s => {
            return {stock: s, location: new ItemLocation(a.id, sh.id)};
        })
    )).flat(2);
    return <BaseTable className={"itemInStoreTable"} headers={["Name", "Aisle", "Shelf", "Price ($)", "Quantity"]}
                      data={stockAndLoc.map((sal, i) => {
                          let item = sal.stock.item;
                          return {
                              id: i,
                              columns: [item.name, sal.location.aisle, sal.location.shelf, item.price, sal.stock.quantity]
                          };
                      })}/>
}