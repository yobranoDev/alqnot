import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "@src-contexts/Authenticate";
import useAxios from "@src-utils/useAxios";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";

function Update() {
    const { updateUser, user } = useContext(AuthContext);

    const emailRef = useRef();
    const usernameRef = useRef();
    
    const [updateData, setUpdateData] = useState({
        email: user?.profile.member.user.email,
        username: user?.profile.member.user.username,
    });

    const [emailEntry, setEmailEntry] = useState(
        () => user?.profile.member.user.email
    );
    const [usernameEntry, setUsernameEntry] = useState(
        () => user?.profile.member.user.username
    );
    const api = useAxios();

    const handleChange = (prop) => (event) => {
        setUpdateData({ ...updateData, [prop]: event.target.value });
    };

    const handleIconClick = (prop) => (event) => {
        switch (prop) {
            case "email":
                emailRef.current?.querySelector("input").focus();
                return;
            case "username":
                usernameRef.current?.querySelector("input").focus();
                return;

            default:
                null;
        }
    };

    const handleIconMouseDown = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUser(api, {
            username: updateData.username,
            email: updateData.email,
        });
    };

    return (
        <div>
            <Stack justifyContent="center" alignItems="center">
                <Paper elevation={3} sx={{ padding: 1, width: "30vw" }}>
                    <Stack
                        direction="column"
                        component="form"
                        onSubmit={handleSubmit}
                        spacing={2}
                        sx={{ padding: 2 }}
                    >
                        <Typography variant="h4">Update...</Typography>

                        {/* Email Entry */}
                        <FormControl>
                            <InputLabel htmlFor="filled-adornment-email">
                                Email
                            </InputLabel>
                            <FilledInput
                                type="email"
                                id="filled-adornment-email"
                                value={updateData.email}
                                onChange={handleChange("email")}
                                required={true}
                                ref={emailRef}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="email icon"
                                            onMouseDown={handleIconMouseDown}
                                            onClick={handleIconClick("email")}
                                            edge="end"
                                        >
                                            <EmailIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            ></FilledInput>
                        </FormControl>

                        {/* Username Entry */}
                        <FormControl sx={{ mb: 2 }} variant="filled">
                            <InputLabel htmlFor="filled-adornment-username">
                                User Name
                            </InputLabel>
                            <FilledInput
                                id="filled-adornment-username"
                                type={"text"}
                                value={updateData.username}
                                onChange={handleChange("username")}
                                required={true}
                                ref={usernameRef}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="username icon"
                                            onMouseDown={handleIconMouseDown}
                                            onClick={handleIconClick(
                                                "username"
                                            )}
                                            edge="end"
                                        >
                                            <AccountCircleIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {/* Submittion Buttons */}
                        <Stack direction="row">
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems:"center" }}>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: "text.secondary",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    Reset Password?
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                sx={{ ml: 1 }}
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={emailEntry}
                    onChange={(event) => setEmailEntry(event.target.value)}
                />
                <br />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={usernameEntry}
                    onChange={(event) => setUsernameEntry(event.target.value)}
                />
                <br />
                <input type="file" name="avatar" accept="image/*" />
                <br />
                <input type="submit" value="submit" />
            </form>
        </div>
    );
}

export default Update;
