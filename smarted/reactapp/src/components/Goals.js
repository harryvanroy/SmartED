import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Box, Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  }
}));

function Goals({ courses }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    course: '',
    type: 0,
    grade: 0,
    hours: 0,
    assessment: '',
    text: ''
  });

  const handleCourseChange = (event) => {
    setState({ ...state, course: event.target.value});
  }

  const handleTextChange = (event) => {
    setState({ ...state, text: event.target.value});
  }

  const handleHoursChange = (event) => {
    setState({ ...state, hours: parseInt(event.target.value)});
  }

  const handleGoalChange = (event) => {
    setState({ ...state, type: event.target.value, grade: 0, hours: 0, assessment: '', text: ''});
  }

  const handleAssessmentChange = (event) => {
    setState({ ...state, assessment: event.target.value});
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }
  
  const handleSubmit = () => {
    console.log(state);
  }

  const drawOverallGoal = () => {
    if (state.type == 1 && state.course != '') {
      return (
        <Box>
          Get grade 
          <FormControl style={{marginLeft: 6, marginRight: 6}} variant="outlined">
            <Select
              id="demo-simple-select-outlined"
              onChange={handleCourseChange}
            >
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
      )
    }
  };

  const drawAssessmentGoal = () => {
    if (state.type == 2 && state.course != '') {
      return (
        <Box>
          Get grade 
          <FormControl style={{marginLeft: 6, marginRight: 6}} variant="outlined">
            <Select
              id="demo-simple-select-outlined"
              onChange={handleCourseChange}
            >
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
          <FormControl style={{marginLeft: 6, marginRight: 6}} variant="outlined">
            <Select
              id="demo-simple-select-outlined"
              onChange={handleAssessmentChange}
            >
              <MenuItem value={'a1'}> a1</MenuItem>
              <MenuItem value={'a2'}> a2</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )
    }
  };

  const drawStudyGoal = () => {
    if (state.type == 3 && state.course != '') {
      return (
        <Box>
          Spend
          <FormControl style={{marginLeft: 6, marginRight: 6, maxWidth: 80}}>
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
    if (state.type == 4 && state.course != '') {
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
  
  return (
    <Box width="80%">
      <Typography variant="h4">
        Course Goals
      </Typography>
      
      <Box m={2}>
        <Button variant="contained" color="primary" size="large" onClick={handleOpen}>
          ADD GOAL
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Goal</DialogTitle>
        <DialogContent>
          <Box m={2}>
          <FormControl style={{marginBottom: 12}, {marginRight: 6}} variant="outlined" className={classes.formControl}>
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
          </FormControl> {' '}
          <FormControl style={{marginBottom: 12}} variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Goal type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Course"
              onChange={handleGoalChange}
            >
              <MenuItem value={1}> Overall grade </MenuItem>
              <MenuItem value={2}> Specific assessment grade </MenuItem>
              <MenuItem value={3}> Weekly study time </MenuItem>
              <MenuItem value={4}> Custom goal </MenuItem>
            </Select>
          </FormControl>
          {drawOverallGoal()}
          {drawAssessmentGoal()}
          {drawStudyGoal()}
          {drawTextField()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            ADD
          </Button>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
        </DialogActions>
        </Dialog>
        <Link to="/">
          <Button color="primary" size="large"> 
            Back
          </Button>
        </Link>
      </Box>  
    </Box>
  )
};

export default Goals;
