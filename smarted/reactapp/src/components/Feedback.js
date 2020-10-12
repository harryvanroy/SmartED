import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  }
}));

function Feedback({ courses }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    course: '',
    text: '',
    anon: false
  });

  const handleCourseChange = (event) => {
    setState({ ...state, course: event.target.value});
  }

  const handleTextChange = (event) => {
    setState({ ...state, text: event.target.value});
  }

  const handleAnonChange = (event) => {
    setState({ ...state, anon: event.target.checked});
  }

  const handleSubmit = () => {
    console.log(state);
  }
  

  return (
    <Box width="80%">
      <Typography variant="h4">
        Course Feedback
      </Typography>
      
      <Box m={2}>
        <FormControl style={{marginBottom: 12}} variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Course</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Course"
            onChange={handleCourseChange}
          >
            {courses.map((a, index) => (
              <MenuItem key={index} value={a.id}> {a.name} </MenuItem>
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
              control={<Checkbox color="primary" onChange={handleAnonChange}/>}
              label="Anonymous? (Constructive feedback only. Bullying or hate speech will not be tolerated)"
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
        <br />
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          SEND TO COURSE STAFF
        </Button>
        <Link to="/">
          <Button color="primary" size="large"> 
            Back
          </Button>
        </Link>
      </Box>  
    </Box>
  )
};

export default Feedback;
