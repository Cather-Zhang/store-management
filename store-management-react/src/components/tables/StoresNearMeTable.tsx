import * as React from 'react';
import {Store} from "../../types/Store";
import {Button} from "@mui/material";
import BaseTable from "./BaseTable";

export default function StoresNearMeTable(props: { stores: { store: Store, distance: number }[] }) {
    return <>
        <BaseTable className={"storesNearMeTable"} headers={["Store ID", "Location", "Distance", ""]}
                   data={props.stores.map((storeWithDistance: { store: Store, distance: number }, i: number) => {
                       let store = storeWithDistance.store;
                       return {
                           id: i,
                           columns: [store.id, store.gps.latitude + ", " + store.gps.longitude, storeWithDistance.distance + " miles",
                               <>
                                   <Button style={{marginLeft: 20}} color="secondary" variant="contained"
                                           href={"#/store?id=" + store?.id}>Browse
                                   </Button>
                               </>
                           ]
                       };
                   })} noRowsMessage={"No stores"}/>
    </>;
}