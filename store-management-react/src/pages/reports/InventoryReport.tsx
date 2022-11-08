import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import {APINamespace, sendRequest} from "../../Utilities";
import ItemInStoreTable from "../../components/tables/ItemInStoreTable";
import {ItemLocation} from "../../types/ItemLocation";
import {Item} from "../../types/Item";
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
                    setTotalValue(r.totalValue);
                }
            }
        );
    }, []);

    return (
        <div className={"page"}>
            <h1>Inventory Report</h1>
            <p className={"subtitle"}>Store #{storeId}</p>
            <br/>
            <ItemInStoreTable stockWithLocation={inventoryReport.map(r => r.inventorys.map((i: { quantity: any; location: ItemLocation; }) => {
                return {
                    stock: new Stock(r.item, i.quantity),
                    location: new ItemLocation(i.location.aisle, i.location.shelf)
                };
            })).flat(1)}/>
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