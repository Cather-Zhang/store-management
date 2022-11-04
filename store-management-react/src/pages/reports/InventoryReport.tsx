import React from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import ItemInStoreTable from "../../components/tables/ItemInStoreTable";

function InventoryReport(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key")
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    let totalValue = props.corporate.stores[storeId].aisles.map(a => a.shelves.map(sh =>
        sh.stocks.map(s => {
            return s.quantity * s.item.price;
        })
    )).flat(2).reduce((sum, a) => sum + a, 0);

    return (
        <div className={"page"}>
            <h1>Inventory Report</h1>
            <p className={"subtitle"}>Store #{storeId}</p>
            <br/>
            <ItemInStoreTable store={props.corporate.stores[storeId]}/>
            <br/>
            <div style={{margin: "auto", display: "flex", justifyContent: "center"}}>
                <p className={"totalValueLabel"}>Total Value:</p>
                <p className={"totalValue"}>${totalValue}</p>
            </div>
        </div>
    );
}

export default InventoryReport;