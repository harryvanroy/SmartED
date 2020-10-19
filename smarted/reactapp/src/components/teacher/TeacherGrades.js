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

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const TeacherGrades = ({ assessment, course }) => {
  const [grade, setGrade] = React.useState({
    studentID: "",
    assID: 0,
    grade: 0,
  });
  const [studentsCourse, setStudentsCourse] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openErr, setOpenErr] = React.useState(false);

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
        <Grid item>
          <Typography style={{ marginBottom: 5, textAlign: "center" }}>
            Add Student Grade
          </Typography>
          <FormControl
            style={{
              marginLeft: 6,
              marginRight: 6,
              width: 1000,
            }}
            variant="outlined"
            fullWidth
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
      </Grid>
    </div>
  );
};

export default TeacherGrades;
