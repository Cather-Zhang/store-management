import React from "react";
import {Button} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Corporate} from "../types/Corporate";
import {Store} from "../types/Store";
import {deleteStoreController} from "../Controllers";
import CreateItemDialog from "../components/CreateItemDialog";
import CreateStoreDialog from "../components/CreateStoreDialog";

function ManageCorporate(props: {corporate: Corporate, setCorporate: React.Dispatch<React.SetStateAction<Corporate>>}) {
    const [itemOpen, setItemOpen] = React.useState(false);
    const handleItemClickOpen = () => { setItemOpen(true); };
    const handleItemClose = () => { setItemOpen(false); };

    const [storeOpen, setStoreOpen] = React.useState(false);
    const handleStoreClickOpen = () => { setStoreOpen(true); };
    const handleStoreClose = () => { setStoreOpen(false); };

    return (
        <div className={"page"}>
            <CreateItemDialog open={itemOpen} handleClose={handleItemClose} corporate={props.corporate}
                              setCorporate={props.setCorporate}/>
            <CreateStoreDialog open={storeOpen} handleClose={handleStoreClose} corporate={props.corporate}
                               setCorporate={props.setCorporate}/>
            <h1>Manage Stores and Items</h1>
            <div className={"buttonMenu"}>
                <Button variant="contained">Generate Report</Button>
                <Button variant="contained" onClick={handleItemClickOpen}>Create Item</Button>
                <Button variant="contained" onClick={handleStoreClickOpen}>Create Store</Button>
            </div>
            <br/>
            <Table className="storeTable" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Store ID</TableCell>
                        <TableCell align="left">Location</TableCell>
                        <TableCell align="left">Manager</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.corporate.stores.map((store: Store, i: number) => (
                        <TableRow
                            key={store.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell align="left">{store.id}</TableCell>
                            <TableCell align="left">{store.gps.latitude + ", " + store.gps.longitude}</TableCell>
                            <TableCell align="left">{store.manager.userID}</TableCell>
                            <TableCell align="center">
                                <Button color="secondary" variant="contained" onClick={() => props.setCorporate(deleteStoreController(props.corporate, i))}>Delete</Button>
                                <Button style={{marginLeft: 20}} color="secondary" variant="contained">Generate Report</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ManageCorporate;
