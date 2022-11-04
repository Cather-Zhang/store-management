import * as React from 'react';
import {Button} from "@mui/material";
import {Corporate} from "../types/Corporate";
import BaseTable from "./BaseTable";
import {Item} from "../types/Item";
import AssignItemLocationDialog from "./AssignItemLocationDialog";

export default function ItemTable(props: { corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    const [assignLocOpen, setAssignLocOpen] = React.useState(false);
    const handleAssignLocClickOpen = () => {
        setAssignLocOpen(true);
    };
    const handleAssignLocClose = () => {
        setAssignLocOpen(false);
    };

    return <>
        <AssignItemLocationDialog open={assignLocOpen} handleClose={handleAssignLocClose} corporate={props.corporate}
                                  setCorporate={props.setCorporate}/>
        <BaseTable className={"itemTable"} headers={["SKU", "Name", "Price ($)", "Max", ""]}
                   data={props.corporate.items.map((item: Item, i: number) => {
                       return {
                           id: i,
                           columns: [item.sku, item.name, item.price, item.max,
                               <div style={{display: "flex", justifyContent: "center"}}>
                                   <Button color="secondary" variant="contained"
                                           onClick={handleAssignLocClickOpen}>Assign Locations</Button>
                               </div>
                           ]
                       };
                   })}/>
    </>;
}