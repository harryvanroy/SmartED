import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Image from '../images/uq_0.jpg';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router';

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

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${Image})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);

  const handleSubmit = (event) => {
    if (username.startsWith('uq')) {
      axios(url+'/Database/teacher-login/', {
        method: "post",
        data: {
          "username": username,
          "password": password
        },
        withCredentials: true
      })
      .then(res => {
        localStorage.setItem('key', res.data.key);
        localStorage.setItem('username', username);
        localStorage.setItem('isTeacher', true);
        console.log(res.data.key);
      }).then(res => {
        setUsername('');
        setPassword('');
        setLoggedIn(true);
      });
      event.preventDefault();
    } else {
      axios(url+'/Database/login-post/', {
        method: "post",
        data: {
          "username": username,
          "password": password
        },
        withCredentials: true
      })
      .then(res => {
        localStorage.setItem('key', res.data.key);
        localStorage.setItem('username', username);
        localStorage.setItem('isTeacher', false);
        console.log(res.data.key);
      }).then(res => {
        setUsername('');
        setPassword('');
        setLoggedIn(true);
      });
      event.preventDefault();
    }
  };
  
  const handleChangeUsername = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
  };
  
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  return (
    loggedIn ? <Redirect to={{
      pathname: '/'
    }} /> : 
    <div>
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Please sign in with your UQ credentials to access resources available to you.
          </Typography>
          <form onSubmit={handleSubmit} className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              onChange={handleChangeUsername}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChangePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  </div>
  );
}
