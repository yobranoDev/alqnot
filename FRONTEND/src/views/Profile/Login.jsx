import React, { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@src-contexts/Authenticate";

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

function Login() {
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        showPassword: null,
    });

    const usernameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const { loginUser, isAuthenticated } = useContext(AuthContext);

    useEffect(()=>{
        isAuthenticated()&&navigate("/profile")
    }, [])
    const handleSubmit = (event) => {
        event.preventDefault();
        location.state
            ? // Redirect user to private route
              loginUser(
                  {
                      username: loginData.username,
                      password: loginData.password,
                  },
                  location.state
              )
            : // Redirect user to landing page
              loginUser({
                  username: loginData.username,
                  password: loginData.password,
              });
    };

    const handleChange = (prop) => (event) => {
        setLoginData({ ...loginData, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setLoginData({
            ...loginData,
            showPassword: !loginData.showPassword,
        });
    };

    const handleIconClick = (prop) => (event) => {
        prop === "username" &&
            usernameRef.current?.querySelector("input").focus();
        event.preventDefault();
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
    };
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            sx={{ height: "100%" }}
        >
            <Paper elevation={3} sx={{ padding: 3, width: "30vw" }}>
                <Typography variant="h4" gutterBottom>
                    Log-in...
                </Typography>
                <Stack component="form" onSubmit={handleSubmit}>
                    <FormControl sx={{ mb: 2 }} variant="filled">
                        <InputLabel htmlFor="filled-adornment-username">
                            User Name
                        </InputLabel>
                        <FilledInput
                            id="filled-adornment-username"
                            type={"text"}
                            value={loginData.username}
                            onChange={handleChange("username")}
                            required={true}
                            ref={usernameRef}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="username icon"
                                        onMouseDown={handleMouseDown}
                                        onClick={handleIconClick("username")}
                                        edge="end"
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <FormControl sx={{ mb: 2 }} variant="filled">
                        <InputLabel htmlFor="filled-adornment-password">
                            Password
                        </InputLabel>
                        <FilledInput
                            id="filled-adornment-password"
                            type={loginData.showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={handleChange("password")}
                            ref={passwordRef}
                            required={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDown}
                                        edge="end"
                                    >
                                        {loginData.showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Stack component="div" direction="row">
                        <Box
                            sx={{
                                flexGrow: 1,
                            }}
                        >
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
                                Forgot Password?
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "right" }}>
                            <Button
                                variant="text"
                                sx={{ mr: 1 }}
                                onClick={() => navigate("/profile/register")}
                            >
                                sign-up
                            </Button>
                            <Button type="submit" variant="contained">
                                Login
                            </Button>
                        </Box>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default Login;
