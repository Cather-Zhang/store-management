import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import {APINamespace, getById, sendRequest} from "../Utilities";
import StoresNearMeTable from "../components/tables/StoresNearMeTable";
import {Store} from "../types/Store";
import {GPS} from "../types/GPS";

function StoresNearMe(props: {gps: GPS, setGPS: any}) {
    const [stores, setStores] = useState<{store: Store, distance: number}[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

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

                <Button variant="contained" onClick={() => {
                    props.setGPS(new GPS(+getById("latitude"), +getById("longitude")))
                    sendRequest(APINamespace.Customer, "/listStores", {
                        "latitude": props.gps.latitude, "longitude": props.gps.longitude}).then(r => {
                            if(r.status ===  200){
                                setStores(r.stores.map((s: any) => {
                                    return {store: new Store(s.idStores, s.name, [], s.manager, [], new GPS(s.latitude, s.longitude)), distance: parseFloat(s.distance)};
                                }));
                                setHasSearched(true);
                            }
                        });
                }}>Submit</Button>
            </div>
            <br/>
            {hasSearched ? <StoresNearMeTable stores={stores}/> : <p style={{marginTop: "30px"}} className="subtitle">Enter your location to see nearby stores</p>}
        </div>
    );
}

export default StoresNearMe;
