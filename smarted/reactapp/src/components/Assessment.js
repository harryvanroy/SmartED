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

function Assessment() {

    /** Below is an example, delete later (soon) */

    let data = {
      'id': 10
    }

    console.log("posting...")
    axios(url+'/Database/course-assessment/', {
          method: "post",
          data: data,
          withCredentials: true
        }).then(res => {
            console.log(res);
            console.log(res.data);
        })

    /** end example */

    return (
        <div>
          Assessment page.
        </div>
    );
};

export default Assessment;