import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import {APINamespace, getById, sendRequest} from "../Utilities";
import {Corporate} from "../types/Corporate";

function StoresNearMe(props: { corporate: Corporate, currentUser: null, setCorporate: React.Dispatch<React.SetStateAction<Corporate>>}) {
    /*const [stores, setStores] = useState("")
    useEffect(() => {
        const loadCorporateState = async () => {
            let storeResponse = await sendRequest(APINamespace.Customer, "/listStores", null);
            setStores(storeJSONToTS(storeResponse));
        }
        loadCorporateState().then();
    }, []);*/

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
                    sendRequest(APINamespace.Customer, "/listStores", {
                        "latitude": getById("latitude"),
                        "longitude": getById("longitude")})/*.then(() => setStores([]))*/;
                }}>Submit</Button>
            </div>
            <h5>Enter your location to see nearby stores</h5>
        </div>
    );
}

export default StoresNearMe;
