import React, { useContext, useEffect} from "react";
import { AuthContext } from "@src-contexts/Authenticate";

import useAxios from "@src-utils/useAxios";

function Logout() {
    const { logoutUser, baseURL, authTokens, isAuthenticated} = useContext(AuthContext);
    const api = useAxios();


    const handleLogout = (event) => {
        event.preventDefault();

        api.post(`${baseURL}/accounts/api/token/logout/`, {
            refresh_token: authTokens.refresh
        })
            .then((res) => {
                console.log(res);
                res.status === 205 && logoutUser();
            })
            .catch((err) => {
                console.log("Error at logout: ", err);
            });
    };
    return (
        <div>
            You will be logged out from this accounts
            <button onClick={handleLogout}>OK</button>
            <br />
            See you latter{":)"}
        </div>
    );
}

export default Logout;
