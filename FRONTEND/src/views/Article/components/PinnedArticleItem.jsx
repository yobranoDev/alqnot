import React, { useContext } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import CardActionArea from "@mui/material/CardActionArea";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { ArticleContext } from "@src-contexts/ArticleProvider";
import { useNavigate } from "react-router-dom";


export default function PinnedArticleItem({ article }) {
    dayjs.extend(advancedFormat);

    const { fullLink, cleanHTML } = useContext(ArticleContext);
    
    const navigate = useNavigate();

    return (
        <Card sx={{ display: "flex", marginBottom: "1.5rem", maxWidth: 850 }}>
            <CardActionArea
                sx={{
                    width: 150,
                    // height: "225px",
                    "&:hover": {
                        border: "1px solid teal",
                        boxShadow: "0 0 15px #60a3a3",
                        cursor: "pointer",
                    },
                }}
            >
                <CardMedia
                    component="img"
                    onClick={() => navigate(`/articles/${article.slug}`)}
                    sx={{
                        width: 150,
                        height: "100%",
                        textTransform: "capitalize"
                    }}
                    image={fullLink(article.thumbnail)}
                    alt={article.title + " Thumbnail"}
                />
            </CardActionArea>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                        variant="h6"
                        onClick={() => navigate(`/articles/${article.slug}`)}
                        sx={{
                            cursor: "pointer",
                            "&:hover": {
                                color: "teal",
                                textDecoration: "underline solid #004f4f 2px ",
                                textShadow: "2px 2px 5px #a6c3c3",
                            },
                        }}
                    >
                        {article.title}
                    </Typography>
                    <Typography
                        sx={{ textDecoration: "underline" }}
                        variant="subtitle2"
                        color="text.secondary"
                        component="div"
                        gutterBottom
                    >
                        {dayjs(article.date_updated).format("Do MMMM YYYY")}
                    </Typography>

                    <Typography
                        variant="body1"
                        align="justify"
                        color="text.secondary"
                    >
                        {cleanHTML(article.description)}
                    </Typography>
                </CardContent>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "right",
                        pr: 2,
                        pb: 1,
                        color: "teal",
                    }}
                >
                    <Button
                        onClick={() => navigate(`/articles/${article.slug}`)}
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                    >
                        View
                    </Button>
                </Box>
            </Box>
        </Card>
    );
}

export function PinnedArticleItemSkeleton() {
    return (
        <Card sx={{ display: "flex", marginBottom: "1.5rem" }}>
            <CardMedia component="div">
                <Skeleton width={150} height={225} variant="rectangular" />
            </CardMedia>

            <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography variant="h4">
                        <Skeleton width="65%" sx={{ mb: 0.1 }} />
                    </Typography>

                    <Typography variant="subtitle2">
                        <Skeleton width="30%" sx={{ mb: 2.5 }} />
                    </Typography>

                    <Skeleton width="100%" sx={{ mb: 0.5 }} />
                    <Skeleton width="100%" sx={{ mb: 0.5 }} />
                    <Skeleton width="75%" sx={{ mb: 0.5 }} />
                </CardContent>
            </Box>
        </Card>
    );
}
