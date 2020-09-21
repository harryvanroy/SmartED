import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

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

function Home() {
  const classes = useStyles();
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
                </div>

                <Typography variant="h6">
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
                  <div>
                  - DECO3801 Studio 01: Monday 8am-10am (49-301)
                  </div>
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
