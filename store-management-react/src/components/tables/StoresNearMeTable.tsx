import * as React from 'react';
import {Store} from "../../types/Store";
import {Button} from "@mui/material";
import {deleteStoreController} from "../../Controllers";
import {Corporate} from "../../types/Corporate";
import BaseTable from "./BaseTable";
import PickReportTypeDialog from "../dialogs/PickReportTypeDialog";

export default function StoresNearMeTable(props: { stores: {store: Store, distance: number}[]}) {
    const [reportStore, setReportStore] = React.useState<Store | null>(null);

    const [reportOpen, setReportOpen] = React.useState(false);
    const handleReportClickOpen = (store: Store) => {
        return function () {
            setReportStore(store);
            setReportOpen(true);
        }
    };
    const handleReportClose = () => {
        setReportOpen(false);
    };

    return <>
        <BaseTable className={"storeTable"} headers={["Store ID", "Location", "Distance", ""]}
                   data={props.stores.map((storeWithDistance:{store: Store, distance: number}, i: number) => {
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