import React, { useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(
  studentID,
  name,
  totalCompleted,
  totalEarnt,
  currentGrade,
  assessmentGrades
) {
  return {
    studentID,
    name,
    totalCompleted,
    totalEarnt,
    currentGrade,
    assessmentGrades,
  };
}

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.studentID}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.totalCompleted}</TableCell>
        <TableCell align="right">{row.totalEarnt}</TableCell>
        <TableCell align="right">{row.currentGrade}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Assessment grades
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Assessment name</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell align="right">Grade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.assessmentGrades.map((assessmentRow, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {assessmentRow.assessmentName}
                      </TableCell>
                      <TableCell>{assessmentRow.weight}</TableCell>
                      <TableCell align="right">{assessmentRow.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
Row.propTypes = {
  row: PropTypes.shape({
    studentID: PropTypes.string.isRequired,
    mame: PropTypes.string.isRequired,
    totalCompleted: PropTypes.string.isRequired,
    totalEarnt: PropTypes.string.isRequired,
    currentGrade: PropTypes.string.isRequired,
    assessmentGrades: PropTypes.arrayOf(
      PropTypes.shape({
        assessmentName: PropTypes.string.isRequired,
        weight: PropTypes.number.isRequired,
        grade: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const TeacherGrades = ({ assessment, course }) => {
  const [grade, setGrade] = React.useState({
    studentID: "",
    assID: 0,
    grade: 0,
  });
  const [studentsCourse, setStudentsCourse] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openTable, setOpenTable] = React.useState(false);
  const [openErr, setOpenErr] = React.useState(false);
  const [studentGrades, setStudentGrades] = React.useState([]);
  const classes = useRowStyles();
  const handleAssessmentChange = (e) => {
    setGrade({ ...grade, assID: parseInt(e.target.value) });
  };

  const handleGradeChange = (e) => {
    setGrade({ ...grade, grade: parseInt(e.target.value) });
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

  const handleStudentChange = (event, student) => {
    if (student !== null) {
      setGrade({ ...grade, studentID: student.username });
    }
  };
  const handleSubmit = (e) => {
    console.log(e.target.value);
    console.log(grade);
    axios(url + "/Database/student-assessment-grade/", {
      method: "post",
      data: grade,
      withCredentials: true,
    })
      .then((res) => {
        console.log("posted grade..");
        setOpen(true);
      })
      .catch((err) => {
        setOpenErr(true);
      });
  };

  useEffect(() => {
    axios(url + `/Database/students-in-course/?id=${course.id}`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setStudentsCourse(res.data);
    });

    axios(url + `/Database/student-course-grades/?id=${course.id}`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      setStudentGrades(studentGrades.concat(res.data));
    });
  }, [course]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          Grade submitted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErr}
        autoHideDuration={2000}
        onClose={handleErrClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleErrClose} severity="error">
          Invalid grade!
        </Alert>
      </Snackbar>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item style={{ width: "100%", marginBottom: 20 }}>
          <Typography style={{ marginBottom: 5, textAlign: "center" }}>
            Add Student Grade
          </Typography>
          <FormControl
            style={{
              marginLeft: 6,
              marginRight: 6,
            }}
            fullWidth
            variant="outlined"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Assessment
            </InputLabel>
            <Select
              defaultValue=""
              id="demo-simple-select-outlined"
              labelId="demo-simple-select-outlined-label"
              label="Assessment"
              onChange={handleAssessmentChange}
            >
              {assessment
                .filter((ass) => ass.course === course.id)
                .map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}
            </Select>
            <Autocomplete
              style={{ marginTop: 10 }}
              id="combo-box-demo"
              options={studentsCourse}
              onChange={handleStudentChange}
              getOptionLabel={(option) => `${option.username}`}
              renderOption={(option) =>
                `${option.firstname} ${option.lastname} (${option.username})`
              }
              renderInput={(params) => (
                <TextField {...params} label="Student ID" variant="outlined" />
              )}
            />
            <TextField
              style={{ marginTop: 10 }}
              id="standard-number"
              label="Grade (%)"
              type="number"
              onChange={handleGradeChange}
            />
            <Button
              style={{ marginTop: 10 }}
              variant="contained"
              onClick={handleSubmit}
              color="primary"
            >
              ADD
            </Button>
          </FormControl>
        </Grid>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Student ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Total completed</TableCell>
                <TableCell align="right">Total earnt</TableCell>
                <TableCell align="right">Current grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentGrades
                .map((grad) => {
                  console.log(grad);
                  return createData(
                    grad.student.username,
                    `${grad.student.firstname} ${grad.student.lastname}`,
                    grad.grades["total_completed"],
                    grad.grades["total_earnt"],
                    grad.grades["current_grade"],
                    grad.grades.items.map((item) => {
                      return {
                        assessmentName: item.assessment.name,
                        weight: item.assessment.weight,
                        grade: item.grade,
                      };
                    })
                  );
                })
                .map((row, index) => {
                  console.log(row);
                  return <Row key={index} row={row} />;
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};
export default TeacherGrades;
