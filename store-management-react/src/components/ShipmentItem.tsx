import React from "react";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import IconButton from "@mui/material/IconButton";

const ShipmentItem = (props:{label:string}) => (
    <div className={"shipmentItem"}>
        <div>
            {props.label}
        </div>
        <IconButton style={{color:"white"}}><AddCircleTwoToneIcon></AddCircleTwoToneIcon></IconButton>
    </div>
);

export default ShipmentItem;