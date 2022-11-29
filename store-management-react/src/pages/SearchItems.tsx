import React, {useState} from "react";
import {ItemSearch} from "../components/ItemSearch";
import {ItemLocation} from "../types/ItemLocation";
import {Item} from "../types/Item";
import SearchResultTable from "../components/tables/SearchResultTable";
import {Corporate} from "../types/Corporate";
import {GPS} from "../types/GPS";

function SearchItems(props: {corporate: Corporate, setCorporate: any, gps: GPS}) {
    const [searchResult, setSearchResult] = useState<{ storeId: number, item: Item, quantity: number, location: ItemLocation }[]>([]);
    const [searchType, setSearchType] = useState("Name");

    return (
        <div className={"page"}>
            <h1>Search Stores for Item</h1>
            <ItemSearch storeId={null} setSearchResult={setSearchResult} individualStore={false} searchType={searchType} setSearchType={setSearchType} gps={props.gps}/>
            {searchResult.length > 0 ?
                <SearchResultTable corporate={props.corporate} setCorporate={props.setCorporate} stockWithLocation={searchResult}
                                   hasStore={true} searchType={searchType} setSearchResult={setSearchResult} setAllItems={null} gps={props.gps}/>
                :
                <p style={{marginTop: "30px"}} className="subtitle">Search by item SKU, Name, or Description</p>
            }
        </div>
    );
}

export default SearchItems;
