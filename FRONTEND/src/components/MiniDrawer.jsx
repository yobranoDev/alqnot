import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";

import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function MiniDrawer({ children }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    {open ? (
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </DrawerHeader>

                <Divider />
                <List>
                    {SidebarData.map((sidebarItem, index) => (
                        <ListItem
                            key={sidebarItem.title}
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={() => navigate(sidebarItem.path)}
                        >
                            <Tooltip
                                title={sidebarItem.title}
                                placement={"left"}
                                disableHoverListener={open}
                                arrow
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open
                                            ? "initial"
                                            : "center",
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {sidebarItem.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={sidebarItem.title}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3}}>
                {children}
            </Box>
        </Box>
    );
}