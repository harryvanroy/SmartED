import React from 'react';
import Cookies from "js-cookie";
import { Box, Typography } from '@material-ui/core';

//DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);

function Course({ course }) {
  return (
    <Box width="80%">
      <Typography variant="h4">
        Course: {course}
      </Typography>
    </Box>
  );
};

export default Course;
