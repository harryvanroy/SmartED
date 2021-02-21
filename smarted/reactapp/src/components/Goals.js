import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Box, Typography } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Cookies from "js-cookie";
import DialogContentText from "@material-ui/core/DialogContentText";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
//

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
}));

function Goals({ courses, assessment }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    courseID: 0,
    courseName: "",
    type: "",
    grade: 0,
    hours: 0,
    assID: 0,
    assName: "",
    text: "",
  });
  const [gradeGoals, setGradeGoals] = React.useState([]);
  const [assGoals, setAssGoals] = React.useState([]);
  const [studyGoals, setStudyGoals] = React.useState([]);
  const [customGoals, setCustomGoals] = React.useState([]);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogText, setDialogText] = React.useState("");

  useEffect(() => {
    axios(url + "/Database/goals/", {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      let courseGoalsToAdd = [];
      let assGoalsToAdd = [];
      let studyGoalsToAdd = [];
      let customGoalsToAdd = [];

      res.data["COURSEGRADE"].forEach((courseGradeGoal) => {
        courseGoalsToAdd.push(courseGradeGoal);
      });
      res.data["ASSESSMENTGRADE"].forEach((assGoal) => {
        assGoalsToAdd.push(assGoal);
      });
      res.data["STUDYWEEK"].forEach((studyGoal) => {
        studyGoalsToAdd.push(studyGoal);
      });
      res.data["CUSTOM"].forEach((customGoal) => {
        customGoalsToAdd.push(customGoal);
      });

      setGradeGoals(courseGoalsToAdd);
      setAssGoals(assGoalsToAdd);
      setStudyGoals(studyGoalsToAdd);
      setCustomGoals(customGoalsToAdd);
    });
  }, []);

  const handleCourseChange = (event) => {
    setState({
      ...state,
      courseID: event.target.value.id,
      courseName: event.target.value.name,
    });
  };

  const handleTextChange = (event) => {
    setState({ ...state, text: event.target.value });
  };

  const handleHoursChange = (event) => {
    setState({ ...state, hours: parseInt(event.target.value) });
  };

  const handleGoalChange = (event) => {
    console.log(state);
    setState({
      ...state,
      type: event.target.value,
      grade: 0,
      hours: 0,
      assName: "",
      assID: 0,
      text: "",
    });
  };

  const handleAssessmentChange = (event) => {
    let assName = event.target.value.name;
    let assID = event.target.value.id;
    setState({ ...state, assName: assName, assID: assID });
  };

  const handleGradeChange = (event) => {
    setState({ ...state, grade: parseInt(event.target.value) });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (text) => {
    return function () {
      setOpenDialog(true);
      setDialogText(text);
    };
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogText("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let postGoal = {};
    switch (state.type) {
      case "COURSEGRADE":
        postGoal = {
          courseID: state.courseID,
          type: state.type,
          is_complete: 0,
          grade: state.grade,
        };
        break;
      case "ASSESSMENTGRADE":
        postGoal = {
          courseID: state.courseID,
          type: state.type,
          assID: state.assID,
          is_complete: 0,
          grade: state.grade,
        };
        break;
      case "STUDYWEEK":
        postGoal = {
          courseID: state.courseID,
          type: state.type,
          is_complete: 0,
          hours: state.hours,
        };
        break;
      case "CUSTOM":
        postGoal = {
          courseID: state.courseID,
          type: state.type,
          is_complete: 0,
          text: state.text,
        };
        break;
      default:
    }
    console.log("About to post:");
    console.log(postGoal);
    axios(url + "/Database/goals/", {
      method: "post",
      data: postGoal,
      withCredentials: true,
    }).then(() => {
      axios(url + "/Database/goals/", {
        method: "get",
        withCredentials: true,
      }).then((res) => {
        let courseGoalsToAdd = [];
        let assGoalsToAdd = [];
        let studyGoalsToAdd = [];
        let customGoalsToAdd = [];

        res.data["COURSEGRADE"].forEach((courseGradeGoal) => {
          courseGoalsToAdd.push(courseGradeGoal);
        });
        res.data["ASSESSMENTGRADE"].forEach((assGoal) => {
          assGoalsToAdd.push(assGoal);
        });
        res.data["STUDYWEEK"].forEach((studyGoal) => {
          studyGoalsToAdd.push(studyGoal);
        });
        res.data["CUSTOM"].forEach((customGoal) => {
          customGoalsToAdd.push(customGoal);
        });

        setGradeGoals(courseGoalsToAdd);
        setAssGoals(assGoalsToAdd);
        setStudyGoals(studyGoalsToAdd);
        setCustomGoals(customGoalsToAdd);
      });
    });
  };

  const drawOverallGoal = () => {
    if (state.type === "COURSEGRADE" && state.courseID !== 0) {
      return (
        <Box>
          Get grade
          <FormControl
            style={{ marginLeft: 6, marginRight: 6 }}
            variant="outlined">
            <Select
              id="demo-simple-select-outlined"
              onChange={handleGradeChange}
              defaultValue="">
              <MenuItem value={1}> 1</MenuItem>
              <MenuItem value={2}> 2</MenuItem>
              <MenuItem value={3}> 3</MenuItem>
              <MenuItem value={4}> 4</MenuItem>
              <MenuItem value={5}> 5</MenuItem>
              <MenuItem value={6}> 6</MenuItem>
              <MenuItem value={7}> 7</MenuItem>
            </Select>
          </FormControl>
          overall
        </Box>
      );
    }
  };

  const drawAssessmentGoal = () => {
    if (state.type === "ASSESSMENTGRADE" && state.courseID !== 0) {
      return (
        <Box>
          Get grade
          <FormControl
            style={{ marginLeft: 6, marginRight: 6 }}
            variant="outlined">
            <Select
              id="demo-simple-select-outlined"
              onChange={handleGradeChange}
              defaultValue="">
              <MenuItem value={1}> 1</MenuItem>
              <MenuItem value={2}> 2</MenuItem>
              <MenuItem value={3}> 3</MenuItem>
              <MenuItem value={4}> 4</MenuItem>
              <MenuItem value={5}> 5</MenuItem>
              <MenuItem value={6}> 6</MenuItem>
              <MenuItem value={7}> 7</MenuItem>
            </Select>
          </FormControl>
          in assessment item
          <FormControl
            style={{ marginLeft: 6, marginRight: 6 }}
            variant="outlined">
            <Select
              id="demo-simple-select-outlined"
              onChange={handleAssessmentChange}
              defaultValue="">
              {assessment
                .filter((ass) => ass.course === state.courseID)
                .map((e) => (
                  <MenuItem key={e.id} value={e}>
                    {e.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      );
    }
  };

  const drawStudyGoal = () => {
    if (state.type === "STUDYWEEK" && state.courseID !== 0) {
      return (
        <Box>
          Spend
          <FormControl style={{ marginLeft: 6, marginRight: 6, maxWidth: 80 }}>
            <TextField
              id="outlined-basic"
              placeholder="hours"
              variant="outlined"
              onChange={handleHoursChange}
            />
          </FormControl>
          hours per week on this course
        </Box>
      );
    }
  };

  const drawTextField = () => {
    if (state.type === "CUSTOM" && state.courseID !== 0) {
      return (
        <FormControl fullWidth>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={2}
            placeholder="Custom goal text"
            variant="outlined"
            onChange={handleTextChange}
          />
        </FormControl>
      );
    }
  };

  const handleDelete = (id, goalType) => (event) => {
    axios(url + `/Database/goals/?id=${id}`, {
      method: "delete",
      withCredentials: true,
    }).then(() => {
      switch (goalType) {
        case 0:
          setCustomGoals(customGoals.filter((goal) => goal.id !== id));
          break;
        case 1:
          setGradeGoals(gradeGoals.filter((goal) => goal.id !== id));
          break;
        case 2:
          setStudyGoals(studyGoals.filter((goal) => goal.id !== id));
          break;
        case 3:
          setAssGoals(assGoals.filter((goal) => goal.id !== id));
          break;
        default:
      }
    });
  };
  return (
    <div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Custom goal</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogText}</DialogContentText>
        </DialogContent>
      </Dialog>
      <Box width="80%">
        <Typography variant="h4">Course Goals</Typography>

        <Box m={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpen}>
            ADD GOAL
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogContent>
              <Box m={2}>
                <FormControl
                  style={{ marginBottom: 12, marginRight: 6 }}
                  variant="outlined"
                  className={classes.formControl}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    label="Course"
                    defaultValue=""
                    onChange={handleCourseChange}>
                    {courses.map((a, index) => (
                      <MenuItem key={index} value={a}>
                        {" "}
                        {a.name}{" "}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>{" "}
                <FormControl
                  style={{ marginBottom: 12 }}
                  variant="outlined"
                  className={classes.formControl}>
                  <InputLabel>Goal type</InputLabel>
                  <Select
                    label="Course"
                    defaultValue=""
                    onChange={handleGoalChange}>
                    <MenuItem value={"COURSEGRADE"}> Overall grade </MenuItem>
                    <MenuItem value={"ASSESSMENTGRADE"}>
                      {" "}
                      Specific assessment grade{" "}
                    </MenuItem>
                    <MenuItem value={"STUDYWEEK"}> Weekly study time </MenuItem>
                    <MenuItem value={"CUSTOM"}> Custom goal </MenuItem>
                  </Select>
                </FormControl>
                {drawOverallGoal()}
                {drawAssessmentGoal()}
                {drawStudyGoal()}
                {drawTextField()}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleSubmit}
                color="primary">
                ADD
              </Button>
              <Button onClick={handleClose} color="primary">
                CLOSE
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <TableContainer
        style={{ marginBottom: 10, marginTop: 10 }}
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell align="right">Custom goal</TableCell>
              <TableCell width="2"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customGoals.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.course.name}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDialog(row.text)}>
                    View goal
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={handleDelete(row.id, 0)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        style={{ marginBottom: 10, marginTop: 10 }}
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell align="right">Overall grade</TableCell>
              <TableCell width="2"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gradeGoals.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.course.name}
                </TableCell>
                <TableCell align="right">{row.grade}</TableCell>
                <TableCell>
                  <Button onClick={handleDelete(row.id, 1)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        style={{ marginBottom: 10, marginTop: 10 }}
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell align="right">Weekly study time</TableCell>
              <TableCell width="2"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studyGoals.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.course.name}
                </TableCell>
                <TableCell align="right">{row.hours} hours</TableCell>
                <TableCell>
                  <Button onClick={handleDelete(row.id, 2)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        style={{ marginBottom: 10, marginTop: 10 }}
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell align="right">Assessment item</TableCell>
              <TableCell align="right">Grade</TableCell>
              <TableCell width="2"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assGoals.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.course.name}
                </TableCell>
                <TableCell align="right">{row.assessment.name}</TableCell>
                <TableCell align="right">{row.grade}</TableCell>
                <TableCell>
                  <Button onClick={handleDelete(row.id, 3)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Goals;
