import React from "react";

import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import { useContext } from "react";

import { AuthContext } from "@src-contexts/Authenticate";

// Handles updating use auth token in each request.
const useAxios = () => {
    const { user, authTokens, setAuthTokens, setUser, baseURL, isAuthenticated} =
        useContext(AuthContext);

    if(!user){
        return axios
    }
    
    // Create axios instance
    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${authTokens.access}`,
        },
    });

    // Update tokens
    axiosInstance.interceptors.request.use(async (request) => {
        // continue if not expired
        const isExpired = () => dayjs.unix(user.exp).diff(dayjs()) < 1;
        if (isExpired()) {
            // Update token if expired
            delete request.headers.Authorization;

            const response = await axios.post(
                `${baseURL}/accounts/api/token/refresh/`,
                { refresh: authTokens.refresh }
            );
            const data = await response.data;

            // Store the new tokens
            localStorage.setItem("authTokens", JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwt_decode(data.access));

            // Resend the origial request
            request.headers.Authorization = `Bearer ${data.access}`;
            return request;
        }
        return request;
    });
    return axiosInstance;
};

export default useAxios;
