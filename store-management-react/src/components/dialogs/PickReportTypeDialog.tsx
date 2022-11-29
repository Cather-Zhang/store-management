import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../../types/Corporate";
import CloseIcon from '@mui/icons-material/Close';
import {Store} from "../../types/Store";

export default function PickReportTypeDialog(props: {
    store: Store | null, open: boolean, handleClose: () => void, corporate: Corporate,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>
}) {
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogActions>
                <Button onClick={props.handleClose} style={{minWidth: 0}}><CloseIcon/></Button>
            </DialogActions>
            <DialogTitle marginTop={"-30px"} paddingBottom={"0px !important"} fontSize={"30px !important"}
                         align={"center"}>Pick a Report Type</DialogTitle>
            <DialogContent style={{textAlign: "center", margin: "0 50px"}}>
                <br/>
                <Button size={"large"} variant="contained" href={"#/inventoryReport?id=" + props.store?.id}>Inventory Report</Button>
                <br/><br/>
                <Button size={"large"} variant="contained" href={"#/overstockReport?id=" + props.store?.id}>Overstock Report</Button>
                <br/><br/>
                <Button size={"large"} variant="contained">Missing Items Report</Button>
            </DialogContent>
            <br/>
        </Dialog>
    );
}