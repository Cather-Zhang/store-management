import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";
import {Button, Link} from "@mui/material";
import {Item} from "../../types/Item";
import ItemInfoDialog from "../dialogs/ItemInfoDialog";
import {Corporate} from "../../types/Corporate";
import BuyItemDialog from "../dialogs/BuyItemDialog";
import {APINamespace, sendRequest} from "../../Utilities";
import {GPS} from "../../types/GPS";

export default function ItemInStoreTable(props: {
    corporate: Corporate, setCorporate: any, setSearchResult: any, stockWithLocation:
        { location: ItemLocation, stock: Stock }[], storeId: number, searchType: string, setAllItems: any, gps: GPS
}) {
    const [itemInfoOpen, setItemInfoOpen] = React.useState(false);

    const handleItemInfoClickOpen = (swl: { location: ItemLocation, stock: Stock }) => {
        return function () {
            setModalItem(swl);
            setItemInfoOpen(true);
        };
    };
    const handleItemInfoClose = () => {
        setItemInfoOpen(false);
    };

    const [buyItemOpen, setBuyItemOpen] = React.useState(false);
    const [modalItem, setModalItem] = React.useState<{ location: ItemLocation, stock: Stock } | null>(null);

    const handleBuyItemClickOpen = (swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }) => {
        return function () {
            setModalItem({location: swl.location, stock: new Stock(swl.item, swl.quantity)});
            setBuyItemOpen(true);
        };
    };
    const handleBuyItemClose = () => {
        setBuyItemOpen(false);
    };

        return <>
        <ItemInfoDialog item={modalItem?.stock.item ?? null} open={itemInfoOpen} handleClose={handleItemInfoClose}
                        corporate={props.corporate} quantity={modalItem?.stock.quantity ?? 0}
                        /*setCorporate={props.setCorporate}*/ allowBuy={true}/>
        <BuyItemDialog item={modalItem?.stock.item ?? null} open={buyItemOpen} handleClose={handleBuyItemClose}
                       corporate={props.corporate} availableQuantity={modalItem?.stock.quantity ?? null}
                       setCorporate={props.setCorporate} location={modalItem?.location ?? null} storeId={props.storeId}
                       setSearchResult={props.setSearchResult} individualStore={false} searchType={props.searchType} setAllItems={props.setAllItems} gps={props.gps}/>
        <BaseTable className={"itemInStoreTable"} headers={["Name", "Aisle", "Shelf", "Price ($)", "Quantity", ""]}
                   data={props.stockWithLocation.map((swl: { location: ItemLocation, stock: Stock }, i) => {
                       let item = swl.stock.item;
                       return {
                           id: i,
                           columns: [<Link color="primary" underline="hover"
                                           onClick={handleItemInfoClickOpen(swl)}>{item.name}</Link>,
                               swl.location.aisle, swl.location.shelf, item.price, swl.stock.quantity,
                               <Button variant="contained" style={{width: "170px"}} onClick={
                                   handleBuyItemClickOpen({
                                       location: swl.location,
                                       storeId: props.storeId,
                                       quantity: swl.stock.quantity,
                                       item: swl.stock.item
                                   })
                               }>Buy</Button>]
                       }
                   })} noRowsMessage={"No items on shelves"}/>
    </>
}