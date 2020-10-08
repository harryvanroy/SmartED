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
  let user_courses = [9, 10, 11, 12];
  function get_course_grades(courseID) {
      let data = {
          "username": "s4532094",
          "key": 500913,
          "courseID": courseID
      };

      axios(url+'/Database/get-grades/', {
        method: "post",
        data: data,
        withCredentials: true
      }).then(res => {
        console.log(res);
        console.log(res.data);
      });
  }

  let course;
  for (course of user_courses) {
      get_course_grades(course)
  }

  return (
    <div>
      Grades page.
    </div>
  );
};

export default Grades;