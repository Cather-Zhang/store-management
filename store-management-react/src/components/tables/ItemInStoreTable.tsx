import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";
import {Link} from "@mui/material";
import {Item} from "../../types/Item";
import ItemInfoDialog from "../dialogs/ItemInfoDialog";
import {Corporate} from "../../types/Corporate";
import BuyItemDialog from "../dialogs/BuyItemDialog";

export default function ItemInStoreTable(props: { corporate: Corporate, setCorporate: any, setSearchResult: any, stockWithLocation:
    { location: ItemLocation, stock: Stock }[], storeId: number, searchType: string }) {
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
    const [buyItem, setBuyItem] = React.useState<{ location: ItemLocation, stock: Stock } | null>(null);

    const handleBuyItemClickOpen = (item: { location: ItemLocation, stock: Stock }) => {
        return function () {
            setBuyItem(item);
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
        <BuyItemDialog item={buyItem?.stock.item ?? null} open={buyItemOpen} handleClose={handleBuyItemClose}
                       corporate={props.corporate} availableQuantity={buyItem?.stock.quantity ?? null}
                       setCorporate={props.setCorporate}  location={buyItem?.location ?? null} storeId={props.storeId}
                       setSearchResult={props.setSearchResult} individualStore={true} searchType={props.searchType}/>
        <BaseTable className={"itemInStoreTable"} headers={["Name", "Aisle", "Shelf", "Price ($)", "Quantity"]}
                   data={props.stockWithLocation.map((swl: { location: ItemLocation, stock: Stock }, i) => {
                       let item = swl.stock.item;
                       return {
                           id: i,
                           columns: [<Link color="primary" underline="hover"
                                           onClick={handleItemInfoClickOpen(item)}>{item.name}</Link>,
                               swl.location.aisle, swl.location.shelf, item.price, swl.stock.quantity]
                       };
                   })} noRowsMessage={"No items on shelves"}/>
    </>
}