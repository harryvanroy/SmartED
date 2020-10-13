import React from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

//DETERMINE LOCATION
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


function Grades() {
  return (
    <div>
      Grades page.
    </div>
  );
};

export default Grades;