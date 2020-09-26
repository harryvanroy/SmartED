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
import Collapse from '@material-ui/core/Collapse';

import { makeStyles } from '@material-ui/core/styles';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SubjectIcon from '@material-ui/icons/Sort';
import SchoolIcon from '@material-ui/icons/School';
import ClassIcon from '@material-ui/icons/Class';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FingerprintIcon from '@material-ui/icons/Fingerprint';

import { Switch, Route, Link, NavLink } from 'react-router-dom';
import Assessment from './components/Assessment';
import Feedback from './components/Feedback';
import Goals from './components/Goals';
import Grades from './components/Grades';
import Resources from './components/Resources';
import Home from './components/Home';
import Vark from './components/Vark';
import axios from 'axios';
const drawerWidth = 200;

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
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [vark, setVark] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [assessment, setAssessment] = React.useState([]);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [key, setKey] = React.useState(null);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSubmit = (event) => {
    axios
      .post('http://localhost:8000/Database/login-post/', {
        "username": username,
        "password": password
      })
      .then(res => {
        setKey(res.data.key);
      });
    setUsername('');
    setPassword('');
    event.preventDefault();
  }

  const handleChangeUsername = (event) => {
    console.log(event.target.value)
    setUsername(event.target.value);
  }

  const handleChangePassword = (event) => {
    console.log(event.target.value)
    setPassword(event.target.value);
  }

  useEffect(() => {
    if (key != null) {
      axios
        .post('http://localhost:8000/Database/student-courses/', {
          "username": username, 
          "key": key
        })
        .then(res => {
          setCourses(res.data);
          let resp = [];
          let promises = [];
          res.data.map(course => {
            promises.push(
              axios
              .post('http://localhost:8000/Database/course-assessment/', {'id': course.id})
              .then(resAss => {
                resp.push([...new Set(resAss.data
                  .map(o => JSON.stringify(o)))]
                  .map(s => JSON.parse(s)));
              })
            );
          });
          Promise.all(promises).then(() => setAssessment([].concat.apply([], resp)));
        });
    }
  }, [key]);

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
          <form onSubmit={handleSubmit}>
            <label style={{margin: '5px'}}>
              Username:
              <input style={{width: '100px'}} type="text" onChange={handleChangeUsername} />
            </label>
            <label style={{margin: '5px'}}>
              Password:
              <input style={{width: '100px'}} type="password" onChange={handleChangePassword} />
            </label>
            <input type="submit" value="Submit" />
          </form>
            {Object.keys(vark).length === 4 ? <div> {vark.V} {vark.A} {vark.R} {vark.K} </div>: <div> Please complete VARK quiz </div>}
          <AccountCircleIcon style={{marginLeft: 5}}/>
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
            <ListItem button onClick={handleClick}>
              <ListItemIcon><ClassIcon /></ListItemIcon>
              <ListItemText primary="Courses" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {courses.map(a => a.name).map((text, index) => (
                  <ListItem key ={index} button className={classes.nested}>
                    <ListItemText primary={text} classes={{primary:classes.listItemText}}/>
                  </ListItem>
                ))}
              </List>
            </Collapse>
              {['Assessment', 'Course Goals', 'My Grades', 'Resources', 'Personal Feedback', 'VARK'].map((text, index) => (
                <ListItem 
                  button key={text} component={NavLink} 
                  to={['/assessment', '/goals', '/grades', '/resources', '/feedback', '/vark'][index]} 
                  activeStyle={{ background: 'rgb(0, 0, 0, 0.1)'}}
                >
                  <ListItemIcon>
                  {
                    { 
                      0: <AssessmentIcon />,
                      1: <EmojiEmotionsIcon />,
                      2: <SchoolIcon />,
                      3: <SubjectIcon />,
                      4: <FeedbackIcon />,
                      5: <FingerprintIcon />
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
          <Route path="/assessment">
            <Assessment />
          </Route>
          <Route path="/feedback">
            <Feedback />
          </Route>
          <Route path="/goals">
            <Goals />
          </Route>
          <Route path="/grades">
            <Grades />
          </Route>
          <Route path="/resources">
            <Resources />
          </Route> 
          <Route path="/vark">
            <Vark parentVark={vark} setParentVarkScore={setParentVarkScore}/>
          </Route>      
          <Route path="/">
            <Home assessment={assessment} courses={courses}/>
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
