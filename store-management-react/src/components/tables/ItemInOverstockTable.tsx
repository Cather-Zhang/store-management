import * as React from 'react';
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";

export default function ItemInOverstockTable(props: { overstock: {stock: Stock}[] }) {
    return <BaseTable className={"itemInStoreTable"} headers={["Name", "Price ($)", "Quantity"]}
                      data={props.overstock.map((swl: {stock: Stock}, i) => {
                          let item = swl.stock.item;
                          return {
                              id: i,
                              columns: [item.name, item.price, swl.stock.quantity]
                          };
                      })}/>
}