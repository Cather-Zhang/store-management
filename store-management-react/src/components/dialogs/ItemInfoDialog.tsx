import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../../types/Corporate";
import {DialogContentText} from "@mui/material";
import {Item} from "../../types/Item";
import CloseIcon from "@mui/icons-material/Close";

export default function ItemInfoDialog(props: {
    item: Item | null,
    open: boolean, handleClose: () => void, corporate: Corporate,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>
    allowBuy: boolean
}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogActions>
                <Button onClick={props.handleClose} style={{minWidth: 0}}><CloseIcon/></Button>
            </DialogActions>
            <DialogTitle paddingBottom={"10px !important"} fontSize={"30px !important"}
                         align={"center"}>{props.item?.name}</DialogTitle>
            <DialogContentText align={"left"} margin={"0 75px !important"}>
                <b>SKU</b>: {props.item?.sku}
                <br/>
                <b>Cost</b>: {props.item?.price}
                <br/>
                <b>Locations</b>: {props.item?.getLocationString()}
                <br/>
                <b>Description</b>: {props.item?.description}
                {props.allowBuy && <Button>Buy</Button>}
            </DialogContentText>
            <br/>
            <br/>
        </Dialog>
    );
}