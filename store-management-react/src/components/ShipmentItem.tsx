import React from "react";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import IconButton from "@mui/material/IconButton";

const ShipmentItem = (props:{label:string}) => (
    <div className={"shipmentItem"}>
        <div style={{color:"white"}}>
            {props.label}
        </div>
        <IconButton style={{color:"white"}}><CancelOutlinedIcon/></IconButton>
    </div>
);

export default ShipmentItem;