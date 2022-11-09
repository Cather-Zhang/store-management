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

function ManageStore(props: { corporate: Corporate, currentUser: any, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    const [assignedItems, setAssignedItems] = useState<Item[]>([]);
    const [selectItem, setSelectItem] = useState("");
    const [shipment, setShipment] = useState<{ "sku": string, quantity: number }[]>([]);

    useEffect(() => {
        const loadCorporateState = async () => {
            let storeResponse = await sendRequest(APINamespace.Manager, "/listAssignedItems", null);
            setAssignedItems(itemJSONToTS(storeResponse));
        }
        loadCorporateState().then();
    }, []);


    return (
        <div className={"page"}>
            <h1>Manage Store #{props.currentUser.storeId}</h1>
            <div className={"buttonMenu"}>
                <h3>Input Shipment</h3>
                <Button variant="contained">Fill To Max</Button>
                <Button variant="contained" href={"#/inventoryReport?id=" + props.currentUser.storeId}>Generate
                    Report</Button>
            </div>
            <div className={"centered"}>
                <IconButton color={"primary"}><AddCircleTwoToneIcon onClick={() => {
                    let quantity = getById("quantity");
                    let newShipment = JSON.parse(JSON.stringify(shipment));
                    if (selectItem != "") {
                        newShipment.push({"sku": selectItem, quantity: +quantity});
                    }
                    setShipment(newShipment);
                }}/></IconButton>
                <FormControl style={{minWidth: 120, paddingRight: "5px"}}>
                    <InputLabel id="selectedItemLabel">Item Name</InputLabel>
                    <Select
                        labelId="selectedItemLabel"
                        id="selectedItem"
                        label="Item"
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
                />
            </div>
            <div style={{justifyContent:"center", display:"flex"}}>
                {shipment.map((ship, i) => <ShipmentItem setShipment={setShipment} shipment={shipment} stockId={i}
                                                         label={ship.quantity + " " + props.corporate.items.filter(i => i.sku === ship.sku)[0].name}/>)}
            </div>
            <div style={{justifyContent:"center", display:"flex"}}>
                <Button variant="contained" onClick={() => {
                    sendRequest(APINamespace.Manager, "/processShipment", {
                        "storeId": 28,
                        "shipments": "[" + shipment.map(i => JSON.stringify(i)).join(", ") + "]"
                    }).then(r => console.log(r));
                }}>Process Shipment</Button>
            </div>

        </div>
    );
}

export default ManageStore;