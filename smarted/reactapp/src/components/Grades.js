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
  async function get_course_grades(courseID) {
      let data = {
          "username": localStorage.getItem('username'),
          "key": parseInt(localStorage.getItem('key')),
          "courseID": courseID
      };
      let result = {};
      await axios(url + '/Database/get-grades/', {
          method: "post",
          data: data,
          withCredentials: true
      }).then(res => {
          console.log(res);
          console.log(res.data);
          result = res.data;
      });

      return result;
  }

  let course;
  let results = [];
  for (course of user_courses) {
      let result = get_course_grades(course);
      console.log(result);
      results.concat(result);
  }

  return (
    <div>
      Grades page.
      <ul>
          {results.map(result => (<li>{JSON.stringify(result)}</li>))}
      </ul>
    </div>
  );
};

export default Grades;