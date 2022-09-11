import React, { useState, useContext } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";

import { useNavigate } from "react-router-dom";
import { AppContext } from "@src-contexts/AppProvider";

function HistoryArticleItem({
    article,
    deleteHistory,
    handleSelectArticle,
    addFavourite,
    removeFavourite,
    selectMode,
    selected,
    favourite,
}) {
    console.log("---> ", favourite);
    const [isFavourite, setIsFavourite] = useState(favourite);

    const navigate = useNavigate();
    const { stringToColor, fullLink } = useContext(AppContext);

    const handleFavoriteClick = (event) => {
        if (isFavourite) {
            removeFavourite([article.id]);
            setIsFavourite(false);
        } else {
            addFavourite([article.id]);
            setIsFavourite(true);
        }
    };

    const handleChange = (event) => {
        handleSelectArticle(article.id, selected);
    };
    return (
        <Paper
            elevation={selected ? 3 : 0}
            sx={{
                bgcolor: selected?"white": "inherit",
                p: 1.3,
                m: selected?"1rem 0":0
            }}
        >
            <Stack direction="row" spacing={1}>
                <Box>
                    <Tooltip
                        title={article.author.username}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    textTransform: "capitalize",
                                },
                            },
                        }}
                    >
                        {article.author.avatar ? (
                            <Avatar
                                sx={{
                                    bgcolor: stringToColor(
                                        article.author.username
                                    ),
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        border: "1px solid teal",
                                        boxShadow: "0 0 5px #60a3a3",
                                        cursor: "pointer",
                                    },
                                }}
                                src={fullLink(article.author.avatar)}
                                alt={article.author.username}
                                onClick={() =>
                                    navigate(
                                        `/articles/author/${article.author.id}`
                                    )
                                }
                            />
                        ) : (
                            <Avatar
                                onClick={() =>
                                    navigate(
                                        `/articles/author/${article.author.id}`
                                    )
                                }
                                sx={{
                                    bgcolor: stringToColor(
                                        article.author.username
                                    ),
                                    "&:hover": {
                                        border: "1px solid teal",
                                        boxShadow: "0 0 5px #60a3a3",
                                        cursor: "pointer",
                                    },
                                }}
                                aria-label="author-name"
                            >
                                {article.author.username[0].toUpperCase()}
                            </Avatar>
                        )}
                    </Tooltip>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 1,
                        flexGrow: 1,
                    }}
                >
                    <Typography
                        variant="body"
                        onClick={() => navigate(`/articles/${article.slug}`)}
                        sx={{
                            cursor: "pointer",
                            textTransform: "capitalize",
                            "&:hover": {
                                color: "teal",
                                textDecoration: "underline solid #004f4f 2px ",
                                textShadow: "2px 2px 5px #a6c3c3",
                            },
                        }}
                    >
                        {article.title}
                    </Typography>
                </Box>
                {selectMode ? (
                    <>
                        <Checkbox
                            checked={selected}
                            onChange={handleChange}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                    </>
                ) : (
                    <>
                        <Box sx={{ pr: 1, pl: 1 }}>
                            {favourite ? (
                                <Tooltip
                                    title="Remove Favorite"
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: "gold",
                                                color: "text.primary",
                                                textTransform: "capitalize",
                                            },
                                        },
                                    }}
                                >
                                    <IconButton onClick={handleFavoriteClick}>
                                        {console.log("1. ", isFavourite)}
                                        <StarIcon sx={{ color: "gold" }} />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Set Favorite">
                                    <IconButton onClick={handleFavoriteClick}>
                                        {console.log("2. ", isFavourite)}
                                        <StarIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                        />
                        <Box>
                            <Tooltip
                                title="Remove Article"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: "red",
                                            color: "text.primary",
                                            textTransform: "capitalize",
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    onClick={() => deleteHistory([article.id])}
                                    sx={{ color: "red" }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </>
                )}
            </Stack>
        </Paper>
    );
}

export default HistoryArticleItem;
