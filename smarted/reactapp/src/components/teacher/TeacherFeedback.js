import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const TeacherFeedback = ({ course }) => {
  const [feedback, setFeedback] = useState([]);
  useEffect(() => {
    console.log(course);
    axios(url+`/Database/get-course-feedback/?id=${course.id}`, {
      method: "get",
      withCredentials: true
    })
    .then(res => {
      console.log(res.data);
      console.log('posting...');
      setFeedback(feedback.concat(res.data));
      console.log(feedback);
    })
  }, []);

  return (
    <div>
      Teacher feedback page for {course.name}
      {feedback.map((e, i) => (
        <div key={i}>{e.feedback}</div>
      ))}
    </div>
  );
}

export default TeacherFeedback