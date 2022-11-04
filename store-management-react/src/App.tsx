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

function App() {
    const item = new Item("123", "name", "desc", 8, 10);
    item.assignLocations([new ItemLocation(0,1)]);
    const [corporate, setCorporate] = useState(new Corporate([item],
        [
            new Store(0, [], new AuthorizedUser("", "Larry Brown", ""), [], new GPS(-42.26259, -71.80229)),
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;