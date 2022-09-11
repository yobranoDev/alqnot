import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArticleContext } from "@src-contexts/ArticleProvider";
import DescriptionDrawer from "@src-components/DescriptionDrawer";
import PinnedArticleItem, {
    PinnedArticleItemSkeleton,
} from "./components/PinnedArticleItem";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import _ from "lodash";

function Author() {
    const { author, getAuthor, articlesList, getArticlesList } =
        useContext(ArticleContext);
    console.log(articlesList);
    const { authorID } = useParams();

    useEffect(() => {
        if (Number(author?.id) === Number(authorID)) return;
        getAuthor(authorID);
    }, [authorID]);

    useEffect(() => {
        getArticlesList({ author: authorID });
    }, [authorID]);

    console.log(author);
    return (
        <>
            {author ? (
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <Box sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Biography
                        </Typography>
                        <Container>
                            <Typography align="justify">
                                {author.biography}
                            </Typography>
                        </Container>

                        {articlesList ? (
                            <>
                                <Typography variant="h4" gutterBottom>
                                    Pinned works
                                </Typography>

                                <Container>
                                    {articlesList.results.map((article) => (
                                        <PinnedArticleItem
                                            key={article.id}
                                            article={article}
                                        />
                                    ))}
                                </Container>
                            </>
                        ) : (
                            <>
                                <Typography variant="h4" gutterBottom>
                                    Loading Pinned Articles ...
                                </Typography>

                                <Container>
                                    {_.range(5).map((idx) => (
                                        <PinnedArticleItemSkeleton key={idx} />
                                    ))}
                                </Container>
                            </>
                        )}

                        <Typography variant="h4" gutterBottom>
                            Recent uploads
                        </Typography>

                        <Typography variant="h4" gutterBottom>
                            Recommendations
                        </Typography>
                    </Box>
                    <DescriptionDrawer
                        avatarImg={author.avatar}
                        headerBgImg="http://127.0.0.1:8000/media/article-thumbnails/me/Knitting/26371072-teal-gray-and-white-polka-dots-pattern-repeat-b__dHc9yO8.png"
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textTransform: "capitalize",
                                fontSize: "1.5rem",
                                display: "flex",
                                justifyContent: "center",
                                cursor: "pointer",
                                marginBottom: "1rem",
                                "&:hover": {
                                    color: "teal",
                                    textDecoration:
                                        "underline solid #004f4f 2px ",
                                    textShadow: "0 0  5px #a6c3c3",
                                },
                            }}
                        >
                            {author.user.username}
                        </Typography>
                    </DescriptionDrawer>
                </Box>
            ) : (
                "Loading..."
            )}
        </>
    );
}

export default Author;
