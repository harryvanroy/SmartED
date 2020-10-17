import React, { useEffect } from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import VarkChart from '../VarkChart';
import Cookies from 'js-cookie';
import axios from 'axios';

// DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  paperTitle: {
    textAlign: "center",
    fontSize: "1.5em",
    paddingBottom: "15px",
  },
}));


function TeacherHome({ course }) {
  const [vark, setVark] = React.useState({"V": 0.25, "A": 0.25, "R": 0.25, "K":0.25});
  const classes = useStyles();

  function GetCourseVARK({id}) {
    axios(url + "/Database/course-average-vark/?id=" + course.id, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      setVark({
        V: parseFloat(res.data.V),
        A: parseFloat(res.data.A),
        R: parseFloat(res.data.R),
        K: parseFloat(res.data.K),
      });
    });
  }
  useEffect(() => {
    GetCourseVARK(course.id);
  }, []);

  return (
    <Grid container justify="center" spacing={3}>
        <Grid item xs={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5">
                    Course VARK Summary
                  </Typography>
                </div>
                {isNaN(vark.V) ? (
                  <Typography align="center">
                    Please complete vark quiz
                  </Typography>
                ) : (
                  <VarkChart V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  )
}

export default TeacherHome;