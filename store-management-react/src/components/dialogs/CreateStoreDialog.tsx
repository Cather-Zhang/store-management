import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../../types/Corporate";
import {createStoreController, updateStoresController} from "../../Controllers";
import {APINamespace, getById, sendRequest} from "../../Utilities";

export default function CreateStoreDialog(props: {open: boolean, handleClose: () => void, corporate: Corporate,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogTitle paddingBottom={"0px !important"} fontSize={"30px !important"} align={"center"}>Create Store</DialogTitle>
            <DialogContent style={{textAlign: "center"}}>
                <TextField
                    autoFocus
                    id="name"
                    label="Name"
                    type="text"
                    variant="standard"
                /><br />
                <TextField
                    id="latitude"
                    label="Latitude"
                    type="number"
                    variant="standard"
                /><br />
                <TextField
                id="longitude"
                label="Longitude"
                type="number"
                variant="standard"
                /><br />
                <TextField
                    id="manager"
                    label="Manager Name"
                    type="text"
                    variant="standard"
                /><br />
                <TextField
                    id="password"
                    label="Manager Password"
                    type="password"
                    variant="standard"
                /><br/>
                <TextField
                    id="passwordConfirm"
                    label="Confirm Password"
                    type="password"
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={async () => {
                    let password = getById("password");
                    let passwordConfirm = getById("passwordConfirm");

                    if(password === passwordConfirm) {
                        createStoreController(props.corporate, getById("name"), +getById("latitude"), +getById("longitude"), getById("manager"), getById("password"), props.handleClose).then(c => props.setCorporate(c))
                    }
                }}>
                    Create Store
                </Button>
            </DialogActions>
        </Dialog>
    );
}