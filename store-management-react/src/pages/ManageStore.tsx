import React, {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import {FormControl, InputLabel, Select} from "@mui/material";
import {Corporate} from "../types/Corporate";
import TextField from "@mui/material/TextField";
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import IconButton from "@mui/material/IconButton";
import ShipmentItem from "../components/ShipmentItem";
import {APINamespace, getById, itemJSONToTS, sendRequest} from "../Utilities";
import {Item} from "../types/Item";
import PickReportTypeDialog from "../components/dialogs/PickReportTypeDialog";

function ManageStore(props: { corporate: Corporate, currentUser: any, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    const [assignedItems, setAssignedItems] = useState<Item[]>([]);
    const [selectItem, setSelectItem] = useState("");
    const [shipment, setShipment] = useState<{ "sku": string, quantity: number }[]>([]);
    const [reportOpen, setReportOpen] = React.useState(false);
    const handleReportClickOpen = () => {
        setReportOpen(true);
    };
    const handleReportClose = () => {
        setReportOpen(false);
    };

    const handleFillShelves = () => {
        sendRequest(APINamespace.Manager, "/fillShelves", null).then();
    };

    useEffect(() => {
        const loadCorporateState = async () => {
            let storeResponse = await sendRequest(APINamespace.Manager, "/listAssignedItems", null);
            setAssignedItems(itemJSONToTS(storeResponse));
        }
        loadCorporateState().then();
    }, []);


    return (
        <div className={"page"}>

            <PickReportTypeDialog store={props.corporate.stores.find(s => s.id == props.currentUser.storeId) ?? null} open={reportOpen} handleClose={handleReportClose} corporate={props.corporate}
                              setCorporate={props.setCorporate}/>
            <h1>Manage Store #{props.currentUser.storeId}</h1>
            <div className={"buttonMenu"} style={{width: "20%", marginBottom: "10px"}}>
                <Button variant="contained" onClick={handleFillShelves}>Fill To Max</Button>
                <Button variant="contained" onClick={handleReportClickOpen}>Generate
                    Report</Button>
            </div>
            <h3>Input Shipment</h3>
            <div className={"centered"}>
                <IconButton color={"primary"} size={"large"}>
                    <AddCircleTwoToneIcon fontSize={"large"} onClick={() => {
                        let quantity = getById("quantity");
                        let newShipment = JSON.parse(JSON.stringify(shipment));
                        if (selectItem != "") {
                            newShipment.push({"sku": selectItem, quantity: +quantity});
                        }
                        setShipment(newShipment);
                    }}/></IconButton>
                <FormControl size="small" style={{minWidth: 200, paddingRight: "5px", marginLeft: "5px"}}>
                    <InputLabel id="selectedItemLabel">Item Name</InputLabel>
                    <Select
                        labelId="selectedItemLabel"
                        id="selectedItem"
                        label="Item Name"
                        onChange={(v) => setSelectItem(v.target.value as string)}
                    >
                        {assignedItems.map(i => (<MenuItem value={i.sku}>{i.name}</MenuItem>))}
                    </Select>
                </FormControl>
                <TextField
                    id="quantity"
                    label="Quantity"
                    type="number"
                    variant="standard"
                    size="small"
                    style={{marginBottom: "10px", marginLeft: "10px"}}
                />
            </div>
            <div style={{margin: "auto"}}>
                {shipment.map((ship, i) => <ShipmentItem setShipment={setShipment} shipment={shipment} stockId={i}
                                                         label={ship.quantity + " " + props.corporate.items.filter(i => i.sku === ship.sku)[0].name}/>)}
            </div><br/>
            <div style={{justifyContent: "center", display: "flex"}}>
                <Button variant="contained" onClick={() => {
                    sendRequest(APINamespace.Manager, "/processShipment", {
                        "storeId": props.currentUser.storeId,
                        "shipments": "[" + shipment.map(i => JSON.stringify(i)).join(", ") + "]"
                    }).then(() => setShipment([]));
                }}>Process Shipment</Button>
            </div>

        </div>
    );
}

export default ManageStore;