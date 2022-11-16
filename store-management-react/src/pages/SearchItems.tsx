import React, {useState} from "react";
import {ItemSearch} from "../components/ItemSearch";
import {ItemLocation} from "../types/ItemLocation";
import {Item} from "../types/Item";

function SearchItems() {
    const [searchResult, setSearchResult] = useState<{ item: Item, quantity: number, location: ItemLocation }[]>([]);

    return (
        <div className={"page"}>
            <h1>Search Stores for Item</h1>
            <ItemSearch setSearchResult={setSearchResult} includeLocation={false}/>
            {searchResult.length > 0 ?
                <></>
                :
                <p style={{marginTop: "30px"}} className="subtitle">Search by item SKU, Name, Description, or Aisle and
                    Shelf</p>
            }
        </div>
    );
}

export default SearchItems;
