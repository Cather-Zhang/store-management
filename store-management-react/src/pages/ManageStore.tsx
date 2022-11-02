import React from "react";
import Button from '@mui/material/Button';

function ManageStore() {
    return (
        <div>
            <h1>Manage Store #</h1>
            <br />
            <h2>Input Shipment</h2>
            <Button variant="contained">Fill To Max</Button>
            <Button variant="contained">Generate Report</Button>
            <br />
            <Button variant="contained">Process Shipment</Button>
        </div>


    );
}

export default ManageStore;
