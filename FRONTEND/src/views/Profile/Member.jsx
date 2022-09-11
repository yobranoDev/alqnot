import React, { useContext, useEffect } from "react";

import _ from "lodash";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import DescriptionDrawer from "@src-components/DescriptionDrawer";


import { AuthContext } from "@src-contexts/Authenticate";
import { MemberContext } from "@src-contexts/MemberProvider";

import HistoryContainer from "./components/HistoryContainer";
import FavouriteContainer from "./components/FavouriteContainer";

// TODO: use profile context. The user object is not updating even after the articles update.
function Member() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { getMember, member } = useContext(MemberContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/profile/login");
        } else {
            getMember();
            console.log(member);
        }
    }, []);

    return (
        <Box sx={{ mr: 25 }}>
            {member ? (
                <>
                    <Box>
                        {member.favourite_articles?.length !== 0 && (
                            <FavouriteContainer />
                        )}
                        
                        {member.history_articles?.length !== 0 && (
                            <HistoryContainer />
                        )}
                    </Box>
                    <DescriptionDrawer
                        headerBgImg={user.profile.member.background}
                        avatarImg={user.profile.member.avatar}
                    />
                </>
            ) : (
                "Loading...."
            )}
        </Box>
    );
}

export default Member;
