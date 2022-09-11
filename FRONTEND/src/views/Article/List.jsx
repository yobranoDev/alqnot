import React, { useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Masonry from "react-masonry-css";
import { ArticleContext } from "@src-contexts/ArticleProvider";
import LandingArticleItem, { LoadingLandingArticleItem } from "./components/LandingArticleItem";
import "@src-styles/Masonry.css";
import _ from "lodash";

import Typography from "@mui/material/Typography";

function List() {
    const { articlesList, getArticlesList } = useContext(ArticleContext);

    const location = useLocation();

    const breakpointColumnsObj = {
        default: 4,
        1800: 4,
        1500: 3,
        950: 2,
        500: 1,
    };

    useEffect(() => {
        getArticlesList(location.state?.filterParams);
    }, [location]);

    return (
        <div>
            <Typography
                component="div"
                variant="h4"
                sx={{ marginBottom: "2rem" }}
            >
                {articlesList ? "Articles List:" : "Loading..."}

                {location.state?.filterLabels &&
                    location.state?.filterLabels.map((filterParam, idx) => (
                        <Typography
                            key={idx}
                            variant="subtitle2"
                            color="text.primary"
                            sx={{ textTransform: "capitalize" }}
                        >
                            {filterParam.label}{": "}
                            {filterParam.values.map((value, valIdx) => (
                                <Typography
                                    key={valIdx}
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {value}
                                    {valIdx !== filterParam.values.length - 1? ", ":null}
                                </Typography>
                            ))}
                        </Typography>
                    ))}
            </Typography>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {articlesList
                    ? articlesList.results.map((article) => (
                        // For Styling purposes keep the div
                          <div key={article.id}>
                              <LandingArticleItem article={article} />
                          </div>
                      ))
                    : _.range(5).map((item) => (
                          <LoadingLandingArticleItem key={item} />
                      ))}
            </Masonry>
            <Outlet />
        </div>
    );
}

export default List;
