import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {Corporate} from "../../types/Corporate";
import {DialogContentText} from "@mui/material";
import {Item} from "../../types/Item";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import {APINamespace, getById, sendRequest} from "../../Utilities";
import {ItemLocation} from "../../types/ItemLocation";
import {buyItemsController} from "../../Controllers";

export default function BuyItemDialog(props: {
    item: Item | null, storeId: number | null, location: ItemLocation | null, setSearchResult: any, setAllItems: any,
    open: boolean, handleClose: () => void, corporate: Corporate, availableQuantity: number | null,
    setCorporate: React.Dispatch<React.SetStateAction<Corporate>>, individualStore: boolean, searchType: string
}) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={props.handleClose}>
            <DialogActions>
                <Button onClick={props.handleClose} style={{minWidth: 0}}><CloseIcon/></Button>
            </DialogActions>
            <DialogTitle paddingBottom={"10px !important"} fontSize={"30px !important"}
                         align={"center"}>Buy {props.item?.name}</DialogTitle>
            <DialogContentText align={"left"} margin={"0 100px !important"}>
                <div style={{display: "flex", marginTop: "10px", alignItems: "center", flexDirection: "column"}}>
                    <div style={{width: "185px"}}>
                        <b>Cost</b>: ${props.item?.price}
                        <br/>
                        <b>Available quantity</b>: {props.availableQuantity}
                        <br/><br/>
                    </div>
                    <TextField
                        autoFocus
                        id="quantity"
                        label="Quantity to Buy"
                        type="number"
                        variant="standard"
                        size="small"
                    /><br/>
                    <Button variant="contained" style={{width: "170px"}} onClick={() => {
                        sendRequest(APINamespace.Customer, "/buyItem", {
                            storeId: props.storeId,
                            sku: props.item?.sku,
                            aisle: props.item?.location?.aisle,
                            shelf: props.item?.location?.shelf,
                            quantity: getById("quantity")
                        }).then(response => {
                            if (response.status === 200) {
                                props.setCorporate(buyItemsController(props.corporate, props.storeId, props.location,
                                    props.item?.sku ?? null, parseInt(getById("quantity")) ?? null));
                                if (!props.individualStore) {
                                    sendRequest(APINamespace.Customer, "/listStoreItems", {"storeId": props.storeId}).then(
                                        r => {
                                            if (r.status === 200) {
                                                props.setAllItems(r.stocks);
                                            }
                                        }
                                    );
                                    sendRequest(APINamespace.Customer, "/findStoreItem", {
                                        latitude: 0,
                                        longitude: 0,
                                        storeId: props.storeId,
                                        type: props.searchType.toLowerCase(),
                                        value: getById("searchValue")
                                    }).then(
                                        r => {
                                            if (r.status === 200) {
                                                props.setSearchResult(r.stocks.map((s: any) => {
                                                    let location = new ItemLocation(s.location.aisle, s.location.shelf);
                                                    return {
                                                        storeId: s.idStores,
                                                        item: new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location),
                                                        location: location,
                                                        quantity: s.quantity
                                                    };
                                                }));
                                            }
                                        }
                                    );
                                } else {
                                    sendRequest(APINamespace.Customer, "/findItem", {
                                        latitude: 0,
                                        longitude: 0,
                                        type: props.searchType.toLowerCase(),
                                        value: getById("searchValue")
                                    }).then(
                                        r => {
                                            if (r.status === 200) {
                                                props.setSearchResult(r.stocks.map((input: any) => {
                                                    let s = input[0];
                                                    let location = new ItemLocation(s.location.aisle, s.location.shelf);
                                                    return {
                                                        storeId: s.idStores,
                                                        item: new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location),
                                                        location: location,
                                                        quantity: s.quantity
                                                    };
                                                }));
                                            }
                                        }
                                    );
                                }
                                props.handleClose();
                            }
                        });
                    }}>Confirm</Button>
                </div>
            </DialogContentText>
            <br/>
            <br/>
        </Dialog>
    );
}