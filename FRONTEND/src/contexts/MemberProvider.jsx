import React, { useState, useContext } from "react";
import useAxios from "@src-utils/useAxios";
import { AuthContext } from "@src-contexts/Authenticate";

export const MemberContext = React.createContext();

function MemberProvider({ children }) {
    const api = useAxios();
    const [member, setMember] = useState(null);
    const { user, baseURL } = useContext(AuthContext);
    // Update member.
    // Get member from detailed api endpoint.

    const getMember = () => {
        api.get(`${baseURL}/accounts/api/members/detail/${user.member_id}/`)
            .then((res) => {
                setMember(res.data);
            })
            .catch((err) => {
                console.log("Error at get Member", err);
            });
    };

    const deleteHistory = (selectedArticles) => {
        if (selectedArticles?.length === 0) return;
        api.delete(`${baseURL}/accounts/api/members/history/`, {
            data: { selected_articles: selectedArticles },
        })
            .then((res) => {
                getMember();
                console.log(res);
            })
            .catch((err) =>
                console.log("Error at Delete Single History: ", err)
            );
    };

    const addFavourite = (selectedArticles) => {
        console.log(selectedArticles);
        if (selectedArticles?.length === 0) return;
        api.post(`${baseURL}/accounts/api/members/favourite/`, {
            selected_articles: selectedArticles,
        })
            .then((res) => {
                getMember();
                console.log(res);
            })
            .catch((err) => console.log("Error at Add Favourite: ", err));
    };

    const removeFavourite = (selectedArticles) => {
        console.log(selectedArticles);
        if (selectedArticles?.length === 0) return;
        api.delete(`${baseURL}/accounts/api/members/favourite/`, {
            data: { selected_articles: selectedArticles },
        })
            .then((res) => {
                getMember();
                console.log(res);
            })
            .catch((err) => console.log("Error at Remove Favourite: ", err));
    };

    const contexData = {
        // Data
        member,

        // Functions
        getMember,
        deleteHistory,
        addFavourite,
        removeFavourite,
    };
    return (
        <MemberContext.Provider value={contexData}>
            {children}
        </MemberContext.Provider>
    );
}

export default MemberProvider;
