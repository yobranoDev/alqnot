import React, { useState, useContext, useEffect } from "react";
import dompurify from "dompurify";
import parse from "html-react-parser";
import axios from "axios";
import _ from "lodash";
import { AuthContext } from "@src-contexts/Authenticate";
import useAxios from "@src-utils/useAxios";
import { useNavigate } from "react-router-dom";

export const ArticleContext = React.createContext();

function ArticleProvider({ children }) {
    const [article, setArticle] = useState(null);
    const [articlesList, setArticlesList] = useState(null);
    const [author, setAuthor] = useState(null);
    const { isAuthenticated, baseURL, user } = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();

    // Set author when article loads
    useEffect(() => {
        if (article === null) {
            return;
        } else {
            setAuthor(article.author);
        }
    }, [article]);

    // Clean external html from dangerous js
    const fullLink = (link) => {
        let temp =
            link&& link.startsWith(baseURL) ? link : baseURL + link;
        return temp;
    };

    const cleanHTML = (dirtyHTML) =>
        parse(dompurify.sanitize(dirtyHTML), {
            FORCE_BODY: true,
        });

    //  ---------------------- AUTHOR ----------------------

    const getAuthor = (authorID) => {
        axios
            .get(`${baseURL}/accounts/api/authors/full-detail/${authorID}/`)
            .then((res) => {
                setAuthor(res.data);
            })
            .catch((err) => {
                console.log("Error at Get Author: ", err);
            });
    };

    //  ---------------------- FEEDBACKS ----------------------

    // Clean feedback html
    const cleanFeedback = (feedback) => {
        let temp = { ...feedback };
        temp.member.avatar = fullLink(temp.member.avatar);

        temp.comment = parse(
            dompurify.sanitize(feedback.comment, {
                FORCE_BODY: true,
            })
        );
        return temp;
    };

    const createFeedback = (formData) => {
        if (isAuthenticated()) {
            formData = {
                ...formData,
                comment: formData.comment.trim(),
                article: article.id,
                member: user.profile.member.id,
            };
            api.post(`${baseURL}/articles/api/feedbacks/list/`, formData)
                .then((res) => {
                    api.get(
                        `${baseURL}/articles/api/full-feedbacks/list/?article=${article.id}`
                    )
                        .then((res) => {
                            let temp = res.data.map((feedback) =>
                                cleanFeedback(feedback)
                            );
                            setArticle({
                                ...article,
                                feedbacks: [...temp],
                            });
                        })
                        .catch((err) => {
                            console.log(
                                "Error at Create feedback -> fetch feedbacks",
                                err
                            );
                        });
                })
                .catch((err) => console.log("Error at create feedback: ", err));
        } else {
            navigate("/profile/login", {
                state: {
                    next: `/articles/${article.slug}`,
                    data: { formData: formData }, //, article: article },
                },
            });
        }
    };

    const getFeedbacks = () => {
        api.get(
            `${baseURL}/articles/api/full-feedbacks/list/?article=${article.id}`
        )
            .then((res) => {
                let temp = res.data.map((feedback) => cleanFeedback(feedback));
                setArticle({
                    ...article,
                    feedbacks: [...temp],
                });
            })
            .catch((err) => {
                console.log("Error at Get feedback", err);
            });
    };

    const updateFeedback = (feedbackID, formData) => {
        formData = {
            ...formData,
            id: feedbackID,
            comment: formData.comment.trim(),
            article: article.id,
            member: user.profile.member.id,
        };
        api.put(
            `${baseURL}/articles/api/feedbacks/detail/${feedbackID}/`,
            formData
        )
            .then((res) => {
                getFeedbacks();
            })
            .catch((err) => {
                console.log("Error at Update Feedback: ", err);
            });
    };

    const deleteFeedback = (feedbackID) => {
        if (isAuthenticated()) {
            api.delete(`${baseURL}/articles/api/feedbacks/detail/${feedbackID}`)
                .then((res) => {
                    getFeedbacks();
                })
                .catch((err) =>
                    console.log("Error at delete feedbacks: ", err)
                );
        } else {
            navigate("/profile/login", {
                state: {
                    next: `/articles/${article.slug}`,
                },
            });
        }
    };

    //  ---------------------- FLAGING ----------------------
    const createFlag = (formData) => {
        formData =
            formData.component === "article"
                ? {
                      ...formData,
                      article: article.id,
                  }
                : {
                      ...formData,
                      feedback: formData.id,
                  };

        formData.id && delete formData.id;

        api.post(
            `${baseURL}/articles/api/feedbacks/flag/${formData.component}/`,
            formData
        )
            .then((res) => {
                null
            })
            .catch((err) => console.log("Error at Create Flag: ", err));
    };

    //  ---------------------- ARTICLES ----------------------

    const getArticle = (articleSlug) => {
        api.get(`${baseURL}/articles/api/full-articles/detail/${articleSlug}/`)
            .then((res) => {
                // Clean the summary html
                res.data.summary = parse(
                    dompurify.sanitize(res.data.summary, {
                        FORCE_BODY: true,
                    })
                );

                // Clean the article html
                res.data.content = parse(
                    dompurify.sanitize(res.data.content, {
                        FORCE_BODY: true,
                    })
                );

                // Clean the feedbacks html
                let feedbacks = res.data.feedbacks.map((feedback) =>
                    cleanFeedback(feedback)
                );
                res.data.feedbacks = feedbacks;

                // Insert the base url in images.
                res.data.avatar = fullLink(res.data.avatar)
                res.data.thumbnail = fullLink(res.data.thumbnail)

                setArticle(res.data);
            })
            // .catch((err) => {
            //     console.log("Error at Article Detail", err);
            // });
    };

    const getArticlesList = (filterParams) => {
        api.get(`${baseURL}/articles/api/articles/recommend/`, {
            params: { ...filterParams },
        })
            .then((res) => {
                setArticlesList(res.data);
            })
            .catch((err) => {
                console.log("Error at getArticleList: ", err);
            });
    };

    const context = {
        // Data
        author,
        article,
        articlesList,

        // Functions
        cleanHTML,
        fullLink,
        createFeedback,
        updateFeedback,
        deleteFeedback,
        createFlag,
        getArticle,
        getAuthor,
        getArticlesList,
    };

    return (
        <ArticleContext.Provider value={context}>
            {children}
        </ArticleContext.Provider>
    );
}

export default ArticleProvider;
