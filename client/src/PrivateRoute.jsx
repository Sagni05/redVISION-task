import React from "react";
import { Navigate } from "react-router-dom";
import Blank from "./pages/Blank";




const PrivateRoute = () => {

    const isValidToken = localStorage.getItem("token") == null ? false : true;
    return isValidToken ? <Blank /> : <Navigate to="/login" />;

};

export default PrivateRoute;