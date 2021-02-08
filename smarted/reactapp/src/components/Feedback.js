import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Box, Typography } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import Cookies from "js-cookie";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Feedback = ({ courses }) => {
  const [open, setOpen] = React.useState(false);
  const [openErr, setOpenErr] = React.useState(false);
  const [openSpam, setOpenSpam] = React.useState(false);
  const classes = useStyles();
  const [course, setCourse] = React.useState("");
  const [text, setText] = React.useState("");
  const [anon, setAnon] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleErrClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErr(false);
  };

  const handleSpamClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSpam(false);
  };

  const handleSubmit = (event) => {
    if (text === "" || course === "") {
      setOpenErr(true);
      return;
    }
    axios(url + `/Database/post-course-feedback/`, {
      method: "post",
      data: {
        courseID: course,
        feedback: text,
        anonymous: anon === true ? 1 : 0,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data === "spam") {
        setOpenSpam(true);
      } else {
        setOpen(true);
      }
    });
  };

  return (
    <Box>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleClose} severity="success">
          Feedback submitted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSpam}
        autoHideDuration={2000}
        onClose={handleSpamClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleSpamClose} severity="warning">
          Limit of 2 course feedback messages per day reached!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErr}
        autoHideDuration={2000}
        onClose={handleErrClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleErrClose} severity="error">
          Invalid feedback!
        </Alert>
      </Snackbar>

      <Typography variant="h4">Course Feedback</Typography>
      <Box m={2}>
        <FormControl variant="filled" fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            value={course}
            label="Course"
            onChange={(e) => setCourse(e.target.value)}>
            {courses.map((a, index) => (
              <MenuItem key={index} value={a.id}>
                {a.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            multiline
            rows={8}
            placeholder="Type feedback here"
            variant="outlined"
            onChange={(e) => setText(e.target.value)}
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => setAnon(e.target.checked)}
              />
            }
            label="Anonymous?"
            labelPlacement="end"
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}>
            SEND TO COURSE STAFF
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Feedback;
