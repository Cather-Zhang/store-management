import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import {APINamespace, getById, sendRequest} from "../../Utilities";

export default function LoginDialog(props: { open: boolean, handleClose: () => void,
    setCurrentUser(user: any): void, setUsername: any
}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogActions>
                <Button onClick={props.handleClose} style={{minWidth: 0}}><CloseIcon/></Button>
            </DialogActions>
            <DialogTitle paddingBottom={"0px !important"} fontSize={"30px !important"}
                         align={"center"} marginTop={"-30px"}>Login</DialogTitle>
            <br/>
            <DialogContent style={{textAlign: "center"}}>
                <TextField
                    autoFocus
                    id="username"
                    label="Username"
                    type="text"
                    variant="standard"
                /><br/>
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="standard"
                /><br/><br/><br/>
                <Button variant="contained" onClick={() => {
                    let username = getById("username");
                    sendRequest(APINamespace.Customer, "/login", {
                        "username": username,
                        "password": getById("password")
                    }).then(
                        r => {
                            if (r.status === 200) {
                                props.setCurrentUser(r);
                                props.setUsername(username);
                                window.localStorage.setItem('currentUser', JSON.stringify(r));
                                window.localStorage.setItem('username', JSON.stringify(username));
                                props.handleClose();
                            }
                        }
                    );
                }}>Login</Button>
                <br/><br/>
            </DialogContent>
        </Dialog>
    );
}