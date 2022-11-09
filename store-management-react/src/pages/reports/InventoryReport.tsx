import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import {APINamespace, sendRequest} from "../../Utilities";
import ItemInStoreTable from "../../components/tables/ItemInStoreTable";
import {ItemLocation} from "../../types/ItemLocation";
import {Stock} from "../../types/Stock";
import ItemInOverstockTable from "../../components/tables/ItemInOverstockTable";

function InventoryReport(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key")
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [inventoryReport, setInventoryReport] = React.useState<any>(null);
    const [totalValue, setTotalValue] = React.useState(0);

    useEffect(() => {
        sendRequest(APINamespace.Manager, "/generateInventoryReport", {"storeId": storeId}).then(
            r => {
                if (r.status === 200) {
                    setInventoryReport(r);
                    setTotalValue(Math.round(r.totalValue * 100) / 100);
                }
            }
        );
    }, []);

    return (
        <div className={"page"}>
            <h1>Inventory Report</h1>
            <p className={"subtitle"}>Store #{storeId}</p>
            <h3>On Shelves</h3>
            <ItemInStoreTable stockWithLocation={(inventoryReport?.stocks ?? []).map((s: any) => {
                return {
                    location: new ItemLocation(s.location.aisle, s.location.shelf),
                    stock: new Stock(s.item, s.quantity)
                };
            })}/>
            <br/>
            <h3>Overstock</h3>
            <ItemInOverstockTable overstock={(inventoryReport?.overstocks ?? []).map((s: any) => {
                return {
                    stock: new Stock(s.item, s.quantity)
                };
            })}/>
            <br/>
            <div style={{margin: "auto", display: "flex", justifyContent: "center"}}>
                <p className={"totalValueLabel"}>Total Value:</p>
                <p className={"totalValue"}>${totalValue}</p>
            </div>
            <br/>
        </div>
    );
}

export default InventoryReport;