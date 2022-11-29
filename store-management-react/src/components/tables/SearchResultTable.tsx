import * as React from 'react';
import {ItemLocation} from "../../types/ItemLocation";
import BaseTable from "./BaseTable";
import {Item} from "../../types/Item";
import {Button, Link} from "@mui/material";
import ItemInfoDialog from "../dialogs/ItemInfoDialog";
import {Corporate} from "../../types/Corporate";
import BuyItemDialog from "../dialogs/BuyItemDialog";
import {APINamespace, getById, sendRequest} from "../../Utilities";
import {GPS} from "../../types/GPS";

export default function SearchResultTable(props: { hasStore: boolean, searchType: string, setSearchResult: any, stockWithLocation:
    { storeId: number, item: Item, quantity: number, location: ItemLocation }[], corporate: Corporate, setCorporate: any,
    setAllItems: any, gps: GPS}) {
    let headers = props.hasStore ? ["Store ID"] : [];
    if (props.searchType === "Location") {
        headers = headers.concat(["Name", "Aisle", "Shelf", "Price ($)", "Quantity", ""]);
    } else if (props.searchType === "Name") {
        headers = headers.concat([props.searchType, "Price ($)", "Quantity", ""]);
    } else {
        headers = headers.concat(["Name", props.searchType, "Price ($)", "Quantity", ""]);
    }

    function getValues(swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }, searchValue: string) {
        let item = swl.item;
        let values: any[] = props.hasStore ? [swl.storeId] : [];
        let buyButton = <Button variant="contained" style={{width: 100}} onClick={handleBuyItemClickOpen(swl)}>Buy</Button>
        let linkedName = <Link color="primary" underline="hover" onClick={handleItemInfoClickOpen(swl)}>{item.name}</Link>
        if (props.searchType === "Location") {
            values = values.concat([linkedName, swl.location.aisle, swl.location.shelf, item.price, swl.quantity, buyButton]);
        } else if (props.searchType === "Name") {
            values = values.concat([linkedName, item.price, swl.quantity, buyButton]);
        } else {
            values = values.concat([linkedName, searchValue, item.price, swl.quantity, buyButton]);
        }
        return values;
    }

    const [itemInfoOpen, setItemInfoOpen] = React.useState(false);

    const handleItemInfoClickOpen = (swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }) => {
        return function () {
            setModalItem(swl);
            setItemInfoOpen(true);
        };
    };
    const handleItemInfoClose = () => {
        setItemInfoOpen(false);
    };

    const [buyItemOpen, setBuyItemOpen] = React.useState(false);
    const [modalItem, setModalItem] = React.useState<{ storeId: number, item: Item, quantity: number, location: ItemLocation } | null>(null);

    const handleBuyItemClickOpen = (swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }) => {
        return function () {
            setModalItem(swl);
            setBuyItemOpen(true);
        };
    };
    const handleBuyItemClose = () => {
        setBuyItemOpen(false);
    };

    const onBuyClose = (individualStore: boolean, storeId: number) => {
        if (!individualStore) {
            sendRequest(APINamespace.Customer, "/findStoreItem", {
                latitude: 0,
                longitude: 0,
                storeId: storeId,
                type: props.searchType.toLowerCase(),
                value: getById("searchValue")
            }).then(
                r => {
                    if (r.status === 200) {
                        props.setSearchResult(r.stocks.map((s: any) => {
                            let location = new ItemLocation(s.location.aisle, s.location.shelf);
                            return {
                                storeId: s.idStores,
                                item: new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location),
                                location: location,
                                quantity: s.quantity
                            };
                        }));
                    }
                }
            );
        } else {
            sendRequest(APINamespace.Customer, "/findItem", {
                latitude: 0,
                longitude: 0,
                type: props.searchType.toLowerCase(),
                value: getById("searchValue")
            }).then(
                r => {
                    if (r.status === 200) {
                        props.setSearchResult(r.stocks.map((input: any) => {
                            let s = input[0];
                            let location = new ItemLocation(s.location.aisle, s.location.shelf);
                            return {
                                storeId: s.idStores,
                                item: new Item(s.item.sku, s.item.name, s.item.description, s.item.price, s.item.max, location),
                                location: location,
                                quantity: s.quantity
                            };
                        }));
                    }
                }
            );
        }
    }

    return <>
        <ItemInfoDialog item={modalItem?.item ?? null} open={itemInfoOpen} handleClose={handleItemInfoClose}
                        corporate={props.corporate}
                        setCorporate={props.setCorporate} allowBuy={true}  handleBuyItemClickOpen={handleBuyItemClickOpen} quantity={modalItem?.quantity ?? 0}/>
        <BuyItemDialog setSearchResult={props.setSearchResult} item={modalItem?.item ?? null} open={buyItemOpen} handleClose={handleBuyItemClose}
                        corporate={props.corporate} storeId={modalItem?.storeId ?? null} availableQuantity={modalItem?.quantity ?? null}
                        setCorporate={props.setCorporate} location={modalItem?.location ?? null} individualStore={props.hasStore}
                       searchType={props.searchType} setAllItems={props.setAllItems} gps={props.gps}/>
        <BaseTable className={"itemInStoreTable"}
                   headers={headers}
                   data={props.stockWithLocation.map((swl: { storeId: number, item: Item, quantity: number, location: ItemLocation }, i) => {
                       let item = swl.item;
                       let searchValue = null;
                       if (props.searchType === "Name") {
                           searchValue = item.name;
                       } else if (props.searchType === "SKU") {
                           searchValue = item.sku;
                       } else if (props.searchType === "Description") {
                           searchValue = item.description;
                       }

                       return {
                           id: i,
                           columns: getValues(swl, searchValue ?? "")
                       };
                   })} noRowsMessage={"No search results"}/>
    </>
}