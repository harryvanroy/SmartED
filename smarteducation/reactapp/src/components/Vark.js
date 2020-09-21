import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Container, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 1000,
    flexGrow: 1,
  }
});

const questions = [
  {
    question_num: 1,
    text: 'I need to find the way to a shop that a friend has recommended. I would:',
    a: 'find out where the shop is in relation to somewhere I know.',
    b: 'ask my friend to tell me the directions.',
    c: 'write down the street directions I need to remember.',
    d: 'use a map.',
  },
  {
    question_num: 2,
    text: 'A website has a tutorial showing how to make a special graph or chart. I would learn most from:',
    a: 'seeing diagrams.',
    b: 'listening to a narrator.',
    c: 'reading the instructions.',
    d: 'watching the actions in a video.',
  },
  {
    question_num: 3,
    text: 'I want to find out more about a tour that I am going on. I would:',
    a: 'look at details about the highlights and activities on the tour.',
    b: 'use a map and see where the places are.',
    c: 'read about the tour on the itinerary.',
    d: 'talk with the person who planned the tour or others who are going on the tour.',
  },
  {
    question_num: 4,
    text: 'When choosing a career or area of study, these are important for me:',
    a: 'Applying my knowledge in real situations.',
    b: 'Communicating with others through discussion.',
    c: 'Working with designs, maps or charts.',
    d: 'Using words well in written communications.',
  },
  {
    question_num: 5,
    text: 'When I am learning I:',
    a: 'like to talk things through.',
    b: 'see patterns in things.',
    c: 'use examples and applications.',
    d: 'read books, articles and handouts.',
  },
  {
    question_num: 6,
    text: 'I want to save more money and to decide between a range of options. I would:',
    a: 'consider examples of each option using my financial information.',
    b: 'read a print brochure that describes the options in detail.',
    c: 'use graphs showing different options for different time periods.',
    d: 'talk with an expert about the options.',
  },
  {
    question_num: 7,
    text: 'I want to learn how to play a new board game or card game. I would:',
    a: 'watch others play the game before joining in.',
    b: 'listen to somebody explaining it and ask questions.',
    c: 'use the diagrams that explain the various stages, moves and strategies in the game.',
    d: 'read the instructions.',
  },
  {
    question_num: 8,
    text: 'I have a problem with my heart. I would prefer that the doctor:',
    a: 'gave me something to read to explain what was wrong.',
    b: 'used a plastic model to show me what was wrong.',
    c: 'described what was wrong.',
    d: 'showed me a diagram of what was wrong.',
  },
  {
    question_num: 9,
    text: 'I want to learn to do something new on a computer. I would:',
    a: 'read the written instructions that came with the program.',
    b: 'talk with people who know about the program.',
    c: 'start using it and learn by trial and error.',
    d: 'follow the diagrams in a book.',
  },
  {
    question_num: 10,
    text: 'When learning from the Internet I like:',
    a: 'videos showing how to do or make things.',
    b: 'interesting design and visual features.',
    c: 'interesting written descriptions, lists and explanations.',
    d: 'audio channels where I can listen to podcasts or interviews.',
  },
  {
    question_num: 11,
    text: 'I want to learn about a new project. I would ask for:',
    a: 'diagrams to show the project stages with charts of benefits and costs.',
    b: 'a written report describing the main features of the project.',
    c: 'an opportunity to discuss the project.',
    d: 'examples where the project has been used successfully.',
  },
  {
    question_num: 12,
    text: 'I want to learn how to take better photos. I would:',
    a: 'ask questions and talk about the camera and its features.',
    b: 'use the written instructions about what to do.',
    c: 'use diagrams showing the camera and what each part does.',
    d: 'use examples of good and poor photos showing how to improve them.',
  },
  {
    question_num: 13,
    text: 'I prefer a presenter or a teacher who uses:',
    a: 'demonstrations, models or practical sessions.',
    b: 'question and answer, talk, group discussion, or guest speakers.',
    c: 'handouts, books, or readings.',
    d: 'diagrams, charts, maps or graphs.',
  },
  {
    question_num: 14,
    text: 'I have finished a competition or test and I would like some feedback. I would like to have feedback:',
    a: 'using examples from what I have done.',
    b: 'using a written description of my results.',
    c: 'from somebody who talks it through with me.',
    d: 'using graphs showing what I achieved.',
  },
  {
    question_num: 15,
    text: 'I want to find out about a house or an apartment. Before visiting it I would want:',
    a: 'to view a video of the property.',
    b: 'a discussion with the owner.',
    c: 'a printed description of the rooms and features.',
    d: 'a plan showing the rooms and a map of the area.',
  },
  {
    question_num: 16,
    text: 'I want to assemble a wooden table that came in parts (kitset). I would learn best from:',     
    a: 'diagrams showing each stage of the assembly.',
    b: 'advice from someone who has done it before.',
    c: 'written instructions that came with the parts for the table.',
    d: 'watching a video of a person assembling a similar table.',
  },
]; 

const scoring = [
  ['K', 'A', 'R', 'V'],
  ['V', 'A', 'R', 'K'],
  ['K', 'V', 'R', 'A'],
  ['K', 'A', 'V', 'R'],
  ['A', 'V', 'K', 'R'],
  ['K', 'R', 'V', 'A'],
  ['K', 'A', 'V', 'R'],
  ['R', 'K', 'A', 'V'],
  ['R', 'A', 'K', 'V'],
  ['K', 'V', 'R', 'A'],
  ['V', 'R', 'A', 'K'],
  ['A', 'R', 'V', 'K'],
  ['K', 'A', 'R', 'V'],
  ['K', 'R', 'A', 'V'],
  ['K', 'A', 'R', 'V'],
  ['V', 'A', 'R', 'K'],
];

export default function Vark(parentVarkScore) {
  const classes = useStyles();
  const theme = useTheme();
  const [varkScore, setVarkScore] = React.useState({parentVarkScore});

  const [state, setState] = React.useState({ 
    checkedA0 : false, checkedB0 : false, checkedC0 : false, checkedD0 : false,
    checkedA1 : false, checkedB1 : false, checkedC1 : false, checkedD1 : false,
    checkedA2 : false, checkedB2 : false, checkedC2 : false, checkedD2 : false,
    checkedA3 : false, checkedB3 : false, checkedC3 : false, checkedD3 : false,
    checkedA4 : false, checkedB4 : false, checkedC4 : false, checkedD4 : false,
    checkedA5 : false, checkedB5 : false, checkedC5 : false, checkedD5 : false,
    checkedA6 : false, checkedB6 : false, checkedC6 : false, checkedD6 : false,
    checkedA7 : false, checkedB7 : false, checkedC7 : false, checkedD7 : false,
    checkedA8 : false, checkedB8 : false, checkedC8 : false, checkedD8 : false,
    checkedA9 : false, checkedB9 : false, checkedC9 : false, checkedD9 : false,
    checkedA10 : false, checkedB10 : false, checkedC10 : false, checkedD10 : false,
    checkedA11 : false, checkedB11 : false, checkedC11 : false, checkedD11 : false,
    checkedA12 : false, checkedB12 : false, checkedC12 : false, checkedD12 : false,
    checkedA13 : false, checkedB13 : false, checkedC13 : false, checkedD13 : false,
    checkedA14 : false, checkedB14 : false, checkedC14 : false, checkedD14 : false,
    checkedA15 : false, checkedB15 : false, checkedC15 : false, checkedD15 : false,
  });

  const handleChange = (event, key) => {
    setState({ ...state, [event.target.name+String(key)] : event.target.checked});
  };

  const scores = {
    'V' : 0,
    'A' : 0,
    'R' : 0,
    'K' : 0,
  };

  const saveResults = () => {
    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 4; j++) {
        if (state["checked"+String.fromCharCode(j+65)+String(i)] == true) {
          scores[scoring[i][j]] += 1;
        }
      }
    }
    var total_answers = scores['V']+scores['A']+scores['R']+scores['K'];
    if (total_answers > 0) {
      console.log("V: ", scores['V']/total_answers);
      console.log("A: ", scores['A']/total_answers);
      console.log("R: ", scores['R']/total_answers);
      console.log("K: ", scores['K']/total_answers);
      setVarkScore(scores);
    }
  };


  return (
    <Box width="80%">
      <Box m={5}>
        <Typography variant="h4">
          VARK quiz
        </Typography>
        <Typography variant="h6">
          Choose the responses you most align with (you can select multiple options for each question)
        </Typography>
      </Box>

      {questions.map((question, index) => ( 
        <Box m={5} key={index}>
          <FormControl component="fieldset">
            <Typography variant="h6">
              {"Question " + String(index+1) + "\n"}
            </Typography>
            <Typography variant="h5">
              {question.text}
            </Typography>
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                control={<Checkbox color="primary" onChange={(e)=>handleChange(e, index)} name="checkedA" />}
                label={question.a}
                labelPlacement="end"
              />
            </FormGroup>
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                control={<Checkbox color="primary" onChange={(e)=>handleChange(e, index)} name="checkedB" />}
                label={question.b}
                labelPlacement="end"
              />
            </FormGroup>
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                control={<Checkbox color="primary" onChange={(e)=>handleChange(e, index)} name="checkedC" />}
                label={question.c}
                labelPlacement="end"
              />
            </FormGroup>
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                control={<Checkbox color="primary" onChange={(e)=>handleChange(e, index)} name="checkedD"/>}
                label={question.d}
                labelPlacement="end"
              />
            </FormGroup>
            <Typography>
              
            </Typography>
          </FormControl>
        </Box>
      ))}
      <Box m={5}>
        <Button variant="contained" color="primary" size="large" onClick={saveResults}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
