import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Corporate} from "../../types/Corporate";
import {APINamespace, sendRequest} from "../../Utilities";
import {Stock} from "../../types/Stock";
import ItemInOverstockTable from "../../components/tables/ItemInOverstockTable";
import ItemInMissingItemsTable from "../../components/tables/ItemInMissingItemsTable";
import {ItemLocation} from "../../types/ItemLocation";
import {Item} from "../../types/Item";

function MissingItemsReport(props: { corporate: Corporate }) {
    const [searchParams] = useSearchParams();
    searchParams.get("__firebase_request_key");
    let storeId: number = parseInt(searchParams.get("id") ?? "");
    const [missingItemsReport, setMissingItemsReport] = React.useState<any>(null);

    useEffect(() => {
        sendRequest(APINamespace.Manager, "/showMissingItems", {"storeId": storeId}).then(
            r => {
                if (r.status === 200) {
                    setMissingItemsReport(r);
                }
            }
        );
    }, []);

    return (
        <div className={"page"}>
            <h1>Missing Items Report</h1>
            <p className={"subtitle"}>Store #{storeId}</p>
            <ItemInMissingItemsTable missingItems={(missingItemsReport?.missingItems ?? []).map((s: any) => {
                return new Item(s.sku, s.name, s.description, s.price, s.max, new ItemLocation(s.locations[0].aisle, s.locations[0].shelf));
            })}/>
        </div>
    );
}

export default MissingItemsReport;