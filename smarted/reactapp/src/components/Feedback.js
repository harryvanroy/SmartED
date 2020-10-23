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
import { Link } from "react-router-dom";
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
    minWidth: 120,
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
  const [state, setState] = React.useState({
    course: "",
    text: "",
    anon: false,
  });

  const handleCourseChange = (event) => {
    console.log(state.course);
    setState({ ...state, course: event.target.value });
  };

  const handleTextChange = (event) => {
    setState({ ...state, text: event.target.value });
  };

  const handleAnonChange = (event) => {
    setState({ ...state, anon: event.target.checked });
  };

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
    if (state.text === "" || state.course === "") {
      setOpenErr(true);
      return;
    }
    console.log(state);
    axios(url + `/Database/post-course-feedback/`, {
      method: "post",
      data: {
        courseID: state.course,
        feedback: state.text,
        anonymous: state.anon === true ? 1 : 0,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data === "spam") {
        setOpenSpam(true);
      } else {
        setOpen(true);
      }
      console.log("posted..");
      console.log(res);
    });
  };

  return (
    <Box width="80%">
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          Feedback submitted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSpam}
        autoHideDuration={2000}
        onClose={handleSpamClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSpamClose} severity="warning">
          Limit of 2 course feeback messages per day reached!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErr}
        autoHideDuration={2000}
        onClose={handleErrClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleErrClose} severity="error">
          Invalid feedback!
        </Alert>
      </Snackbar>
      <Typography variant="h4">Course Feedback</Typography>

      <Box style={{ minWidth: 550 }} m={2}>
        <FormControl
          style={{ marginBottom: 12 }}
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel id="demo-simple-select-outlined-label">Course</InputLabel>
          <Select
            defaultValue=""
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Course"
            onChange={handleCourseChange}
          >
            {courses.map((a, index) => (
              <MenuItem key={index} value={a.id}>
                {" "}
                {a.name}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={8}
            placeholder="Type feedback here"
            variant="outlined"
            onChange={handleTextChange}
          />
        </FormControl>
      </Box>
      <Box m={2}>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="end"
              control={<Checkbox color="primary" onChange={handleAnonChange} />}
              label="Anonymous? (Constructive feedback only. Bullying or hate speech will not be tolerated)"
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
        <br />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
        >
          SEND TO COURSE STAFF
        </Button>
        <Link to="/">
          <Button color="primary" size="large">
            Back
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Feedback;
