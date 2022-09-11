import React, { useState, useEffect, useContext } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";

import FeedbackForm from "./components/FeedbackForm";
import FeedbackItem from "./components/FeedbackItem";
import ReportingForm from "./components/ReportingForm";
import { ArticleContext } from "@src-contexts/ArticleProvider";
import { AppContext } from "@src-contexts/AppProvider";
import { MemberContext } from "@src-contexts/MemberProvider";
import { AuthContext } from "@src-contexts/Authenticate";
import { Emoji } from "@src-contexts/AppProvider";

import { useParams, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import _ from "lodash";

// TODO: include favourite icon
// TODO:: Back to top button like xlWings
function Detail() {
    const location = useLocation();

    const navigate = useNavigate();

    // For fetching the article through api
    const { articleSlug } = useParams();

    // Contains the comment being edited.
    const [editFeedback, setEditFeedback] = useState(null);

    // Initialized the flaged(reported) indecent comment/article
    const [reportContent, setReportContent] = useState({
        component: "",
        basis: null,
    });

    // Contols the visibility of feedback form(a backdrop component)
    const [openReportContentForm, setOpenReportContentForm] = useState(false);

    // Contains the comment the user is replying to.
    const [replyToFeedback, setReplyToFeedback] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState({
        isOpen: false,
        message: "",
    });

    // Get article object from the api.
    const { getArticle, article } = useContext(ArticleContext);
    const { fullLink } = useContext(AppContext);
    const { addFavourite, removeFavourite } = useContext(MemberContext);
    const { isAuthenticated } = useContext(AuthContext);

    // Advanced date formating
    dayjs.extend(advancedFormat);

    // Rename Web page.
    useEffect(() => {
        if (article) {
            document.title = "Alqnot | " + article.title;
        }
        return () => {
            document.title = "Alqnot";
        };
    }, [article]);

    // autofills the feedback from after login.
    useEffect(() => {
        if (location.state && "formData" in location.state) {
            setEditFeedback(location.state.formData);
        }
    }, []);

    // gets article after landing on page
    useEffect(() => {
        getArticle(articleSlug);
    }, [articleSlug]);

    // Get and set comment parent.
    useEffect(() => {
        if (!editFeedback?.parent) return;
        // feedback under edit shold be a comment reply.
        article.feedbacks.map((feedback) => {
            if (editFeedback.parent === feedback.id) {
                setReplyToFeedback({
                    id: feedback.id,
                    username: feedback.member.username,
                });
            }
        });
    }, [editFeedback]);

    const replyToFeedbackHandler = (feedbackItem) => {
        setReplyToFeedback(feedbackItem);
    };
    const clearReplyToFeedback = () => {
        setReplyToFeedback(null);
    };
    const editFeedbackHandler = (feedback) => {
        setEditFeedback({ ...feedback, isEdit: true });
    };
    const clearEditFeedback = () => {
        setEditFeedback(null);
    };

    const handleClearReportContent = () => {
        setReportContent({ component: "", basis: null });
        setOpenReportContentForm(false);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway" && openSnackbar.persist) {
            return;
        }
        setOpenSnackbar({ isOpen: false, message: "" });
    };

    return (
        <Box>
            <CssBaseline />
            {article?.slug === articleSlug ? (
                <Box
                    sx={{
                        width: "100%",
                        height: "150px",
                        position: "absolute",
                        "z-index": -1,
                        top: "0px",
                        left: "0px",
                    }}
                >
                    <Box
                        component="img"
                        src={fullLink(article.thumbnail)}
                        alt={article.title + " thumbnail"}
                        sx={{
                            width: "100%",
                            height: "100%",
                            filter: "blur(1px) brightness(50%)",
                            "-webkit-mask-image":
                                "linear-gradient(to top, transparent 1%, black 100%)",
                        }}
                    />
                </Box>
            ) : null}
            
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ flexGrow: 1, p: 3, maxWidth: "850px" }}>
                    {article?.slug === articleSlug ? (
                        <>
                            <Typography
                                variant="h3"
                                align="center"
                                gutterBottom
                                sx={{ mt: "1rem" }}
                            >
                                {article.title}
                            </Typography>
                            {isAuthenticated() && (
                                <Typography
                                    align="justify"
                                    component="div"
                                    gutterBottom
                                >
                                    {article.summary}
                                </Typography>
                            )}

                            <Box sx={{ display: "flex", mb: 3 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        textTransform: "capitalize",
                                        textDecoration: "underline",
                                    }}
                                >
                                    written by: {article.author.user.username}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    align="right"
                                    color="text.secondary"
                                    sx={{
                                        flexGrow: 1,
                                        textDecoration: "underline",
                                    }}
                                >
                                    {"Updated on "}
                                    {dayjs(article.date_updated).format(
                                        "Do MMMM YYYY"
                                    )}
                                    {" | "}
                                    {article.reading_duration} min read
                                </Typography>
                            </Box>

                            <Container>{article.content}</Container>
                            {article.tags?.length !== 0 && (
                                <Container>
                                    <Divider>TAGS</Divider>
                                    <Box
                                        sx={{
                                            margin: 2,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {article.tags.map((tag) => (
                                            <Chip
                                                key={tag.id}
                                                label={tag.label}
                                                variant="outlined"
                                                onClick={() =>
                                                    navigate("/articles", {
                                                        state: {
                                                            filterLabels: [
                                                                {
                                                                    label: "tag",
                                                                    values: [
                                                                        tag.label,
                                                                    ],
                                                                },
                                                            ],
                                                            filterParams: {
                                                                tags: tag.id,
                                                            },
                                                        },
                                                    })
                                                }
                                                sx={{
                                                    mr: 1,
                                                    textTransform: "capitalize",
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Container>
                            )}
                            <Paper elevation={3} sx={{ mt: 5 }}>
                                <Container sx={{ pt: 2 }}>
                                    <FeedbackForm
                                        InitialFeedbackData={editFeedback}
                                        clearEditFeedback={clearEditFeedback}
                                        replyToFeedback={replyToFeedback}
                                        addFavourite={() =>
                                            addFavourite([article.id])
                                        }
                                        removeFavourite={() =>
                                            removeFavourite([article.id])
                                        }
                                        clearReplyToFeedback={
                                            clearReplyToFeedback
                                        }
                                        setReportContent={setReportContent}
                                        setOpenReportContentForm={
                                            setOpenReportContentForm
                                        }
                                        favourite={article.is_favourite}
                                        setOpenSnackbar={setOpenSnackbar}
                                    />
                                </Container>

                                {article.feedbacks.length ? (
                                    <>
                                        <Typography
                                            variant="h4"
                                            sx={{ mb: 1, ml: 2 }}
                                        >
                                            Remarks...
                                        </Typography>

                                        <Box
                                            sx={{
                                                maxHeight: 550,
                                                overflow: "auto",
                                                pt: 3,
                                                borderRadius: "5px",
                                                bgcolor: "#f5f5f5",
                                                boxShadow:
                                                    "#e5e5e5 0px 0px 30px inset",
                                            }}
                                        >
                                            {article.feedbacks.length ? (
                                                <>
                                                    {article.feedbacks.map(
                                                        (feedback, idx) => (
                                                            <FeedbackItem
                                                                openReportContentForm={
                                                                    openReportContentForm
                                                                }
                                                                setOpenReportContentForm={
                                                                    setOpenReportContentForm
                                                                }
                                                                reportContent={
                                                                    reportContent
                                                                }
                                                                setReportContent={
                                                                    setReportContent
                                                                }
                                                                key={idx}
                                                                feedback={
                                                                    feedback
                                                                }
                                                                editFeedbackHandler={
                                                                    editFeedbackHandler
                                                                }
                                                                editFeedback={
                                                                    editFeedback
                                                                }
                                                                replyToFeedback={
                                                                    replyToFeedback
                                                                }
                                                                replyToFeedbackHandler={
                                                                    replyToFeedbackHandler
                                                                }
                                                                setOpenSnackbar={
                                                                    setOpenSnackbar
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </>
                                            ) : null}
                                        </Box>
                                    </>
                                ) : (
                                    <Typography sx={{ padding: 2 }}>
                                        Be the first to drop me a comment
                                        <Emoji symbol="0x1F609" />
                                        ...
                                    </Typography>
                                )}
                            </Paper>
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100vh",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </Box>
            <ReportingForm
                openReportContentForm={openReportContentForm}
                reportContent={reportContent}
                setReportContent={setReportContent}
                reportingBasis={article?.reporting_basis}
                handleClearReportContent={handleClearReportContent}
                setOpenReportContentForm={setOpenReportContentForm}
                setOpenSnackbar={setOpenSnackbar}
            />

            <Snackbar
                open={openSnackbar.isOpen}
                autoHideDuration={10000}
                onClose={handleCloseSnackBar}
                message={openSnackbar.message}
            />
        </Box>
    );
}

export default Detail;
