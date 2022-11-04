import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../types/Corporate";
import {createItemController} from "../Controllers";

export default function CreateItemDialog(props: {open: boolean, handleClose: () => void, corporate: Corporate,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogTitle paddingBottom={"0px !important"} fontSize={"30px !important"} align={"center"}>Create Item</DialogTitle>
            <DialogContent style={{textAlign: "center"}}>
                <TextField
                    autoFocus
                    id="name"
                    label="Name"
                    type="text"
                    variant="standard"
                /><br />
                <TextField
                id="price"
                label="Price ($)"
                type="number"
                variant="standard"
                /><br />
                <TextField
                    id="maxQuantity"
                    label="Max Quantity"
                    type="number"
                    variant="standard"
                /><br/><br/>
                <TextField
                    id="desc"
                    label="Description"
                    multiline
                    minRows={4}
                    maxRows={4}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={() => {
                    function getById(id: string) {
                        return (document.getElementById(id) as HTMLInputElement)?.value;
                    }

                    props.setCorporate(createItemController(props.corporate, getById("name"), getById("desc"),
                        +getById("price"), +getById("maxQuantity")));
                    props.handleClose();
                }}>
                    Create Item
                </Button>
            </DialogActions>
        </Dialog>
    );
}