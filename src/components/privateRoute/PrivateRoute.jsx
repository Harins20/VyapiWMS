import React from 'react';
import {Navigate} from 'react-router-dom';
import {Header} from "../layoutComponents/Header";
import NotFound from "../../pages/utility/NotFound.jsx";
import DrawerRouterContainer from "../DrawerRouterContainer";

const PrivateRoute = (props) => {
    let isAuthenticated = false

    if(localStorage.getItem('selfToken')) {
        isAuthenticated = true
    }

    return isAuthenticated ? (
      <>
         <DrawerRouterContainer>
             {props.children}
         </DrawerRouterContainer>
      </>
        ) : <Navigate to="/" />;
};



export default PrivateRoute;