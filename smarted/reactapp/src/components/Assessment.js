import React from 'react';

import axios from 'axios';

function Assessment() {

    /** Below is an example, delete later (soon) */

    let data = {
      'id': 1
    }

    console.log("posting...")
    axios.post('http://localhost:8000/Database/course-assessment/', data)
        .then(res => {
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