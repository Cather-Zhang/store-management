import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import {APINamespace, sendRequest} from "../../Utilities";
import ItemInStoreTable from "../../components/tables/ItemInStoreTable";
import {ItemLocation} from "../../types/ItemLocation";
import {Stock} from "../../types/Stock";
import ItemInOverstockTable from "../../components/tables/ItemInOverstockTable";
import TotalTable from "../../components/tables/TotalTable";

function TotalReport(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key");
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [inventoryReport, setInventoryReport] = React.useState<any>(null);
    const [totalValue, setTotalValue] = React.useState(0);

    useEffect(() => {
        sendRequest(APINamespace.Manager, "/generateInventoryReport", null);
    });

    return (
        <div className={"page"}>
            <h1>Total Inventory Report</h1>
            <TotalTable stockWithLocation={(inventoryReport?.stocks ?? []).map((s: any) => {
                return {
                    location: new ItemLocation(s.location.aisle, s.location.shelf),
                    stock: new Stock(s.item, s.quantity)
                };
            })}  corporate={props.corporate} setCorporate={null} storeId={storeId} searchType={""}/>
            <br/>
            <div style={{margin: "auto", display: "flex", justifyContent: "center"}}>
                <p className={"totalValueLabel"}>Total Value:</p>
                <p className={"totalValue"}>${totalValue}</p>
            </div>
        </div>
    );
}

export default TotalReport;