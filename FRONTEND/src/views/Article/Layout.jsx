import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import ArticleProvider from "@src-contexts/ArticleProvider";

function Layout() {
    const location = useLocation();

    return (
            <ArticleProvider>
                <Outlet />
            </ArticleProvider>
    );
}

export default Layout;
