import React from "react";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import {FormControl, InputLabel, Select} from "@mui/material";
import {Corporate} from "../types/Corporate";
import TextField from "@mui/material/TextField";
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import IconButton from "@mui/material/IconButton";
import ShipmentItem from "../components/ShipmentItem";

function ManageStore(props: { corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
    console.log(props.corporate.items)

    return (
        <div className={"page"}>
            <h1>Manage Store #</h1>
            <div className={"buttonMenu"}>
                <h3>Input Shipment</h3>
                <Button variant="contained">Fill To Max</Button>
                <Button variant="contained">Generate Report</Button>
            </div>

            <div>
                <IconButton color={"primary"}><AddCircleTwoToneIcon></AddCircleTwoToneIcon></IconButton>

                <FormControl style={{minWidth: 120}}>
                    <InputLabel id="demo-simple-select-label">Item Name</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Item"
                    >
                        {props.corporate.items.map(i => (<MenuItem value={i.sku}>{i.name}</MenuItem>))}

                    </Select>
                </FormControl>

                <TextField
                    id="quantity"
                    label="Quantity"
                    type="number"
                    variant="standard"
                />

            </div>
            <div>
                <ShipmentItem label={"11 green beans"}></ShipmentItem>
            </div>


            <Button variant="contained">Process Shipment</Button>
        </div>


    );
}

export default ManageStore;
