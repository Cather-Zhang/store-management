import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../../types/Corporate";
import {DialogContentText} from "@mui/material";
import {Item} from "../../types/Item";
import {assignItemLocationController} from "../../Controllers";
import {getById} from "../../Utilities";

export default function AssignItemLocationDialog(props: {
    item: Item | null,
    open: boolean, handleClose: () => void, corporate: Corporate,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>
}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogTitle paddingBottom={"0px !important"} fontSize={"30px !important"} align={"center"}>Assign Item
                Location</DialogTitle>
            <DialogContent style={{textAlign: "center"}}>
                <TextField
                    id="locations"
                    label="Aisle/Shelf"
                    type="text"
                    variant="standard"
                />
            </DialogContent>
            <DialogContentText align={"center"}>Once you assign an item's location you cannot reassign them, so choose
                wisely! Separate aisle and row with a comma (ex. 3,4).</DialogContentText>
            <br/>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={() => {
                    if (props.item) {
                        assignItemLocationController(props.corporate, props.item.sku, getById("locations"),
                            props.handleClose).then(c => props.setCorporate(c))
                    }
                }}>
                    Assign Item Location
                </Button>
            </DialogActions>
        </Dialog>
    );
}