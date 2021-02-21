import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import NoteIcon from "@material-ui/icons/Note";
import {
  Button,
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Cookies from "js-cookie";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

export default function Study() {
  let is_started = false;
  let duration = 0;
  let starttime = new Date().getTime();
  let g1 = "";
  let g2 = "";
  let g3 = "";
  let g4 = "";
  let g5 = "";

  if (localStorage.getItem("studyStartTime") !== null) {
    is_started = true;
    duration = parseFloat(localStorage.getItem("duration"));
    starttime = parseInt(localStorage.getItem("studyStartTime"));
    g1 = localStorage.getItem("g1");
    g2 = localStorage.getItem("g2");
    g3 = localStorage.getItem("g3");
    g4 = localStorage.getItem("g4");
    g5 = localStorage.getItem("g5");
  }

  const [started, setStarted] = useState(is_started);
  const [open, setOpen] = useState(false);
  const [altopen, setAlt] = useState(false);
  const [state, setState] = useState({
    duration: duration,
    starttime: starttime,
    g1: g1,
    g2: g2,
    g3: g3,
    g4: g4,
    g5: g5,
  });

  const handleTextChange1 = (event) => {
    setState({ ...state, g1: event.target.value });
    localStorage.setItem("g1", event.target.value);
  };
  const handleTextChange2 = (event) => {
    setState({ ...state, g2: event.target.value });
    localStorage.setItem("g2", event.target.value);
  };
  const handleTextChange3 = (event) => {
    setState({ ...state, g3: event.target.value });
    localStorage.setItem("g3", event.target.value);
  };
  const handleTextChange4 = (event) => {
    setState({ ...state, g4: event.target.value });
    localStorage.setItem("g4", event.target.value);
  };
  const handleTextChange5 = (event) => {
    setState({ ...state, g5: event.target.value });
    localStorage.setItem("g5", event.target.value);
  };

  const handleDurChange = (event) => {
    setState({ ...state, duration: parseFloat(event.target.value) });
    localStorage.setItem("duration", event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAltOpen = () => {
    setAlt(true);
  };

  const handleAltClose = () => {
    setAlt(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStarted(true);
    var startDate = new Date().getTime();

    localStorage.setItem("studyStartTime", startDate);

    setState({ ...state, starttime: startDate });
    handleClose();
  };

  const drawDurField = () => {
    return (
      <FormControl style={{ marginBottom: 12, maxWidth: 80 }}>
        <TextField
          placeholder="hours"
          variant="outlined"
          onChange={handleDurChange}
        />
      </FormControl>
    );
  };

  const drawTextField1 = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
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
        <ListItem button onClick={handleAltOpen}>
          <ListItemIcon>
            <NoteIcon />
          </ListItemIcon>
          <ListItemText primary="View Study Session" />
        </ListItem>
      );
    }
    return (
      <ListItem button onClick={handleOpen}>
        <ListItemIcon>
          <NoteIcon />
        </ListItemIcon>
        <ListItemText primary="Start Study Session" />
      </ListItem>
    );
  };

  const reset = () => {
    setStarted(false);
    setState({
      duration: 0,
      starttime: new Date().getTime(),
      g1: "",
      g2: "",
      g3: "",
      g4: "",
      g5: "",
    });
    setOpen(false);
    setAlt(false);
    localStorage.removeItem("studyStartTime");
    localStorage.removeItem("g1");
    localStorage.removeItem("g2");
    localStorage.removeItem("g3");
    localStorage.removeItem("g4");
    localStorage.removeItem("g5");
    localStorage.removeItem("duration");
  };

  const altDialog = () => {
    var now = new Date().getTime();
    var timeleft = state.starttime + state.duration * 60 * 60 * 1000 - now;
    var hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <Dialog open={altopen} onClose={handleAltClose} fullWidth={true}>
        <DialogTitle> Current Study Session</DialogTitle>
        <DialogContent>
          <Box m={2}>
            <Typography variant="h6">
              Time remaining: {hours}:{minutes}
            </Typography>
            <Typography variant="subtitle1">{state.g1}</Typography>
            <Typography variant="subtitle1">{state.g2}</Typography>
            <Typography variant="subtitle1">{state.g3}</Typography>
            <Typography variant="subtitle1">{state.g4}</Typography>
            <Typography variant="subtitle1">{state.g5}</Typography>
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
    );
  };

  return (
    <Box>
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
    </Box>
  );
}
