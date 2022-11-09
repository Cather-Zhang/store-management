import React from "react";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import IconButton from "@mui/material/IconButton";

const ShipmentItem = (props:{label: string, stockId: number, shipment: {sku: string, quantity: number}[], setShipment: any}) => (
    <div className={"shipmentItem"}>
        <div style={{color:"white"}}>
            {props.label}
        </div>
        <IconButton style={{color:"white"}} onClick={() => {
            let newShipment = JSON.parse(JSON.stringify(props.shipment));
            newShipment.splice(props.stockId, 1);
            props.setShipment(newShipment);
        }}>
            <CancelOutlinedIcon/>
        </IconButton>
    </div>
);

export default ShipmentItem;