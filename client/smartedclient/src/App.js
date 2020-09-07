import React from 'react';

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

import { Switch, Route, Link, NavLink } from 'react-router-dom';
import Assessment from './components/Assessment';
import Feedback from './components/Feedback';
import Goals from './components/Goals';
import Grades from './components/Grades';
import Resources from './components/Resources';
import Home from './components/Home';
import Vark from './components/Vark';

import { ReactComponent as Logo } from './logo.svg';
const drawerWidth = 240;

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
  listItemText:{
    fontSize:'0.9em',
  },
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [vark, setVark] = React.useState([]);

  const handleClick = () => {
    setOpen(!open);
  };

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
          {vark.length == 0 ? <div>Vark quiz score:</div>: <div>Please complete vark quiz</div>}
          <AccountCircleIcon style={{paddingLeft: 5}}/>
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
                {/* Hard coded course codes */}
                {['DECO3801', 'COMP3301', 'MATH3204', 'STAT2004'].map((text, index) => (
                  <ListItem button className={classes.nested}>
                    <ListItemText primary={text} classes={{primary:classes.listItemText}}/>
                  </ListItem>
                ))}
              </List>
            </Collapse>
              {['Assessment', 'Course Goals', 'My Grades', 'Resources', 'Personal Feedback'].map((text, index) => (
                <ListItem 
                  focusRippleColor="" touchRippleColor="red"
                  button key={text} component={NavLink} 
                  to={['/assessment', '/goals', '/grades', '/resources', '/feedback'][index]} 
                  activeStyle={{ background: 'rgb(0, 0, 0, 0.1)'}}
                >
                  <ListItemIcon>
                  {
                    { 
                      0: <AssessmentIcon />,
                      1: <EmojiEmotionsIcon />,
                      2: <SchoolIcon />,
                      3: <SubjectIcon />,
                      4: <FeedbackIcon />
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
            <Vark />
          </Route>      
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
