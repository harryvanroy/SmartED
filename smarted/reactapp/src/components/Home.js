import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  paperTitle: {
    textAlign: "center",
    fontSize: '1.5em',
    paddingBottom: '15px'
  }
}));

function Home({ assessment, courses }) {
  const classes = useStyles();

  function checkDate(dateString) {
    if (isNaN(parseInt(dateString[0]))) {
      return new Date(8640000000000000);
    }

    let splitStr = dateString.indexOf("-") != -1 
    ? dateString.substr(dateString.indexOf("-") + 2).split(' ')
    : dateString.split(' ');

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = parseInt(splitStr[0]);
    let month = months.indexOf(splitStr[1]);
    let year = parseInt('20' + splitStr[2]);
    return new Date(year, month, day);
  }

  return (
    <div>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  <Typography variant="h5">
                    Announcements
                  </Typography>
                </div>
                <Typography variant="h6">
                  DECO3801:
                </Typography>
                <Typography>
                  - Reminder to check schedule for Monday morning!
                </Typography>
                <Typography variant="h6">
                  INFS1200:
                </Typography>
                <Typography>
                  - Course content added: Lecture 04/09/2020
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  <Typography variant="h5">
                    Personalised feedback
                  </Typography>
                </div>
                Smooth sailing, keep it up!
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  <Typography variant="h5">
                    Upcoming assessment
                  </Typography>
                  <div style ={{fontSize: '12px', color: 'rgb(255, 77, 77)'}}>Assessment highlighted red are due in the next week</div>
                </div>
                {
                  courses.map(course =>  
                    <div key={course.id}>
                      <Typography variant="h6">
                        {course.name + ':'}
                      </Typography>
                      {
                        assessment
                        .filter(allAssess => allAssess.course === course.id && new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate()
                        ) < checkDate(allAssess.dateDescription))
                        .map(assessCourse => {
                          let currentDate = new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate()
                          );
                          return (
                            checkDate(assessCourse.dateDescription) < currentDate.setDate(currentDate.getDate() + 7)
                            ? <div style={{color: 'rgb(255, 77, 77)'}}>
                                {'-' + assessCourse.name}
                              </div>
                            : <div style={{}}>
                                {'-' + assessCourse.name}
                              </div>
                          )
                        })
                      }
                    </div>
                  )
                }
                {/* <Typography variant="h6">
                  DECO3801:
                </Typography>
                <Typography>
                  - MVP presentation (07/09/2020)
                </Typography>
                <Typography variant="h6">
                  CSSE1001:
                </Typography>
                <Typography>
                  - HW2 (14/09/2020)
                </Typography> */}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  <Typography variant="h5">
                    Daily goals
                  </Typography>
                </div>
                <Typography variant="h6">
                  COMP4500:
                </Typography>
                <Typography>
                  ---
                </Typography>
                <Typography variant="h6">
                  DECO3801:
                </Typography>
                <Typography>
                  ---
                </Typography>
                <Typography variant="h6">
                  MATH3204:
                </Typography>
                <Typography>
                  ---
                </Typography>
                <Typography variant="h6">
                  STAT2004:
                </Typography>
                <Typography>
                  ---
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  <Typography variant="h5">
                    Class Attendance
                  </Typography>
                </div>

                <Typography variant="h6">
                  Monday:
                </Typography>
                <Typography>
                  - DECO3801 Studio 01: Monday 8am-10am (49-301)
                  - CSSE1001 Lecture 01: Monday 12pm-1pm (49-200)
                </Typography>
                
                <Typography variant="h6">
                  Tuesday:
                </Typography>
                <Typography>
                  - INFS1200 Lecture 01: 9am-10am (27A-220)
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
