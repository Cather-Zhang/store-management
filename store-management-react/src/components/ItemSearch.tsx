import React from "react";
import {Button, FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {Item} from "../types/Item";
import {ItemLocation} from "../types/ItemLocation";
import {APINamespace, getById, sendRequest} from "../Utilities";
import {GPS} from "../types/GPS";

export function ItemSearch(props: {storeId: number | null, setHasSearched: any, setSearchResult: any, individualStore: boolean, searchType: string, setSearchType: any, gps: GPS}) {
    return (
        <div className="searchInputs">
            <FormControl size="small" style={{minWidth: 200, paddingRight: "5px"}}>
                <InputLabel id="searchTypeLabel">Search By</InputLabel>
                <Select
                    labelId="searchTypeLabel"
                    id="searchType"
                    label="Search By"
                    defaultValue={props.searchType}
                    onChange={(v) => props.setSearchType(v.target.value as string)}
                >
                    {["Name", "SKU", "Description"].map(n => (<MenuItem value={n}>{n}</MenuItem>))}
                </Select>
            </FormControl>
            {props.searchType === "Location" ?
                <>
                    <TextField
                        id="aisle"
                        label="Aisle"
                        type="number"
                        variant="standard"
                        size="small"
                        className="searchInput"
                        style={{width: "100px"}}
                    />
                    <TextField
                        id="shelf"
                        label="Shelf"
                        type="number"
                        variant="standard"
                        size="small"
                        className="searchInput"
                        style={{marginRight: "20px", width: "100px"}}
                    />
                </>
                :
                <TextField
                    id="searchValue"
                    label={props.searchType}
                    type="text"
                    variant="standard"
                    size="small"
                    className="searchInput"
                    style={{marginRight: "20px"}}
                />
            }
            <Button variant="contained" onClick={() => {
                props.setHasSearched(true);
                if (props.individualStore) {
                    sendRequest(APINamespace.Customer, "/findStoreItem", {
                        latitude: 0,
                        longitude: 0,
                        storeId: props.storeId,
                        type: props.searchType.toLowerCase(),
                        value: getById("searchValue")
                    }).then(
                        r => {
                            if (r.status === 200) {
                                props.setSearchResult(r.stocks.map((s: any) => {
                                    let location = new ItemLocation(s.location.aisle, s.location.shelf);
                                    return {
                                        storeId: s.idStores,
                                        item: new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location),
                                        location: location,
                                        quantity: s.quantity
                                    };
                                }));
                            }
                        }
                    );
                } else {
                    sendRequest(APINamespace.Customer, "/findItem", {
                        latitude: props.gps.latitude,
                        longitude: props.gps.longitude,
                        type: props.searchType.toLowerCase(),
                        value: getById("searchValue")
                    }).then(
                        r => {
                            if (r.status === 200) {
                                props.setSearchResult(r.stocks.map((input: any) => {
                                    let s = input[0];
                                    let location = new ItemLocation(s.location.aisle, s.location.shelf);
                                    return {
                                        storeId: s.idStores,
                                        item: new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location),
                                        location: location,
                                        quantity: s.quantity
                                    };
                                }));
                            }
                        }
                    );
                }
            }}>Search</Button>
        </div>
    );
}