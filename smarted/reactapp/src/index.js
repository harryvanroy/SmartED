import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import StudentApp from './StudentApp';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import TeacherApp from './TeacherApp';

// DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const App = () => {
  const [user, setUser] = React.useState({});
  const useEffect = () => {
    axios(url+'/Database/initialize/', {
      method: "get",
      withCredentials: true
    }).then(res => {
      setUser(res);
    })
  }
  return (
    <StudentApp />
  )
}
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);


