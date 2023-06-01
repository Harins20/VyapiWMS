import React from 'react';
import {useNavigate} from "react-router-dom";

function NotFound (){
    let navigate = useNavigate()

  function handleLogout(e) {
    e.preventDefault()
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <div style={{textAlign:"center"}}>
      <h1>404 - Not Found!</h1>
      <a href="/" onClick={handleLogout}>  Go To Login Page </a>
    </div>
  )

}
export default NotFound;