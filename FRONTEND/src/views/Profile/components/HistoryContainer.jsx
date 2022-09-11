import React, { useContext, useState, useRef } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ClearIcon from "@mui/icons-material/Clear";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import _ from "lodash";

import { MemberContext } from "@src-contexts/MemberProvider";
import HistoryArticleItem from "@src-views/Article/components/HistoryArticleItem";

function HistoryContainer() {
    // Minimum number of history items for multiple select to be active
    const minHistoryLength = 1;

    const { member, deleteHistory, addFavourite, removeFavourite } =
        useContext(MemberContext);

    // List of selected articles
    const [selectedArticles, setSelectedArticles] = useState([]);

    // Controller of selection mode and listing mode.
    const [selectMode, setSelectMode] = useState(false);

    // Action to be perfomed after selection.
    const [action, setAction] = React.useState("");

    const clearSelection = () => {
        setSelectMode(false);
        setSelectedArticles([]);
    };

    // Add or remove article from selection
    const handleSelectArticle = (articleID, remove) => {
        if (!selectMode) return;
        let temp = [...selectedArticles];

        if (remove && temp.indexOf(articleID) !== -1) {
            temp.splice(temp.indexOf(articleID), 1);
        } else {
            temp.push(articleID);
        }
        console.log(temp);
        setSelectedArticles([...temp]);
    };
    const handleSelectAll = () => {
        let ids = member.history_articles?.map((article) => article.id);
        setSelectedArticles([...ids]);
    };

    const handleBatchAction = () => {
        switch (action) {
            case "AddFavourite":
                return handleBatchAddFavourite();
            case "RemoveFavourite":
                return handleBatchRemoveFavourite();
            case "Delete":
                return handleBatchDelete();
            default:
                return null;
        }
    };
    // Delete selected articles.
    const handleBatchDelete = () => {
        if (selectedArticles.length === 0) return;
        deleteHistory(selectedArticles);
        clearSelection();
    };

    // Add selected articles to favourite.
    const handleBatchAddFavourite = () => {
        console.log(selectedArticles);
        if (selectedArticles.length === 0) return;
        addFavourite(selectedArticles);
        clearSelection();
    };
    // Add selected articles to favourite.
    const handleBatchRemoveFavourite = () => {
        console.log(selectedArticles);
        if (selectedArticles.length === 0) return;
        removeFavourite(selectedArticles);
        clearSelection();
    };

    const handleActionChange = (event) => {
        setAction(event.target.value);
    };

    return (
        <Box
            sx={{
                maxHeight: 550,
                maxWidth: 850,
                overflow: "auto",
                margin: "auto",
                borderRadius: "5px",
                bgcolor: "#f5f5f5",
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    bgcolor: selectMode ? "#98c8c8" : "#bde3e3",
                    borderBottom: selectMode
                        ? "5px solid #b4db77"
                        : "5px solid teal",
                }}
            >
                {/* Enter select mode iff the history items meet the threshold */}
                {member.history_articles?.length >= minHistoryLength && (
                    <>
                        {selectMode ? (
                            // Select Mode menu
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ width: "100%" }}
                            >
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <FormControl
                                        variant="filled"
                                        sx={{ minWidth: 250, mr: 2 }}
                                    >
                                        <InputLabel id="action-label">
                                            Action
                                        </InputLabel>
                                        <Select
                                            labelId="action-label"
                                            id="demo-simple-select-filled"
                                            value={action}
                                            onChange={handleActionChange}
                                            sx={{ p: 0 }}
                                        >
                                            <MenuItem value={"AddFavourite"}>
                                                Add Favourite
                                            </MenuItem>
                                            <MenuItem value={"RemoveFavourite"}>
                                                Remove Favourite
                                            </MenuItem>
                                            <MenuItem value={"Delete"}>
                                                Delete
                                            </MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Button
                                        onClick={handleBatchAction}
                                        variant={"contained"}
                                    >
                                        Go
                                    </Button>
                                </Box>

                                <Box>
                                    {selectedArticles.length !==
                                        member.history_articles?.length && (
                                        <Tooltip
                                            placement="top"
                                            title="Select All"
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleSelectAll()
                                                }
                                                sx={{
                                                    bgcolor: "teal",
                                                    color: "greenyellow",
                                                    "&:hover": {
                                                        bgcolor: "#439797",
                                                        // color: "lime",
                                                    },
                                                }}
                                            >
                                                <DoneAllIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip
                                        placement="top"
                                        title="Exit Multiple Select"
                                        sx={{
                                            ml: 2,
                                            "&:hover": {
                                                bgcolor: "#439797",
                                            },
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => clearSelection()}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>
                        ) : (
                            // Hostory Container Title
                            <>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{ color: "teal" }}
                                >
                                    Recent Articles...
                                </Typography>
                                <Button
                                    sx={{ ml: "auto" }}
                                    variant="outlined"
                                    onClick={() => setSelectMode(true)}
                                >
                                    Multiple Select
                                </Button>
                            </>
                        )}
                    </>
                )}
            </Stack>
            {/* Body */}
            <Box sx={{ p: 2, boxShadow: "#bbb 0px 0px 30px inset" }}>
                {member.history_articles?.map((article) => (
                    <HistoryArticleItem
                        article={article}
                        key={article.id}
                        deleteHistory={deleteHistory}
                        handleSelectArticle={handleSelectArticle}
                        selectMode={selectMode}
                        addFavourite={addFavourite}
                        removeFavourite={removeFavourite}
                        selected={selectedArticles.includes(article.id)}
                        favourite={
                            _.findIndex(member.favourite_articles, {
                                id: article.id,
                            }) !== -1
                        }
                    />
                ))}
            </Box>
        </Box>
    );
}

export default HistoryContainer;
