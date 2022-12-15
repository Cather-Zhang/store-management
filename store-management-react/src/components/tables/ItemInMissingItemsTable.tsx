import * as React from 'react';
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";
import {ItemLocation} from "../../types/ItemLocation";
import {Item} from "../../types/Item";

export default function ItemInMissingItemsTable(props: { missingItems: Item[] }) {

    return <BaseTable className={"itemInStoreTable"} headers={["Name", "Price ($)", "Aisle", "Shelf"]}
                      data={props.missingItems.map((item, i) => {
                          return {
                              id: i,
                              columns: [item.name, item.price, item.location?.aisle, item.location?.shelf]
                          };
                      })} noRowsMessage={"No Missing Items"}/>
}