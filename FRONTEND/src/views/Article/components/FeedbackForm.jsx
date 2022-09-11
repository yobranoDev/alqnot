import React, {
    useState,
    useEffect,
    useContext,
    useReducer,
    useRef,
} from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import StarIcon from "@mui/icons-material/Star";

import { ArticleContext } from "@src-contexts/ArticleProvider";
import { Emoji } from "@src-contexts/AppProvider";

const defaultFormData = {
    parent: null,
    satisfaction: 0,
    comment: "",
};

function feedbackReducer(state, action) {
    switch (action.type) {
        case "satisfactionChange":
            return {
                ...state,
                satisfaction:
                    state.satisfaction === action.value ? 0 : action.value, // Deselect on second click
            };

        case "commentChange":
            return { ...state, comment: action.value };

        case "parentChange":
            return {
                ...state,
                parent: action.value,
            };

        case "populate":
            return {
                parent: action.value.parent,
                satisfaction: action.value.satisfaction,
                comment: action.value.comment,
            };

        case "reset":
            return defaultFormData;

        default:
            return { ...state };
    }
}

function FeedbackForm({
    InitialFeedbackData,
    clearEditFeedback,
    replyToFeedback,
    clearReplyToFeedback,
    setReportContent,
    setOpenReportContentForm,
    setOpenSnackbar,
    addFavourite,
    removeFavourite,
    favourite,
}) {
    setOpenReportContentForm;
    const formRef = useRef(null);
    const [feedbackData, feedbackDispatch] = useReducer(
        feedbackReducer,
        defaultFormData
    );
    const { createFeedback, updateFeedback } = useContext(ArticleContext);

    const [isFavourite, setIsFavourite] = useState(favourite);
    useEffect(() => {
        if (replyToFeedback === null) return;
        feedbackDispatch({
            type: "parentChange",
            value: replyToFeedback.id,
        });
        formRef.current.querySelector('[name="commentEntry"]').focus();
    }, [replyToFeedback]);

    useEffect(() => {
        // Initialize the form with defaultFormData in reducer
        feedbackDispatch({ type: "reset" });
    }, []);

    useEffect(() => {
        // Populate external data to form
        if (!InitialFeedbackData) return;
        feedbackDispatch({ type: "populate", value: InitialFeedbackData });
        formRef.current.querySelector('[name="commentEntry"]').focus();
    }, [InitialFeedbackData]);

    const clearForm = () => {
        feedbackDispatch({ type: "reset" });
        formRef.current.reset();
        clearReplyToFeedback();
        clearEditFeedback();
    };

    const handleClearParent = () => {
        feedbackDispatch({ type: "parentChange", value: null });
        clearReplyToFeedback();
    };

    const handleSubmitComment = (event) => {
        event.preventDefault();
        InitialFeedbackData?.isEdit
            ? updateFeedback(InitialFeedbackData.id, feedbackData)
            : createFeedback(feedbackData);
        clearForm();
    };

    const handleOpenReportingForm = (event) => {
        setReportContent({ component: "article", basis: null });
        setOpenReportContentForm(true);
    };

    const handleClickFavourite = (event) => {
        if (isFavourite) {
            removeFavourite();
            setIsFavourite(!isFavourite);
        } else {
            addFavourite();
            setIsFavourite(!isFavourite);
        }
    };

    const satisfactionScale = [
        {
            title: "Angry",
            value: 1,
            color: "red",
            icon: <Emoji symbol="0x1F621" />,
        },
        {
            title: "Unamused",
            value: 2,
            color: "brown",
            icon: <Emoji symbol="0x1F612" />,
        },
        {
            title: "Neutral",
            value: 3,
            color: "#424242",
            icon: <Emoji symbol="0x1F611" />,
        },
        {
            title: "Happy",
            value: 4,
            color: "orange",
            icon: <Emoji symbol="0x1F60A" />,
        },
        {
            title: "Excited",
            value: 5,
            color: "white",
            icon: <Emoji symbol="0x1F92F" />,
        },
    ];

    return (
        <form onSubmit={handleSubmitComment} ref={formRef}>
            <Typography variant="h4">
                {InitialFeedbackData?.isEdit
                    ? "Edit comment:"
                    : feedbackData.parent
                    ? "Respond to the comment:"
                    : "A word to the author: "}
            </Typography>

            <Box sx={{ padding: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "1rem 1rem 1rem 1rem ",
                        borderRadius: "5px 5px 0  0",
                        backgroundColor: "#aae7e7",
                    }}
                >
                    {satisfactionScale.map((satisfaction) => (
                        <Tooltip
                            key={satisfaction.value}
                            title={satisfaction.title}
                            placement="top"
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        color: satisfaction.color,
                                        bgcolor: "#aae7e7",
                                        fontSize: "0.75rem",
                                    },
                                },
                            }}
                        >
                            <IconButton
                                onClick={() =>
                                    feedbackDispatch({
                                        type: "satisfactionChange",
                                        value: satisfaction.value,
                                    })
                                }
                                sx={{
                                    background:
                                        feedbackData.satisfaction ===
                                        satisfaction.value
                                            ? "white"
                                            : "",
                                    color:
                                        feedbackData.satisfaction ===
                                        satisfaction.value
                                            ? "teal"
                                            : "",
                                    "&:hover": {
                                        color: satisfaction.color,
                                    },
                                }}
                            >
                                {satisfaction.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>
                <Box>
                    <TextField
                        variant="filled"
                        label="Your Response..."
                        name="commentEntry"
                        value={feedbackData.comment}
                        onChange={(event) =>
                            feedbackDispatch({
                                type: "commentChange",
                                value: event.target.value,
                            })
                        }
                        maxRows={7}
                        multiline
                        fullWidth
                        sx={{ mb: "1rem" }}
                    />
                </Box>
                <Stack direction="row" alignItems="center">
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ flexGrow: 1 }}
                    >
                        <Tooltip
                            title={"Report Article"}
                            placement="top-start"
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        color: "text.primary",
                                        bgcolor: "white",
                                        fontSize: "0.75rem",
                                    },
                                },
                            }}
                        >
                            <IconButton onClick={handleOpenReportingForm}>
                                <FlagOutlinedIcon />
                            </IconButton>
                        </Tooltip>

                        {isFavourite ? (
                            <Tooltip
                                title={"Remove Favourite"}
                                placement="top-start"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            color: "text.primary",
                                            bgcolor: "white",
                                            fontSize: "0.75rem",
                                        },
                                    },
                                }}
                            >
                                <IconButton onClick={handleClickFavourite}>
                                    <StarIcon sx={{ color: "gold" }} />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip
                                title={"Add to Favourite"}
                                placement="top-start"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            color: "text.primary",
                                            bgcolor: "white",
                                            fontSize: "0.75rem",
                                        },
                                    },
                                }}
                            >
                                <IconButton onClick={handleClickFavourite}>
                                    <StarIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {replyToFeedback && (
                            <Chip
                                label={`Reply to: ${replyToFeedback.username}`}
                                sx={{ textTransform: "capitalize" }}
                                onDelete={handleClearParent}
                            />
                        )}
                    </Stack>

                    <Box>
                        <Button onClick={() => clearForm()}>Cancel</Button>

                        <Button
                            type="submit"
                            variant={
                                feedbackData.comment.length ||
                                feedbackData.satisfaction
                                    ? "contained"
                                    : "disabled"
                            }
                        >
                            Comment
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </form>
    );
}

export default FeedbackForm;
