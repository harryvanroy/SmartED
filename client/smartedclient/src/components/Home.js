import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

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
                  Announcements
                </div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl elit, pretium ut sem eget, maximus porta sapien. Nulla mollis rutrum varius. Morbi mauris erat, semper a ullamcorper vel, rhoncus consequat ligula. Nullam tristique felis vitae pellentesque ornare. Suspendisse justo est, laoreet eu malesuada accumsan, semper eget urna. Nullam blandit tempor dolor quis sagittis. Nam eleifend id elit eu fermentum. Maecenas in gravida purus, ac laoreet sem. Pellentesque metus nulla, varius vitae arcu eget, tristique porttitor libero.
                Phasellus sodales viverra mattis. Sed ac lacinia justo, et pellentesque justo. Quisque massa massa, tempor sit amet gravida euismod, luctus in neque. Nam in placerat nunc, vel tempor augue. Vivamus tempus pulvinar felis sit amet dictum. Quisque ac neque a leo elementum iaculis. Praesent aliquam nunc gravida imperdiet interdum. In eu finibus orci. Suspendisse potenti. Donec lacinia risus commodo ornare posuere.
                Aliquam hendrerit felis sit amet magna sodales consectetur.
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  Personalised Feedback
                </div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl elit, pretium ut sem eget, maximus porta sapien. Nulla mollis rutrum varius. Morbi mauris erat, semper a ullamcorper vel, rhoncus consequat ligula. Nullam tristique felis vitae pellentesque ornare. Suspendisse justo est, laoreet eu malesuada accumsan, semper eget urna. Nullam blandit tempor dolor quis sagittis. Nam eleifend id elit eu fermentum. Maecenas in gravida purus, ac laoreet sem. Pellentesque metus nulla, varius vitae arcu eget, tristique porttitor libero.
                Phasellus sodales viverra mattis. Sed ac lacinia justo, et pellentesque justo. Quisque massa massa, tempor sit amet gravida euismod, luctus in neque. Nam in placerat nunc, vel tempor augue. Vivamus tempus pulvinar felis sit amet dictum. Quisque ac neque a leo elementum iaculis. Praesent aliquam nunc gravida imperdiet interdum. In eu finibus orci. Suspendisse potenti. Donec lacinia risus commodo ornare posuere.
                Aliquam hendrerit felis sit amet magna sodales consectetur.
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  Upcoming Assessment
                </div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl elit, pretium ut sem eget, maximus porta sapien. Nulla mollis rutrum varius. Morbi mauris erat, semper a ullamcorper vel, rhoncus consequat ligula. Nullam tristique felis vitae pellentesque ornare. Suspendisse justo est, laoreet eu malesuada accumsan, semper eget urna. Nullam blandit tempor dolor quis sagittis. Nam eleifend id elit eu fermentum. Maecenas in gravida purus, ac laoreet sem. Pellentesque metus nulla, varius vitae arcu eget, tristique porttitor libero.
                Phasellus sodales viverra mattis. Sed ac lacinia justo, et pellentesque justo. Quisque massa massa, tempor sit amet gravida euismod, luctus in neque. Nam in placerat nunc, vel tempor augue. Vivamus tempus pulvinar felis sit amet dictum. Quisque ac neque a leo elementum iaculis. Praesent aliquam nunc gravida imperdiet interdum. In eu finibus orci. Suspendisse potenti. Donec lacinia risus commodo ornare posuere.
                Aliquam hendrerit felis sit amet magna sodales consectetur.
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className = {classes.paperTitle}>
                  Class Attendance
                </div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl elit, pretium ut sem eget, maximus porta sapien. Nulla mollis rutrum varius. Morbi mauris erat, semper a ullamcorper vel, rhoncus consequat ligula. Nullam tristique felis vitae pellentesque ornare. Suspendisse justo est, laoreet eu malesuada accumsan, semper eget urna. Nullam blandit tempor dolor quis sagittis. Nam eleifend id elit eu fermentum. Maecenas in gravida purus, ac laoreet sem. Pellentesque metus nulla, varius vitae arcu eget, tristique porttitor libero.
                Phasellus sodales viverra mattis. Sed ac lacinia justo, et pellentesque justo. Quisque massa massa, tempor sit amet gravida euismod, luctus in neque. Nam in placerat nunc, vel tempor augue. Vivamus tempus pulvinar felis sit amet dictum. Quisque ac neque a leo elementum iaculis. Praesent aliquam nunc gravida imperdiet interdum. In eu finibus orci. Suspendisse potenti. Donec lacinia risus commodo ornare posuere.
                Aliquam hendrerit felis sit amet magna sodales consectetur.
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;