import React, { useContext, useEffect} from "react";
import { Outlet, Link } from "react-router-dom";
import { AuthContext } from "@src-contexts/Authenticate";
import {useNavigate} from "react-router-dom"
import ArticleProvider from "@src-contexts/ArticleProvider";

function Layout() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()
    useEffect(()=>{
        isAuthenticated()&&navigate("/profile/login")
    }, [])
    return (
        <ArticleProvider>
            Profile
            
                {isAuthenticated() ? (
                    <ul>
                        <li>
                            <Link to="/profile/logout"> Log-out </Link>
                        </li>
                        <li>
                            <Link to="/profile/update"> Update Profile </Link>
                        </li>
                        <li>
                            <Link to="/profile/deregister"> Delete profile </Link>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <Link to="/profile/login"> Log-in </Link>
                        </li>
                        <li>
                            <Link to="/profile/register"> Sign-up </Link>
                        </li>
                    </ul>
                )}
                
            <Outlet />
        </ArticleProvider>
    );
}

export default Layout;
