import React, {
    useState,
    useEffect,
    useContext,
    useReducer,
    useRef,
} from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

import { AuthContext } from "@src-contexts/Authenticate";
import { ArticleContext } from "@src-contexts/ArticleProvider";
import { AppContext } from "@src-contexts/AppProvider";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

function FeedbackItem({
    feedback,
    editFeedback,
    replyToFeedback,
    editFeedbackHandler,
    replyToFeedbackHandler,
    setReportContent,
    setOpenReportContentForm,
    setOpenSnackbar,
}) {
    const { deleteFeedback } = useContext(ArticleContext);
    const { stringToColor } = useContext(AppContext);
    const { isAuthenticated } = useContext(AuthContext);

    // Feedback menu states and handlers
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Feedback menu item handlers.
    const handleDelete = (feedbackID) => {
        deleteFeedback(feedbackID);

        setOpenSnackbar({
            isOpen: true,
            message: "Feedback is successfully archived.",
        });
        handleCloseMenu();
    };
    const handleEdit = () => {
        feedback.is_writer && editFeedbackHandler(feedback);
        handleCloseMenu();
    };

    const handleReport = (feedbackID) => {
        console.log(feedbackID);
        setReportContent({
            component: "feedback",
            basis: null,
            id: feedbackID,
        });
        handleCloseMenu();
        setOpenReportContentForm(true);
    };

    const handleReply = (feedbackParent) => {
        replyToFeedbackHandler(feedbackParent);
        handleCloseMenu();
    };

    const sentimentIcons = [
        null,
        <SentimentVeryDissatisfiedIcon />,
        <SentimentDissatisfiedIcon />,
        <SentimentNeutralIcon />,
        <SentimentSatisfiedIcon />,
        <SentimentSatisfiedAltIcon />,
    ];

    dayjs.extend(advancedFormat);

    return (
        <Box
            sx={
                // if comment is being edited
                editFeedback?.id === feedback.id
                    ? {
                          margin: "1rem",
                          background: "white",
                          boxShadow: "0 0 10px gray",
                          padding: "0.4rem",
                          borderRadius: "7px",
                      }
                    : // If the comment is being replied to or is a parent of edited feedback.
                    replyToFeedback?.id === feedback.id
                    ? {
                          margin: "0.5rem",
                          background: "white",
                          boxShadow: "0 0 10px gray inset",
                          padding: "0.4rem",
                          borderRadius: "7px",
                      }
                    : {}
            }
        >
            <Stack direction="row">
                <Box sx={{ padding: "1rem" }}>
                    <Avatar
                        src={feedback.member.avatar}
                        alt={feedback.member.username[0]}
                        sx={{
                            bgcolor: stringToColor(feedback.member.username),
                            textTransform: "Capitalize",
                        }}
                    />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <Box
                            component="span"
                            sx={{ textTransform: "capitalize" }}
                        >
                            {feedback.member.username}
                        </Box>
                        {" | "}
                        {dayjs(feedback.date_update).format("Do MMMM YYYY")}
                    </Typography>
                    <Typography component="div" variant="body2">
                        {feedback.comment}
                    </Typography>

                    {feedback.satisfaction ? (
                        <Typography>
                            {sentimentIcons[feedback.satisfaction]}
                        </Typography>
                    ) : null}
                </Box>

                {isAuthenticated() && // user is authenticated
                    editFeedback?.id !== feedback.id && // Feedback is being edited
                    replyToFeedback?.id !== feedback.id && ( // Feedback is being replied to
                        <Box>
                            <IconButton
                                aria-label="more"
                                id={`${feedback.id}-comment-menu`}
                                aria-controls={
                                    open ? "comment-menu" : undefined
                                }
                                aria-expanded={open ? "true" : undefined}
                                aria-haspopup="true"
                                onClick={handleClickMenu}
                            >
                                <MoreVertSharpIcon />
                            </IconButton>

                            <Menu
                                id="comment-menu"
                                MenuListProps={{
                                    "aria-labelledby": `${feedback.id}-comment-menu`,
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                            >
                                {feedback.is_writer ? (
                                    <MenuList>
                                        <MenuItem onClick={handleEdit}>
                                            <ListItemIcon>
                                                <ModeEditOutlineOutlinedIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Edit</ListItemText>
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() =>
                                                handleDelete(feedback.id)
                                            }
                                        >
                                            <ListItemIcon>
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Delete</ListItemText>
                                        </MenuItem>
                                    </MenuList>
                                ) : (
                                    <MenuList>
                                        <MenuItem
                                            onClick={() => {
                                                handleReport(feedback.id);
                                            }}
                                        >
                                            <ListItemIcon>
                                                <OutlinedFlagIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Report</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleReply({
                                                    id: feedback.id,
                                                    username:
                                                        feedback.member
                                                            .username,
                                                });
                                            }}
                                        >
                                            <ListItemIcon>
                                                <ReplyOutlinedIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Reply</ListItemText>
                                        </MenuItem>
                                    </MenuList>
                                )}
                            </Menu>
                        </Box>
                    )}
            </Stack>

            {editFeedback?.id !== feedback.id &&
                replyToFeedback?.id !== feedback.id && (
                    <Divider sx={{ margin: 1 }} />
                )}
        </Box>
    );
}

export default FeedbackItem;
