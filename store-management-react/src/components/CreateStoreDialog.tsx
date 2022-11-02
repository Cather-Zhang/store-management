import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../types/Corporate";
import {createStoreController} from "../Controllers";

export default function CreateStoreDialog(props: {open: boolean, handleClose: () => void, corporate: Corporate,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogTitle paddingBottom={"0px !important"} fontSize={"30px !important"} align={"center"}>Create Store</DialogTitle>
            <DialogContent style={{textAlign: "center"}}>
                <TextField
                    autoFocus
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
                    label="Confirm Manager Password"
                    type="password"
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={() => {
                    function getById(id: string) {
                        return (document.getElementById(id) as HTMLInputElement)?.value;
                    }

                    let password = getById("password");
                    let passwordConfirm = getById("passwordConfirm");

                    if(password === passwordConfirm) {
                        props.setCorporate(createStoreController(props.corporate, +getById("latitude"),
                            +getById("longitude"), getById("manager"), getById("password")))
                        props.handleClose()
                    }
                }}>
                    Create Store
                </Button>
            </DialogActions>
        </Dialog>
    );
}