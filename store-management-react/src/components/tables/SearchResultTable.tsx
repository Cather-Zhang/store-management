import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Item} from "../../types/Item";
import {Button, Link} from "@mui/material";
import ItemInfoDialog from "../dialogs/ItemInfoDialog";
import {Corporate} from "../../types/Corporate";
import BuyItemDialog from "../dialogs/BuyItemDialog";

export default function SearchResultTable(props: { hasStore: boolean, searchType: string, setSearchResult: any, stockWithLocation:
    { storeId: number, item: Item, quantity: number, location: ItemLocation }[], corporate: Corporate, setCorporate: any}) {
    let headers = props.hasStore ? ["Store ID"] : [];
    if (props.searchType === "Location") {
        headers = headers.concat(["Name", "Aisle", "Shelf", "Price ($)", "Quantity", ""]);
    } else if (props.searchType === "Name") {
        headers = headers.concat([props.searchType, "Price ($)", "Quantity", ""]);
    } else {
        headers = headers.concat(["Name", props.searchType, "Price ($)", "Quantity", ""]);
    }

    function getValues(swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }, searchValue: string) {
        let item = swl.item;
        let values: any[] = props.hasStore ? [swl.storeId] : [];
        let buyButton = <Button variant="contained" style={{width: 100}} onClick={handleBuyItemClickOpen(swl)}>Buy</Button>
        let linkedName = <Link color="primary" underline="hover" onClick={handleItemInfoClickOpen(item)}>{item.name}</Link>
        if (props.searchType === "Location") {
            values = values.concat([linkedName, swl.location.aisle, swl.location.shelf, item.price, swl.quantity, buyButton]);
        } else if (props.searchType === "Name") {
            values = values.concat([linkedName, item.price, swl.quantity, buyButton]);
        } else {
            values = values.concat([linkedName, searchValue, item.price, swl.quantity, buyButton]);
        }
        return values;
    }

    const [itemInfoOpen, setItemInfoOpen] = React.useState(false);
    const [infoItem, setInfoItem] = React.useState<Item | null>(null);

    const handleItemInfoClickOpen = (item: Item) => {
        return function () {
            setInfoItem(item);
            setItemInfoOpen(true);
        };
    };
    const handleItemInfoClose = () => {
        setItemInfoOpen(false);
    };

    const [buyItemOpen, setBuyItemOpen] = React.useState(false);
    const [buyItem, setBuyItem] = React.useState<{ storeId: number, item: Item, quantity: number, location: ItemLocation } | null>(null);

    const handleBuyItemClickOpen = (swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }) => {
        return function () {
            setBuyItem(swl);
            setBuyItemOpen(true);
        };
    };
    const handleBuyItemClose = () => {
        setBuyItemOpen(false);
    };

    return <>
        <ItemInfoDialog item={infoItem} open={itemInfoOpen} handleClose={handleItemInfoClose}
                        corporate={props.corporate}
                        setCorporate={props.setCorporate} allowBuy={true}  handleBuyItemClickOpen={handleBuyItemClickOpen}/>
        <BuyItemDialog setSearchResult={props.setSearchResult} item={buyItem?.item ?? null} open={buyItemOpen} handleClose={handleBuyItemClose}
                        corporate={props.corporate} storeId={buyItem?.storeId ?? null} availableQuantity={buyItem?.quantity ?? null}
                        setCorporate={props.setCorporate} location={buyItem?.location ?? null} individualStore={props.hasStore} searchType={props.searchType}/>
        <BaseTable className={"itemInStoreTable"}
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
    </>
}