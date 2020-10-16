import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import axios from 'axios';

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

const TeacherGrades = ({ assessment, course }) => {
  const [grade, setGrade] = React.useState({
    "studentID": "",
    "assID": 0,
    "grade": 0
  });

  const handleAssessmentChange = (e) => {
    console.log(e.target.value);
    setGrade({ ...grade, assID: parseInt(e.target.value) });
  }

  const handleStudentIDChange = (e) => {
    console.log(e.target.value);
    setGrade({ ...grade, studentID: e.target.value });
  }
  
  const handleGradeChange = (e) => {
    console.log(e.target.value);
    setGrade({ ...grade, grade: parseInt(e.target.value) });
  }

  const handleSubmit = (e) => {
    console.log(e.target.value);
    console.log(grade);
    axios(url+'/Database/student-assessment-grade/', {
      method: "post",
      data: grade,
      withCredentials: true
    })
    .then(res => {
      console.log('posted grade..')
    });
  }

  return (
    <div>
      <FormControl style={{marginLeft: 6, marginRight: 6}} variant="outlined">
        <Select
          id="demo-simple-select-outlined"
          onChange={handleAssessmentChange}
        >
          {assessment.filter(ass => ass.course === course.id).map(e => 
            <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
          )}
        </Select>
        <TextField
          id="outlined-basic"
          placeholder="Student ID"
          variant="outlined"
          onChange={handleStudentIDChange}
        />
        <TextField
          id="standard-number"
          label="Number"
          type="number"
          onChange={handleGradeChange}
        />
        <Button variant="contained" onClick={handleSubmit} color="primary">
          ADD
        </Button>
      </FormControl>
    </div>
  )
}

export default TeacherGrades