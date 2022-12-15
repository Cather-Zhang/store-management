import * as React from 'react';
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";
import {ItemLocation} from "../../types/ItemLocation";
import {Item} from "../../types/Item";

export default function ItemInMissingItemsTable(props: { missingItems: {item: Item, location: ItemLocation[]}[] }) {

    return <BaseTable className={"itemInStoreTable"} headers={["Name", "Price ($)", "Aisle", "Shelf"]}
                      data={props.missingItems.map((swl: {location: ItemLocation[], item: Item }, i) => {
                          return {
                              id: i,
                              columns: [swl.item.name, swl.item.price, swl.location[0].aisle, swl.location[0].shelf]
                          };
                      })} noRowsMessage={"No Missing Items"}/>
}