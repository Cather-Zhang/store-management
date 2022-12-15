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
import {Store} from "../../types/Store";

export default function TotalTable(props: {
    corporate: Corporate, setCorporate: any, storeWithValue: { store: Store, totalValue: number }[],
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
                        corporate={props.corporate} quantity={modalItem?.stock.quantity ?? 0} allowBuy={false}/>
        <BaseTable className={"itemInStoreTable"} headers={["Store ID", "Store Name", "Location", "Total Value"]}
                   data={props.storeWithValue.map((swv, i) => {
                       return {
                           id: i,
                           columns: [swv.store.id, swv.store.name, swv.store.gps.toString(), swv.totalValue]
                       }
                   })} noRowsMessage={"No Stores"}/>
    </>
}