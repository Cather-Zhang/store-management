import * as React from 'react';
import {Store} from "../../types/Store";
import {Button} from "@mui/material";
import {deleteStoreController} from "../../Controllers";
import {Corporate} from "../../types/Corporate";
import BaseTable from "./BaseTable";
import PickReportTypeDialog from "../dialogs/PickReportTypeDialog";

export default function StoreTable(props: { corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>> }) {
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
        <PickReportTypeDialog store={reportStore} open={reportOpen} handleClose={handleReportClose}
                              corporate={props.corporate}
                              setCorporate={props.setCorporate}/>
        <BaseTable className={"storeTable"} headers={["Store ID", "Name", "Location", "Manager", ""]}
                   data={props.corporate.stores.map((store: Store, i: number) => {
                       return {
                           id: i,
                           columns: [store.id, store.name, store.gps.latitude + ", " + store.gps.longitude, store.manager.userID,
                               <>
                                   <Button color="secondary" variant="contained"
                                           onClick={() => deleteStoreController(props.corporate, store.id).then(c => props.setCorporate(c))}>Delete</Button>
                                   <Button style={{marginLeft: 20}} color="secondary" variant="contained"
                                           onClick={handleReportClickOpen(store)}>Generate
                                       Report</Button>
                               </>
                           ]
                       };
                   })}/>
    </>;
}