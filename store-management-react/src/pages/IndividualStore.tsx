import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../types/Corporate";
import {Item} from "../types/Item";
import {ItemLocation} from "../types/ItemLocation";
import {ItemSearch} from "../components/ItemSearch";
import SearchResultTable from "../components/tables/SearchResultTable";
import ItemInStoreTable from "../components/tables/ItemInStoreTable";
import {Stock} from "../types/Stock";
import {APINamespace, sendRequest} from "../Utilities";

function IndividualStore(props: { corporate: Corporate, setCorporate: any }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key");
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [searchResult, setSearchResult] = useState<{ storeId: number, item: Item, quantity: number, location: ItemLocation }[]>([]);
    const [searchType, setSearchType] = useState("Name");
    const [allItems, setAllItems] = React.useState<{ stocks: Stock[], location: ItemLocation }[]>([]);

    useEffect(() => {
        sendRequest(APINamespace.Customer, "/listStoreItems", {"storeId": storeId}).then(
            r => {
                if (r.status === 200) {
                    setAllItems(r.stocks);
                }
            }
        );
    }, []);

    return (
        <div className={"page"}>
            <h1>Store #{storeId}</h1>
            <p className={"subtitle"}>
                {"Located at " + props.corporate.stores.find(s => s.id === storeId)?.gps.toString()}
            </p>
            <ItemSearch storeId={storeId} setSearchResult={setSearchResult} individualStore={true} searchType={searchType}
                        setSearchType={setSearchType}/>
            <br/>
            {searchResult.length > 0 ?
                <SearchResultTable setSearchResult={setSearchResult} corporate={props.corporate} setCorporate={props.setCorporate}
                                   stockWithLocation={searchResult} hasStore={false} searchType={searchType} setAllItems={setAllItems}/>
                :
                <p style={{marginTop: "30px"}} className="subtitle">Search by item SKU, Name, or Description</p>
            }
            <h3>All Items</h3>
            <ItemInStoreTable setSearchResult={setSearchResult} stockWithLocation={(allItems ?? []).map((s: any) => {
                let location = new ItemLocation(s.location.aisle, s.location.shelf);
                return {
                    location: location,
                    stock: new Stock(new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location), s.quantity)
                };
            })} corporate={props.corporate} setCorporate={props.setCorporate} storeId={storeId} searchType={searchType} setAllItems={setAllItems}/>
            <br/>
        </div>
    );
}

export default IndividualStore;