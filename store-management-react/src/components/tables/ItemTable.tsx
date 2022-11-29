import * as React from 'react';
import {Button, Link} from "@mui/material";
import {Corporate} from "../../types/Corporate";
import BaseTable from "./BaseTable";
import {Item} from "../../types/Item";
import AssignItemLocationDialog from "../dialogs/AssignItemLocationDialog";
import ItemInfoDialog from "../dialogs/ItemInfoDialog";

export default function ItemTable(props: { corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    const [assignLocOpen, setAssignLocOpen] = React.useState(false);
    const [assignLocItem, setAssignLocItem] = React.useState<Item | null>(null);

    const handleAssignLocClickOpen = (item: Item) => {
        return function () {
            setAssignLocItem(item);
            setAssignLocOpen(true);
        };
    };
    const handleAssignLocClose = () => {
        setAssignLocOpen(false);
    };

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
    const [buyItem, setBuyItem] = React.useState<Item | null>(null);

    const handleBuyItemClickOpen = (item: Item) => {
        return function () {
            setBuyItem(item);
            setBuyItemOpen(true);
        };
    };
    const handleBuyItemClose = () => {
        setBuyItemOpen(false);
    };

    return <>
        <AssignItemLocationDialog item={assignLocItem} open={assignLocOpen} handleClose={handleAssignLocClose}
                                  corporate={props.corporate}
                                  setCorporate={props.setCorporate}/>
        <ItemInfoDialog item={infoItem} open={itemInfoOpen} handleClose={handleItemInfoClose}
                        handleBuyItemClickOpen={handleBuyItemClickOpen}
                        corporate={props.corporate}
                        setCorporate={props.setCorporate} allowBuy={false}  quantity={0}/>
        <BaseTable className={"itemTable"} headers={["Name", "Price ($)", "Max", "Locations", ""]}
                   data={props.corporate.items.map((item: Item, i: number) => {
                       return {
                           id: i,
                           columns: [<Link color="primary" underline="hover"
                                           onClick={handleItemInfoClickOpen(item)}>{item.name}</Link>, item.price, item.max, item.getLocationString(),
                               <div style={{display: "flex", justifyContent: "center"}}>
                                   <Button color="secondary" variant="contained" disabled={item.location == null}
                                           onClick={handleAssignLocClickOpen(item)}>Assign Locations</Button>
                               </div>
                           ]
                       };
                   })} noRowsMessage={"No Items"}/>
    </>;
}