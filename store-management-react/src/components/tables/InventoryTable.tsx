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

export default function InventoryTable(props: {
    corporate: Corporate, setCorporate: any, stockWithLocation: { location: ItemLocation, stock: Stock }[],
    storeId: number, searchType: string
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

    const [modalItem, setModalItem] = React.useState<{ location: ItemLocation, stock: Stock } | null>(null);

        return <>
        <ItemInfoDialog item={modalItem?.stock.item ?? null} open={itemInfoOpen} handleClose={handleItemInfoClose}
                        corporate={props.corporate} quantity={modalItem?.stock.quantity ?? 0}
                        setCorporate={props.setCorporate} allowBuy={true}
                        handleBuyItemClickOpen={null}/>
        <BaseTable className={"itemInStoreTable"} headers={["Name", "Aisle", "Shelf", "Price ($)", "Quantity", ""]}
                   data={props.stockWithLocation.map((swl: { location: ItemLocation, stock: Stock }, i) => {
                       let item = swl.stock.item;
                       return {
                           id: i,
                           columns: [<Link color="primary" underline="hover"
                                           onClick={handleItemInfoClickOpen(swl)}>{item.name}</Link>,
                               swl.location.aisle, swl.location.shelf, item.price, swl.stock.quantity]
                       }
                   })} noRowsMessage={"No items on shelves"}/>
    </>
}