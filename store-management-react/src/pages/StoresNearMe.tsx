import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import {APINamespace, getById, sendRequest, storeJSONtoTS} from "../Utilities";
import {Corporate} from "../types/Corporate";
import {Item} from "../types/Item";
import {ItemLocation} from "../types/ItemLocation";
import ShipmentItem from "../components/ShipmentItem";
import StoresNearMeTable from "../components/tables/StoresNearMeTable";
import {Store} from "../types/Store";
import {GPS} from "../types/GPS";

function StoresNearMe() {
    const [stores, setStores] = useState<{store: Store, distance: number}[]>([]);

    return (
        <div className={"page"}>
            <h1>Stores Near Me</h1>
            <div className={"centered"}>
                <TextField
                    id="latitude"
                    label="Latitude"
                    type="number"
                    variant="standard"
                    size="small"
                    style={{marginBottom: "10px", marginLeft: "10px"}}
                />
                <TextField
                    id="longitude"
                    label="Longitude"
                    type="number"
                    variant="standard"
                    size="small"
                    style={{marginBottom: "10px", marginLeft: "10px", marginRight: "10px"}}
                />
                {/*<div style={{margin: "auto"}}>
                    {stores.map((store, i) => <ShipmentItem setShipment={setShipment} shipment={shipment} stockId={i}
                                                             label={ship.quantity + " " + props.corporate.items.filter(i => i.sku === ship.sku)[0].name}/>)}
                </div><br/>*/}

                <Button variant="contained" onClick={() => {
                    sendRequest(APINamespace.Customer, "/listStores", {
                        "latitude": getById("latitude"), "longitude": getById("longitude")}).then(r => {
                            if(r.status ===  200){
                                console.log(r.stores)
                                setStores(r.stores.map((s: any) => {
                                    return {store: new Store(s.idStores, s.name, [], s.manager, [], new GPS(s.latitude, s.longitude)), distance: parseFloat(s.distance)};
                                }))
                            }
                        });
                }}>Submit</Button>
            </div>
            <p style={{marginTop: "30px"}} className="subtitle">Enter your location to see nearby stores</p>
            <StoresNearMeTable stores={stores}></StoresNearMeTable>
        </div>
    );
}

export default StoresNearMe;
