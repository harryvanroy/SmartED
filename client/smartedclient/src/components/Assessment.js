import React from 'react';

import axios from 'axios';

function Assessment() {

    /** Below is an example, delete later (soon) */

    let data = {
        'username': 's4532094',
        'password': 'grape'
    }

    console.log("posting...")
    axios.post('http://localhost:8000/Database/login-post/', data)
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