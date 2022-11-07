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



            <Button variant="contained">Process Shipment</Button>
        </div>


    );
}

export default ManageStore;
