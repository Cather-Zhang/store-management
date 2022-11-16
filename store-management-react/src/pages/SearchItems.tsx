import React, {useState} from "react";
import {Button, FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

function SearchItems() {
    const [searchType, setSearchType] = useState("Name");

    return (
        <div className={"page"}>
            <h1>Search Stores for Item</h1>
            <div className="searchInputs">
                <FormControl size="small" style={{minWidth: 200, paddingRight: "5px"}}>
                    <InputLabel id="selectedItemLabel">Search By</InputLabel>
                    <Select
                        labelId="selectedItemLabel"
                        id="selectedItem"
                        label="Search By"
                        value="Name"
                        onChange={(v) => setSearchType(v.target.value as string)}
                    >
                        {["Name", "SKU", "Description", "Location"].map(n => (<MenuItem value={n}>{n}</MenuItem>))}
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
                <Button variant="contained">Search</Button>
            </div>
        </div>
    );
}

export default SearchItems;
