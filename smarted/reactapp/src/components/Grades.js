import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

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

function Grades() {
  const [grades, setGrades] = React.useState([]);

  useEffect(() => {
    axios(url+'/Database/get-grades/', {
      method: "get",
      withCredentials: true
      })
      .then(res => {
        console.log(res.data);
        setGrades(res.data);
      });
  }, []);
  return (
    <div>
      {grades.map((grade) => (
        <div>{grade.grade} for {grade.assessment.name}</div>
      ))}
    </div>
  );
};

export default Grades;