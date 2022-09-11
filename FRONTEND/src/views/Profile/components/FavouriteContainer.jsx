import React, { useContext } from "react";

import { MemberContext } from "@src-contexts/MemberProvider";
import { LoadingLandingArticleItem } from "@src-views/Article/components/LandingArticleItem";
import FavouriteArticleItem from "@src-views/Article/components/FavouriteArticleItem";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import _ from "lodash";
import Masonry from "react-masonry-css";

import "@src-styles/Masonry.css";

function FavouriteContainer() {
    const breakpointColumnsObj = {
        default: 4,
        1800: 4,
        1500: 3,
        950: 2,
        500: 1,
    };
    const { member } = useContext(MemberContext);

    return (
        <>
            <Typography variant="h4" sx={{paddingBlock: 2}}>
                Favourite Articles...
            </Typography>
            <Container>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {member.favourite_articles
                        ? member.favourite_articles.map((article) => (
                              <div key={article.id}>
                                  <FavouriteArticleItem article={article} />
                              </div>
                          ))
                        : _.range(5).map((item) => (
                              <LoadingLandingArticleItem key={item} />
                          ))}
                </Masonry>
            </Container>
        </>
    );
}

export default FavouriteContainer;
