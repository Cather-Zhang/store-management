import Home from "./pages/Home";
import ManageStore from "./pages/ManageStore";
import SearchItems from "./pages/SearchItems";
import StoresNearMe from "./pages/StoresNearMe";
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import ManageCorporate from "./pages/ManageCorporate";

export const PageRouter = ({children}: {children: React.ReactNode}) => {
    return (
        <Router>
            <div>
                {children}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/manageStore" element={<ManageStore/>}/>
                    <Route path="/manageCorporate" element={<ManageCorporate/>}/>
                    <Route path="/search" element={<SearchItems/>}/>
                    <Route path="/stores" element={<StoresNearMe/>}/>
                </Routes>
            </div>
        </Router>
    );
}