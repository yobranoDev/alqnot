import {AuthContext} from '@context/Authenticate'
import React, {useContext} from 'react'
import {Navigate, Outlet} from "react-router-dom"


function PrivateRoute() {
    const {authTokens} = useContext(AuthContext)

    return (
        authTokens?
            <Outlet/>:
            <Navigate to="/profile/login"/>
    )
}

export default PrivateRoute