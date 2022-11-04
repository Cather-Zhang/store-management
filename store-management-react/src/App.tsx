import Home from "./pages/Home";
import ManageStore from "./pages/ManageStore";
import SearchItems from "./pages/SearchItems";
import StoresNearMe from "./pages/StoresNearMe";
import React, {useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ManageCorporate from "./pages/ManageCorporate";
import {Corporate} from "./types/Corporate";
import {Item} from "./types/Item";
import {Store} from "./types/Store";
import {AuthorizedUser} from "./types/AuthorizedUser";
import {GPS} from "./types/GPS";
import MenuBar from "./MenuBar";
import './App.css';
import {ItemLocation} from "./types/ItemLocation";
import InventoryReport from "./pages/reports/InventoryReport";
import {Aisle} from "./types/Aisle";
import {Shelf} from "./types/Shelf";
import {Stock} from "./types/Stock";

function App() {
    const item = new Item("123", "name", "desc", 8, 10);
    item.assignLocations([new ItemLocation(0,1)]);
    const [corporate, setCorporate] = useState(new Corporate([item],
        [
            new Store(0, [new Aisle(1, [new Shelf(5, [new Stock(item, 3)])]), new Aisle(2, [new Shelf(1, [new Stock(item, 9)]), new Shelf(7, [new Stock(item, 10)])])], new AuthorizedUser("", "Larry Brown", ""), [], new GPS(-42.26259, -71.80229)),
            new Store(1, [], new AuthorizedUser("", "Sarah Resley", ""), [], new GPS(42.361145, -71.057083))
        ]));

    return (
        <Router>
            <div className={"pageLayout"}>
                <MenuBar currentUser={"corporate"}/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/manageStore" element={<ManageStore/>}/>
                    <Route path="/manageCorporate"
                           element={<ManageCorporate corporate={corporate} setCorporate={setCorporate}/>}/>
                    <Route path="/search" element={<SearchItems/>}/>
                    <Route path="/stores" element={<StoresNearMe/>}/>
                    <Route path="/inventoryReport" element={<InventoryReport corporate={corporate}/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;