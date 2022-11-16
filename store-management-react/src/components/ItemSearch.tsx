import React, {useState} from "react";
import {Button, FormControl, getButtonBaseUtilityClass, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {getById} from "../Utilities";

export function ItemSearch(props: {setSearchResult: any, includeLocation: boolean}) {
    const [searchType, setSearchType] = useState("Name");

    return (
        <div className="searchInputs">
            <FormControl size="small" style={{minWidth: 200, paddingRight: "5px"}}>
                <InputLabel id="searchTypeLabel">Search By</InputLabel>
                <Select
                    labelId="searchTypeLabel"
                    id="searchType"
                    label="Search By"
                    defaultValue={searchType}
                    onChange={(v) => setSearchType(v.target.value as string)}
                >
                    {["Name", "SKU", "Description"].concat(props.includeLocation ? ["Location"] : []).map(n => (<MenuItem value={n}>{n}</MenuItem>))}
                </Select>
            </FormControl>
            {searchType === "Location" ?
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
                    label={searchType}
                    type="text"
                    variant="standard"
                    size="small"
                    className="searchInput"
                    style={{marginRight: "20px"}}
                />
            }
            <Button variant="contained" onClick={() => {
                // make call to backend here and get search result once that's a thing
                console.log(searchType)
                console.log(getById("searchValue"))
                props.setSearchResult([]);
            }}>Search</Button>
        </div>
    );
}