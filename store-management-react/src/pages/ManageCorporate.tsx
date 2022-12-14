import React from "react";
import {Button} from "@mui/material";
import {Corporate} from "../types/Corporate";
import CreateItemDialog from "../components/dialogs/CreateItemDialog";
import CreateStoreDialog from "../components/dialogs/CreateStoreDialog";
import StoreTable from "../components/tables/StoreTable";
import ItemTable from "../components/tables/ItemTable";

function ManageCorporate(props: { corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    const [itemOpen, setItemOpen] = React.useState(false);
    const handleItemClickOpen = () => {
        setItemOpen(true);
    };
    const handleItemClose = () => {
        setItemOpen(false);
    };

    const [storeOpen, setStoreOpen] = React.useState(false);
    const handleStoreClickOpen = () => {
        setStoreOpen(true);
    };
    const handleStoreClose = () => {
        setStoreOpen(false);
    };

    return (
        <div className={"page"}>
            <CreateItemDialog open={itemOpen} handleClose={handleItemClose} corporate={props.corporate}
                              setCorporate={props.setCorporate}/>
            <CreateStoreDialog open={storeOpen} handleClose={handleStoreClose} corporate={props.corporate}
                               setCorporate={props.setCorporate}/>
            <h1>Manage Stores and Items</h1>
            <div className={"buttonMenu"}>
                <Button variant="contained" href={"#/totalReport"}>Generate Total Report</Button>
                <Button variant="contained" onClick={handleItemClickOpen}>Create Item</Button>
                <Button variant="contained" onClick={handleStoreClickOpen}>Create Store</Button>
            </div>
            <br/>
            <h2>Stores</h2>
            <StoreTable corporate={props.corporate} setCorporate={props.setCorporate}/>
            <h2>Items</h2>
            <ItemTable corporate={props.corporate} setCorporate={props.setCorporate}/>
            <br/>
            <br/>
        </div>
    );
}

export default ManageCorporate;