import React, { useContext } from "react";
import { AuthContext } from "@src-contexts/Authenticate";
import useAxios from "@src-utils/useAxios";

function Deregister() {
    const { deregisterUser } = useContext(AuthContext);
    const api = useAxios();

    const handleDeregister = (event) => {
        event.preventDefault();
        deregisterUser(api);
    };

    return (
        <div>
            You are about to permernetly DELETE this user profile.
            <button onClick={handleDeregister}>OK</button>
        </div>
    );
}

export default Deregister;
