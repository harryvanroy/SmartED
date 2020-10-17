import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const TeacherFeedback = ({ feedback }) => {
  return feedback.map((e, index) => <div key={index}>{e.feedback}</div>);
};

export default TeacherFeedback;
