import React from 'react';

import axios from 'axios';

const url = "http://localhost:8000";
//const url = "https://deco3801-pogware.uqcloud.net";

function Assessment() {

    /** Below is an example, delete later (soon) */

    let data = {
      'id': 1
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