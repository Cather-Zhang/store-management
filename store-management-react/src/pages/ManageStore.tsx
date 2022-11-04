import React from "react";
import Button from '@mui/material/Button';

function ManageStore() {
    return (
        <div className={"page"}>
            <h1>Manage Store #</h1>
            <div className={"buttonMenu"}>
                <h3>Input Shipment</h3>
                <Button variant="contained">Fill To Max</Button>
                <Button variant="contained">Generate Report</Button>
            </div>
            <select name="items" id="items">
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="opel">Opel</option>
                <option value="audi">Audi</option>
            </select>

            <Button variant="contained">Process Shipment</Button>
        </div>


    );
}

export default ManageStore;
