import React, {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../types/Corporate";
import {Item} from "../types/Item";
import {ItemLocation} from "../types/ItemLocation";
import {ItemSearch} from "../components/ItemSearch";
import SearchResultTable from "../components/tables/SearchResultTable";

function IndividualStore(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key");
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [searchResult, setSearchResult] = useState<{ storeId: number, item: Item, quantity: number, location: ItemLocation }[]>([]);
    const [searchType, setSearchType] = useState("Name");

    return (
        <div className={"page"}>
            <h1>Store #{storeId}</h1>
            <p className={"subtitle"}>
                {"Located at " + props.corporate.stores.find(s => s.id === storeId)?.gps.toString()}
            </p>
            <ItemSearch setSearchResult={setSearchResult} includeLocation={true} searchType={searchType} setSearchType={setSearchType}/>
            <br/>
            {searchResult.length > 0 ?
                <SearchResultTable stockWithLocation={searchResult} hasStore={false} searchType={searchType}/>
                :
                <p style={{marginTop: "30px"}} className="subtitle">Search by item SKU, Name, or Description</p>
            }
        </div>
    );
}

export default IndividualStore;