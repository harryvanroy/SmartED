import React, { useState, useEffect } from "react";
import StudentApp from "./StudentApp";
import TeacherApp from "./TeacherApp";
import axios from "axios";
import Cookies from "js-cookie";
import Favicon from "react-favicon";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
//

const App = () => {
  const [user, setUser] = useState(null);

  let force_teacher;

  localStorage.getItem("force_teacher") === "1"
    ? (force_teacher = 1)
    : (force_teacher = 0);

  useEffect(() => {
    let method;

    force_teacher === 1 ? (method = "get") : (method = "delete");

    axios(url + "/Database/force-teacher/", {
      method: method,
      withCredentials: true,
    }).then(() => {
      axios(url + "/Database/initialize/", {
        method: "get",
        withCredentials: true,
      }).then((res) => {
        setUser(res.data);
      });
    });
  }, []);

  return (
    <>
      <Favicon url="https://clipartmag.com/images/graduation-cap-png-24.png" />
      {user !== null &&
        (user.is_student === 0 ? <TeacherApp user={user} /> : <StudentApp />)}
    </>
  );
};

export default App;
