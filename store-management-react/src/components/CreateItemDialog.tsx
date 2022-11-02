import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CreateItemDialog(props: {open: boolean, handleClose: () => void}) {
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
                type="text"
                variant="standard"
                /><br />
                <TextField
                    id="maxQuantity"
                    label="Max Quantity"
                    type="number"
                    variant="standard"
                /><br />
                <TextField
                    id="locations"
                    label="Aisle/Shelf"
                    type="text"
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={props.handleClose}>Create Item</Button>
            </DialogActions>
        </Dialog>
    );
}