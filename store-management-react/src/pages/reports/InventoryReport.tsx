import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import {APINamespace, sendRequest} from "../../Utilities";
import ItemInStoreTable from "../../components/tables/ItemInStoreTable";
import {ItemLocation} from "../../types/ItemLocation";
import {Stock} from "../../types/Stock";

function InventoryReport(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key")
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [inventoryReport, setInventoryReport] = React.useState<any[]>([]);
    const [totalValue, setTotalValue] = React.useState(0);

    useEffect(() => {
        sendRequest(APINamespace.Manager, "/generateInventoryReport", {"storeId": storeId}).then(
            r => {
                if (r.status === 200) {
                    setInventoryReport(r.stocks);
                    setTotalValue(Math.round(r.totalValue * 100) / 100);
                    console.log(r);
                }
            }
        );
    }, []);

    return (
        <div className={"page"}>
            <h1>Inventory Report</h1>
            <p className={"subtitle"}>Store #{storeId}</p>
            <br/>
            <ItemInStoreTable stockWithLocation={inventoryReport.map(s => {
                return {
                    location: new ItemLocation(s.location.aisle, s.location.shelf),
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