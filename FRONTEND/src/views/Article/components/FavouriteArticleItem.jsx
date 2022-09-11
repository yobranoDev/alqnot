import React, { useState, useContext } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useNavigate } from "react-router-dom";

import { ArticleContext } from "@src-contexts/ArticleProvider";
import { AuthContext } from "@src-contexts/Authenticate";
import { AppContext } from "@src-contexts/AppProvider";
import { MemberContext } from "@src-contexts/MemberProvider";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function FavouriteArticleItem({ article }) {

    const navigate = useNavigate();
    const sharingMediums = [
        {
            platform: "Facebook",
            icon: <FacebookIcon />,
            link: "Hello Facebook",
        },
        {
            platform: "Twitter",
            icon: <TwitterIcon />,
            link: "hello twitter",
        },
        {
            platform: "Email",
            icon: <EmailIcon />,
            link: "hello email",
        },
        {
            platform: "Github",
            icon: <GitHubIcon />,
            link: "hello github",
        },
        {
            platform: "Link",
            icon: <LinkIcon />,
            link: "hello Link",
        },
    ];

    const { fullLink } = useContext(ArticleContext);
    const { stringToColor } = useContext(AppContext);
	const { member, removeFavourite } =
	useContext(MemberContext);

    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickExpand = () => {
        setExpanded(!expanded);
    };
    dayjs.extend(advancedFormat);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    article.author.avatar ? (
                        <Avatar
                            sx={{
                                "&:hover": {
                                    border: "1px solid teal",
                                    boxShadow: "0 0 5px #60a3a3",
                                    cursor: "pointer",
                                },
                            }}
                            src={fullLink(article.author.avatar)}
                            alt="author-name"
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
                                bgcolor: stringToColor(article.author.username),
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
                    )
                }
                title={
                    <Typography
                        onClick={() =>
                            navigate(`/articles/author/${article.author.id}`)
                        }
                        sx={{
                            textTransform: "capitalize",
                            cursor: "pointer",
                            "&:hover": {
                                color: "teal",
                                textDecoration: "underline solid #004f4f 1px ",
                                textShadow: "2px 2px 5px #a6c3c3",
                            },
                        }}
                    >
                        {article.author.username}
                    </Typography>
                }
                action={
                    <Box>
                        <IconButton
                            aria-label="settings"
                            id={`favourite-article-menu-button-${article.id}`}
                            aria-controls={open ? "comment-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClickMenu}
                        >
                            <MoreVertIcon />
                        </IconButton>

                        <Menu
                            id={`favourite-article-menu-${article.id}`}
                            MenuListProps={{
                                "aria-labelledby": `favourite-article-menu-button-${article.id}`,
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                        >
                            <MenuList>
                                <MenuItem
                                    onClick={() => console.log("Removed")}
                                >
                                    <ListItemIcon>
                                        <StarIcon sx={{ color: "gold" }} />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Remove Favourite
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => console.log("Removed")}
                                >
                                    <ListItemIcon>
                                        <StarIcon sx={{ color: "gold" }} />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Send Summary
                                    </ListItemText>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                }
                subheader={dayjs(article.date_updated).format("Do MMMM YYYY")}
            />
            <CardActionArea>
                <CardMedia
                    onClick={() => navigate(`/articles/${article.slug}`)}
                    component="img"
                    height="194"
                    image={
                        article.thumbnail
                            ? fullLink(article.thumbnail)
                            : "http://127.0.0.1:8000/media/uploads/2022/07/26/socks.jpg"
                    }
                    alt="article-thumbnail"
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            border: "1px solid teal",
                            boxShadow: "0 0 15px #60a3a3",
                            cursor: "pointer",
                        },
                    }}
                />
            </CardActionArea>

            <CardActions disableSpacing>
                <Typography
                    variant="body"
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
                <ExpandMore
                    expand={expanded}
                    onClick={handleClickExpand}
                    aria-expanded={expanded}
                    aria-label="Sharing Medium"
                >
                    <ShareIcon />
                </ExpandMore>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ padding: "0.1rem  0.75rem" }}>
                    <Typography>Share via:</Typography>
                    <List>
                        {sharingMediums.map((medium) => (
                            <ListItem key={medium.platform} disablePadding>
                                <ListItemButton
                                    onClick={() => console.log(medium.link)}
                                >
                                    <ListItemIcon>{medium.icon}</ListItemIcon>
                                    <ListItemText primary={medium.platform} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export const LoadingFavouriteArticleItem = () => (
    <Card sx={{ maxWidth: 345 }}>
        <CardHeader
            avatar={
                <Skeleton variant="circular">
                    <Avatar />
                </Skeleton>
            }
            title={<Skeleton width="60%" />}
            subheader={<Skeleton width="40%" />}
        />

        <CardMedia>
            <Skeleton variant="rectangular" height={194} />
        </CardMedia>

        <CardContent>
            <Skeleton variant="h6" width="75%" />
            <Skeleton
                variant="body2"
                sx={{ margin: "1rem 0 1rem 0" }}
            ></Skeleton>
        </CardContent>
    </Card>
);
