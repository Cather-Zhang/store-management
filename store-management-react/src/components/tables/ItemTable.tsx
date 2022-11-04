import * as React from 'react';
import {Button} from "@mui/material";
import {Corporate} from "../../types/Corporate";
import BaseTable from "./BaseTable";
import {Item} from "../../types/Item";
import AssignItemLocationDialog from "../dialogs/AssignItemLocationDialog";

export default function ItemTable(props: { corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    const [assignLocOpen, setAssignLocOpen] = React.useState(false);
    const [modalItem, setModalItem] = React.useState<Item | null>(null);

    const handleAssignLocClickOpen = (item: Item) => {
        return function () {
            setModalItem(item);
            setAssignLocOpen(true);
        };
    };
    const handleAssignLocClose = () => {
        setAssignLocOpen(false);
    };

    return <>
        <AssignItemLocationDialog item={modalItem} open={assignLocOpen} handleClose={handleAssignLocClose}
                                  corporate={props.corporate}
                                  setCorporate={props.setCorporate}/>
        <BaseTable className={"itemTable"} headers={["Name", "Price ($)", "Max", "Locations", ""]}
                   data={props.corporate.items.map((item: Item, i: number) => {
                       return {
                           id: i,
                           columns: [item.name, item.price, item.max, item.getLocationString(),
                               <div style={{display: "flex", justifyContent: "center"}}>
                                   <Button color="secondary" variant="contained" disabled={item.locations.length > 0}
                                           onClick={handleAssignLocClickOpen(item)}>Assign Locations</Button>
                               </div>
                           ]
                       };
                   })}/>
    </>;
}