import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const SidebarData = [
    {
        title: "Home",
        icon: <HomeIcon />,
        path: "/",
    },
    {
        title: "Articles",
        icon: <ArticleIcon />,
        path: "/articles",
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        path: "/profile",
    },
    {
        title: "About",
        icon: <InfoIcon />,
        path: "/about",
    },
];
