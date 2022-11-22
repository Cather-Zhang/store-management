import React from "react";
import {Button, FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {Item} from "../types/Item";
import {ItemLocation} from "../types/ItemLocation";

export function ItemSearch(props: {setSearchResult: any, includeLocation: boolean, searchType: string, setSearchType: any}) {
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
                    {["Name", "SKU", "Description"].concat(props.includeLocation ? ["Location"] : []).map(n => (<MenuItem value={n}>{n}</MenuItem>))}
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
                // make call to backend here and get search result once that's a thing
                props.setSearchResult([{storeId: 0, item: new Item("LUUHLFLJ", "Soap", "This is soap", 10, 2), quantity: 5, location: new ItemLocation(2, 9)}, {storeId: 1, item: new Item("LIHLKJHFSF", "Bananas", "Monkeys really like eating bananas and these ones are fresh!", 5, 100), quantity: 3, location: new ItemLocation(1, 1)}]);
            }}>Search</Button>
        </div>
    );
}