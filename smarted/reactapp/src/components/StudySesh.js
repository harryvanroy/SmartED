import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Cookies from 'js-cookie';

import DialogContentText from '@material-ui/core/DialogContentText';


// DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  }
}));

export default function Study() {
  const classes = useStyles();

  let is_started = false;
  let duration = 0;
  let starttime = new Date().getTime();
  let g1 = '';
  let g2 = '';
  let g3 = '';
  let g4 = '';
  let g5 = '';

  if (localStorage.getItem('studyStartTime') !== null) {
    is_started = true;
    duration = parseFloat(localStorage.getItem('duration'));
    starttime = parseInt(localStorage.getItem('studyStartTime'));
    g1 = localStorage.getItem('g1');
    g2 = localStorage.getItem('g2');
    g3 = localStorage.getItem('g3');
    g4 = localStorage.getItem('g4');
    g5 = localStorage.getItem('g5');
  }

  const [started, setStarted] = React.useState(is_started);
  const [open, setOpen] = React.useState(false);
  const [altopen, setAlt] = React.useState(false);
  const [state, setState] = React.useState({
    duration: duration,
    starttime: starttime,
    g1: g1,
    g2: g2,
    g3: g3,
    g4: g4,
    g5: g5
  });

  const handleTextChange1 = (event) => {
    setState({ ...state, g1: event.target.value });
    console.log(state);
    localStorage.setItem('g1', event.target.value);
  }
  const handleTextChange2 = (event) => {
    setState({ ...state, g2: event.target.value });
    console.log(state);
    localStorage.setItem('g2', event.target.value);
  }
  const handleTextChange3 = (event) => {
    setState({ ...state, g3: event.target.value });
    console.log(state);
    localStorage.setItem('g3', event.target.value);
  }
  const handleTextChange4 = (event) => {
    setState({ ...state, g4: event.target.value });
    console.log(state);
    localStorage.setItem('g4', event.target.value);
  }
  const handleTextChange5 = (event) => {
    setState({ ...state, g5: event.target.value });
    console.log(state);
    localStorage.setItem('g5', event.target.value);
  }

  const handleDurChange = (event) => {
    setState({ ...state, duration: parseFloat(event.target.value) });
    localStorage.setItem('duration', event.target.value);
  }


  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleAltOpen = () => {
    setAlt(true);
  }

  const handleAltClose = () => {
    setAlt(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setStarted(true);
    var startDate = new Date().getTime();

    localStorage.setItem('studyStartTime', startDate);

    setState({ ...state, starttime: startDate });
    handleClose();
  }



  const drawDurField = () => {
    return (
      <FormControl style={{ marginBottom: 12, maxWidth: 80 }}>
        <TextField
          id="outlined-basic"
          placeholder="hours"
          variant="outlined"
          onChange={handleDurChange}
        />
      </FormControl>
    );
  }

  const drawTextField1 = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={2}
          placeholder="Goal 1"
          variant="outlined"
          onChange={(e) => handleTextChange1(e)}
        />
      </FormControl>
    );
  };

  const drawTextField2 = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={2}
          placeholder="Goal 2"
          variant="outlined"
          onChange={(e) => handleTextChange2(e)}
        />
      </FormControl>
    );
  };

  const drawTextField3 = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={2}
          placeholder="Goal 3"
          variant="outlined"
          onChange={(e) => handleTextChange3(e)}
        />
      </FormControl>
    );
  };

  const drawTextField4 = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={2}
          placeholder="Goal 4"
          variant="outlined"
          onChange={(e) => handleTextChange4(e)}
        />
      </FormControl>
    );
  };

  const drawTextField5 = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={2}
          placeholder="Goal 5"
          variant="outlined"
          onChange={(e) => handleTextChange5(e)}
        />
      </FormControl>
    );
  };

  const drawButton = () => {
    if (started) {
      return (
        <Button style={{ marginRight: 18, marginTop: 5, marginBottom: 5 }} onClick={handleAltOpen} variant="contained">
          VIEW STUDY SESSION
        </Button>
      )
    }
    return (<Button style={{ marginRight: 18, marginTop: 5, marginBottom: 5 }} onClick={handleOpen} variant="contained">
      START STUDY SESSION
    </Button>
    )
  }

  const reset = () => {
    setStarted(false);
    setState({
      duration: 0,
      starttime: new Date().getTime(),
      g1: '',
      g2: '',
      g3: '',
      g4: '',
      g5: ''
    });
    setOpen(false);
    setAlt(false);
    localStorage.removeItem('studyStartTime');
    localStorage.removeItem('g1');
    localStorage.removeItem('g2');
    localStorage.removeItem('g3');
    localStorage.removeItem('g4');
    localStorage.removeItem('g5');
    localStorage.removeItem('duration');
  }

  const altDialog = () => {
    var now = new Date().getTime();
    console.log('now', now);
    console.log('starttime duration', state.starttime, state.duration);
    
    var timeleft = state.starttime + state.duration * 60 * 60 * 1000 - now;

    console.log('timeleft', timeleft)

    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    return (
      <Dialog open={altopen} onClose={handleAltClose} fullWidth={true}>
        <DialogTitle> Current Study Session</DialogTitle>
        <DialogContent>
          <Box m={2}>
            <Typography variant="h6">
              Time remaining: {hours}:{minutes}
            </Typography>
            <Typography variant="subtitle1">
              {state.g1}
            </Typography>
            <Typography variant="subtitle1">
              {state.g2}
            </Typography>
            <Typography variant="subtitle1">
              {state.g3}
            </Typography>
            <Typography variant="subtitle1">
              {state.g4}
            </Typography>
            <Typography variant="subtitle1">
              {state.g5}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={reset} color="primary">
            END SESSION
            </Button>
          <Button onClick={handleAltClose} color="primary">
            CLOSE
            </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div>
      {drawButton()}
      {altDialog()}
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle id="form-dialog-title">Create Study Session</DialogTitle>
        <DialogContent>
          <Box m={2}>
            {drawDurField()}
            {drawTextField1()}
            {drawTextField2()}
            {drawTextField3()}
            {drawTextField4()}
            {drawTextField5()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            START
            </Button>
          <Button onClick={handleClose} color="primary">
            CLOSE
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};
