import React, { useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SubjectIcon from '@material-ui/icons/Subject';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import SchoolIcon from '@material-ui/icons/School';
import { Switch, Route, Link, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import TeacherResources from './components/teacher/TeacherResources';
import TeacherFeedback from './components/teacher/TeacherFeedback';
import Students from './components/teacher/Students';
import TeacherGrades from './components/teacher/TeacherGrades';
import TeacherHome from './components/teacher/TeacherHome';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import HomeIcon from '@material-ui/icons/Home';

const drawerWidth = 200;

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


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: '#51237a',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(9),
  },
  listItemText: {
    fontSize:'0.9em',
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 100,
  },
  selectBorder: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white'
    }
  }
}));

const TeacherApp = () => {
  const classes = useStyles();
  const [courses, setCourses] = React.useState(['MEME1000', 'TROL2001', 'HARI2022', 'XDXD200']);
  const [currentCourse, setCurrentCourse] = React.useState(courses[0]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap style={{flexGrow: 1}}>
            <Link to='/' style={{ textDecoration: 'none', color: 'unset' }}>
              SmartED
            </Link>
          </Typography>
          <FormControl style={{marginRight: 11, marginTop: 5, marginBottom: 5}}variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label" style={{color: 'white'}} >Course</InputLabel>
            <Select
              value={currentCourse}
              className={classes.selectBorder}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Course"
              style={{color: 'white'}}
              onChange={(e) => setCurrentCourse(e.target.value)}
              >
              {courses.map((a, index) => (
                <MenuItem key={index} value={a}> {a} </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Link to='/' style={{ textDecoration: 'none', color: 'unset' }}>
            <HomeIcon fontSize={'large'}/>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {['Students', 'Resources', 'Grades', 'Feedback'].map((text, index) => (
                <ListItem 
                  button key={text} component={NavLink} 
                  to={['/teacherstudents', '/teacherresources', '/teachergrades', '/teacherfeedback'][index]} 
                  activeStyle={{ background: 'rgb(0, 0, 0, 0.1)'}}
                >
                  <ListItemIcon>
                  {
                    { 
                      0: <SupervisedUserCircleIcon />,
                      1: <SubjectIcon />,
                      2: <SchoolIcon />,
                      3: <FeedbackIcon />,
                    }[index]
                  }
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Switch>
          <Route path="/teacherstudents">
            <Students course={currentCourse} />
          </Route>
          <Route path="/teacherresources">
            <TeacherResources course={currentCourse} />
          </Route>
          <Route path="/teachergrades">
            <TeacherGrades course={currentCourse} />
          </Route>
          <Route path="/teacherfeedback">
            <TeacherFeedback course={currentCourse} />
          </Route>
          <Route path="/">
            <TeacherHome course={currentCourse} />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default TeacherApp;