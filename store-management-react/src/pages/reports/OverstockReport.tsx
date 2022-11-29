import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import {APINamespace, sendRequest} from "../../Utilities";
import {Stock} from "../../types/Stock";
import ItemInOverstockTable from "../../components/tables/ItemInOverstockTable";

function OverstockReport(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key");
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [overstockReport, setOverstockReport] = React.useState<any>(null);
    const [totalValue, setTotalValue] = React.useState(0);

    useEffect(() => {
        sendRequest(APINamespace.Manager, "/generateOverstockReport", {"storeId": storeId}).then(
            r => {
                if (r.status === 200) {
                    setOverstockReport(r);
                    setTotalValue(Math.round(r.totalValue * 100) / 100);
                }
            }
        );
    }, []);

    return (
        <div className={"page"}>
            <h1>Overstock Report</h1>
            <p className={"subtitle"}>Store #{storeId}</p>
            <ItemInOverstockTable overstock={(overstockReport?.overstocks ?? []).map((s: any) => {
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

export default OverstockReport;