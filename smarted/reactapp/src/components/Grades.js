import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

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

function Grades({ courses }) {
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
      <Box width="80%">
        <Typography variant="h4">
          My Grades
        </Typography>
      </Box>
    </div>
  );
};

export default Grades;