import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import VarkChart from './VarkChart';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

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

function Home({ assessment, courses, vark }) {
  const classes = useStyles();
  
  const [open, setOpen] = React.useState(false);;
  function checkDate(dateString) {
    if (isNaN(parseInt(dateString[0]))) {
      return new Date(8640000000000000);
    }

    let splitStr = dateString.indexOf("-") !== -1 
    ? dateString.substr(dateString.indexOf("-") + 2).split(' ')
    : dateString.split(' ');

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = parseInt(splitStr[0]);
    let month = months.indexOf(splitStr[1]);
    let year = parseInt('20' + splitStr[2]);
    return new Date(year, month, day);
  }

  const handleVarkOpen = () => {
    setOpen(true);
  }

  const handleVarkClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleVarkClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">About VARK</DialogTitle>
          <DialogContent>
            <DialogContentText style={{color: 'black'}}>
            While there are several tools to study learning styles of students, 
            the visual-aural-read/write-kinesthetic (VARK) questionnaire is a simple, 
            freely available, easy to administer tool that encourages students to describe 
            their behavior in a manner they can identify with and accept. 
            The aim is to understand the preferred sensory modality (or modalities) of students 
            for learning. Teachers can use this knowledge to facilitate student learning. 
            Moreover, students themselves can use this knowledge to change their learning habits.
            </DialogContentText>
          </DialogContent>
      </Dialog>
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
                    VARK statistics 
                    <Button style={{marginLeft: 5}} color='primary' onClick={handleVarkOpen}>
                      Read more
                    </Button>
                  </Typography>
                </div>
                <Typography>
                  {
                    isNaN(vark.V)
                    ? <Typography style={{textAlign: 'center'}}>Please complete vark quiz</Typography>
                    : <VarkChart V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
                  }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  <Typography variant="h5">
                    Upcoming assessment
                  </Typography>
                  <div style ={{fontSize: '12px', color: 'rgb(255, 77, 77)'}}>
                    <Typography variant="h7">Assessment highlighted red are due in the next week</Typography>
                  </div>
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
                            <div key={assessCourse.id}>
                              {checkDate(assessCourse.dateDescription) < currentDate.setDate(currentDate.getDate() + 7)
                              ? <div style={{color: 'rgb(255, 77, 77)'}}>
                                  <Typography>{'-' + assessCourse.name}</Typography>
                                </div>
                              : <div >
                                  <Typography>{'-' + assessCourse.name}</Typography>
                                </div>}
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
