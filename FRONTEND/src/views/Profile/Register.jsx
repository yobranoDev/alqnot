import React, { useContext, useState, useRef } from "react";
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
import EmailIcon from '@mui/icons-material/Email';

// TODO: notify user when login was sucessfull.

function Register() {
    const { registerUser, user } = useContext(AuthContext);

    const [registerData, setRegisterData] = useState({
        email: "",
        username: "",
        password: "",
        password2: "",
        showPassword: false,
        showPassword2: false,
    });

    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const password2Ref = useRef();

    const handleChange = (prop) => (event) => {
        setRegisterData({ ...registerData, [prop]: event.target.value });
    };

    const handleIconClick = (prop) => (event) => {
        switch (prop) {
            case "email":
                emailRef.current?.querySelector("input").focus();
                return;
            case "username":
                usernameRef.current?.querySelector("input").focus();
                return;

            case "password":
                setRegisterData({
                    ...registerData,
                    showPassword: !registerData.showPassword,
                });                
                return;

            case "password2":
                console.log("Clicked")
                setRegisterData({
                    ...registerData,
                    showPassword2: !registerData.showPassword2,
                });                
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

        let formData = {
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            password2: registerData.password2,
        };
        registerUser(formData);
    };
    return (
                <Stack alignItems="center" justifyContent="center">
                    <Paper elevation={3} sx={{ padding: 3, width: "30vw" }}>
                        <Typography variant="h4" gutterBottom>
                            Register...
                        </Typography>

                        <Stack direction="column" spacing={1} component="form" onSubmit={handleSubmit}>
                            {/* Email Entry */}
                            <FormControl>
                                <InputLabel htmlFor="filled-adornment-email">Email</InputLabel>
                                <FilledInput
                                    type="email"
                                    id="filled-adornment-email"
                                    value={registerData.email}
                                    onChange={handleChange("email")}
                                    required={true}
                                    ref={emailRef}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="email icon"
                                                onMouseDown={
                                                    handleIconMouseDown
                                                }
                                                onClick={handleIconClick(
                                                    "email"
                                                )}
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
                                    value={registerData.username}
                                    onChange={handleChange("username")}
                                    required={true}
                                    ref={usernameRef}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="username icon"
                                                onMouseDown={
                                                    handleIconMouseDown
                                                }
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

                            {/* Password Entry */}
                            <FormControl sx={{ mb: 2 }} variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">
                                    Password
                                </InputLabel>
                                <FilledInput
                                    id="filled-adornment-password"
                                    type={
                                        registerData.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={registerData.password}
                                    onChange={handleChange("password")}
                                    ref={passwordRef}
                                    required={true}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleIconClick("password")}
                                                onMouseDown={handleIconMouseDown}
                                                edge="end"
                                            >
                                                {registerData.showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            
                            {/* Password Confirmation Entry */}
                            <FormControl sx={{ mb: 2 }} variant="filled">
                                <InputLabel htmlFor="filled-adornment-password2">
                                    Confirm Password
                                </InputLabel>
                                <FilledInput
                                    id="filled-adornment-password2"
                                    type={
                                        registerData.showPassword2
                                            ? "text"
                                            : "password"
                                    }
                                    value={registerData.password2}
                                    onChange={handleChange("password2")}
                                    ref={password2Ref}
                                    required={true}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password2 visibility"
                                                onClick={handleIconClick("password2")}
                                                onMouseDown={handleIconMouseDown}
                                                edge="end"
                                            >
                                                {registerData.showPassword2 ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            
                            {/* Submittion Buttons */}
                            <Stack direction="row-reverse">
                                <Button
                                    variant="contained"
                                    sx={{ ml: 1 }}
                                    type="submit"
                                >
                                    sign-up
                                </Button>
                                <Button>login</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>


    );
}

export default Register;
