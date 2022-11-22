import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Item} from "../../types/Item";

export default function SearchResultTable(props: { hasStore: boolean, searchType: string, stockWithLocation: { storeId: number, item: Item, quantity: number, location: ItemLocation }[] }) {
    let headers = props.hasStore ? ["Store ID"] : [];
    if (props.searchType === "Location") {
        headers = headers.concat(["Name", "Aisle", "Shelf", "Price ($)", "Quantity"]);
    } else if (props.searchType === "Name") {
        headers = headers.concat([props.searchType, "Price ($)", "Quantity"]);
    } else {
        headers = headers.concat(["Name", props.searchType, "Price ($)", "Quantity"]);
    }

    function getValues (swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }, searchValue: string) {
        let item = swl.item;
        let values: any[] = props.hasStore ? [swl.storeId] : [];
        if (props.searchType === "Location") {
            values = values.concat([item.name, swl.location.aisle, swl.location.shelf, item.price, swl.quantity]);
        } else if (props.searchType === "Name") {
            values = values.concat([item.name, item.price, swl.quantity]);
        } else {
            values = values.concat([item.name, searchValue, item.price, swl.quantity]);
        }
        return values;
    }

    console.log(headers)

    return <BaseTable className={"itemInStoreTable"}
      headers={headers}
      data={props.stockWithLocation.map((swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }, i) => {
          let item = swl.item;
          let searchValue = null;
          if (props.searchType === "Name") {
              searchValue = item.name;
          } else if (props.searchType === "SKU") {
              searchValue = item.sku;
          } else if (props.searchType === "Description") {
              searchValue = item.description;
          }

          return {
              id: i,
              columns: getValues(swl, searchValue ?? "")
          };
      })} noRowsMessage={"No search results"}/>
}