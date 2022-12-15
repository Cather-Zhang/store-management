import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Stock} from "../../types/Stock";
import {Link} from "@mui/material";
import {Item} from "../../types/Item";
import ItemInfoDialog from "../dialogs/ItemInfoDialog";
import {Corporate} from "../../types/Corporate";

export default function InventoryTable(props: {
    corporate: Corporate, setCorporate: any, stockWithLocation: { location: ItemLocation, stock: Stock }[],
    storeId: number, searchType: string
}) {
    const [itemInfoOpen, setItemInfoOpen] = React.useState(false);

    const handleItemInfoClickOpen = (swl: { stock: Stock, location: ItemLocation }) => {
        return function () {
            swl.stock.item.location = swl.location;
            setModalItem(swl);
            setItemInfoOpen(true);
        };
    };
    const handleItemInfoClose = () => {
        setItemInfoOpen(false);
    };

    const [modalItem, setModalItem] = React.useState<{ stock: Stock } | null>(null);
    console.log(props.stockWithLocation);
    return <>
        <ItemInfoDialog item={modalItem?.stock.item ?? null} open={itemInfoOpen} handleClose={handleItemInfoClose}
                        corporate={props.corporate}
                        quantity={modalItem?.stock.quantity ?? 0} /*setCorporate={props.setCorporate}*/
                        allowBuy={false}/>
        <BaseTable className={"itemInStoreTable"} headers={["Name", "Aisle", "Shelf", "Price ($)", "Quantity", ""]}
                   data={props.stockWithLocation.map((swl: { location: ItemLocation, stock: Stock }, i) => {
                       let items = swl.stock.item;
                       let item = new Item(items.sku, items.name, items.description, items.price, items.max, new ItemLocation(swl.location.aisle, swl.location.shelf));
                       let s = new Stock(item, swl.stock.quantity);
                       return {
                           id: i,
                           columns: [<Link color="primary" underline="hover"
                                           onClick={handleItemInfoClickOpen(swl)}>{item.name}</Link>,
                               s.item.location?.aisle, s.item.location?.shelf, s.item.price, s.quantity]
                       }
                   })} noRowsMessage={"No items on shelves"}/>
    </>
}