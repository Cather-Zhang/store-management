import ManageStore from "./pages/ManageStore";
import SearchItems from "./pages/SearchItems";
import StoresNearMe from "./pages/StoresNearMe";
import React, {useEffect, useState} from "react";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import ManageCorporate from "./pages/ManageCorporate";
import {Corporate} from "./types/Corporate";
import MenuBar from "./MenuBar";
import './App.css';
import InventoryReport from "./pages/reports/InventoryReport";
import {APINamespace, sendRequest} from "./Utilities";
import {updateStateController} from "./Controllers";

function App() {
    const [corporate, setCorporate] = useState(new Corporate([], []));
    const [currentUser, setCurrentUser] = useState<any>(JSON.parse(window.localStorage.getItem('currentUser') ?? "{}"));
    const [username, setUsername] = React.useState(window.localStorage.getItem('username') != null ? JSON.parse(window.localStorage.getItem('username') ?? "{}") : "");

    useEffect(() => {
        const loadCorporateState = async () => {
            let storeResponse = await sendRequest(APINamespace.Corporate, "/listStores", null);
            let itemResponse = await sendRequest(APINamespace.Corporate, "/listItems", null);
            let other = await sendRequest(APINamespace.Manager, "/listAssignedItems", null);
            console.log("Hello", other)

            setCorporate(updateStateController(corporate, storeResponse, itemResponse));
        }
        loadCorporateState().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let homePage;
    if (currentUser.role === "corporate") {
        homePage = <ManageCorporate corporate={corporate} setCorporate={setCorporate}/>
    } else if (currentUser.role === "manager") {
        homePage = <ManageStore corporate={corporate} setCorporate={setCorporate}/>
    } else {
        homePage = <StoresNearMe/>
    }

    return (
        <Router>
            <div className={"pageLayout"}>
                <MenuBar currentUser={currentUser.role} setCurrentUser={setCurrentUser} username={username}
                         setUsername={setUsername}/>
                <Routes>
                    <Route path="/" element={homePage}/>
                    <Route path="/manageStore"
                           element={<ManageStore corporate={corporate} setCorporate={setCorporate}/>}/>
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