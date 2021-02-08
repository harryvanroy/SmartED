import React, { useEffect } from "react";
import {
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AssessmentIcon from "@material-ui/icons/Assessment";
import FeedbackIcon from "@material-ui/icons/Feedback";
import SchoolIcon from "@material-ui/icons/School";
import ClassIcon from "@material-ui/icons/Class";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import HomeIcon from "@material-ui/icons/Home";
import ExitIcon from "@material-ui/icons/PowerSettingsNew";
import SyncIcon from "@material-ui/icons/Sync";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, Link, NavLink } from "react-router-dom";
import Assessment from "./components/Assessment";
import Course from "./components/Course";
import Feedback from "./components/Feedback";
import Goals from "./components/Goals";
import Grades from "./components/Grades";
import { Home } from "./components/Home";
import Study from "./components/StudySesh";
import Vark from "./components/Vark";
import SyncData from "./components/SyncData";
import axios from "axios";
import Cookies from "js-cookie";

const drawerWidth = 200;

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(9),
  },
  listItemText: {
    fontSize: "0.9em",
  },
}));

const StudentApp = ({ user }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [syncOpen, setSyncOpen] = React.useState(false);
  const [vark, setVark] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [currCourse, setCurrCourse] = React.useState();
  const [assessment, setAssessment] = React.useState([]);
  const [announcements, setAnnouncements] = React.useState([]);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSyncOpen = () => {
    setSyncOpen(true);
  };

  const handleSyncClose = () => {
    setSyncOpen(false);
  };

  const handleLogoutOpen = () => {
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  const LogOutDialog = () => {
    return (
      <Dialog open={logoutOpen} onClose={handleLogoutClose}>
        <DialogTitle>Confirm logout?</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 12 }}
            href="https://learn.uq.edu.au/webapps/login/?action=logout">
            YES, LOG ME OUT
          </Button>
          <Button onClick={handleLogoutClose}>NO</Button>
        </DialogContent>
      </Dialog>
    );
  };

  const SyncDialog = () => {
    return (
      <Dialog
        open={syncOpen}
        onClose={handleSyncClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Synchronise Your UQ Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            After providing your UQ username and password, all your UQ learning
            resources and announcements data will be pulled from blackboard so
            they can be displayed here! <b>Disclaimer:</b> we never store your
            UQ password, and only use it to log in to blackboard once on your
            behalf. After securely syncing your learning resources, you are
            logged out of blackboard and will need to provide your login details
            again to re-sync.
            <SyncData />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  };

  const setParentVarkScore = (score) => {
    setVark(score);
    axios(url + "/Database/vark/", {
      method: "post",
      data: {
        V: score["V"],
        A: score["A"],
        R: score["R"],
        K: score["K"],
      },
      withCredentials: true,
    });
  };

  useEffect(() => {
    axios(url + "/Database/student-courses/", {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      setCourses(res.data);
      let resp = [];
      let promises = [];

      let respAnnounce = [];
      let promisesAnnounce = [];
      res.data.forEach((course) => {
        promises.push(
          axios(url + `/Database/course-assessment/?id=${course.id}`, {
            method: "get",
            withCredentials: true,
          }).then((resAss) => {
            resp.push(
              [...new Set(resAss.data.map((o) => JSON.stringify(o)))].map((s) =>
                JSON.parse(s)
              )
            );
          })
        );
        promisesAnnounce.push(
          axios(url + `/Database/course-announcements/${course.id}/`, {
            method: "get",
            withCredentials: true,
          }).then((res) => {
            respAnnounce.push(res.data);
          })
        );
      });
      Promise.all(promises).then(() =>
        setAssessment([].concat.apply([], resp))
      );
      Promise.all(promisesAnnounce).then(() =>
        setAnnouncements([].concat.apply([], respAnnounce))
      );
    });
    axios(url + "/Database/vark/", {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      setVark({
        V: parseFloat(res.data.V),
        A: parseFloat(res.data.A),
        R: parseFloat(res.data.R),
        K: parseFloat(res.data.K),
      });
    });
  }, []);
  return (
    <Box className={classes.root}>
      <CssBaseline />
      <SyncDialog />
      <LogOutDialog />
      <AppBar position="fixed" style={{ backgroundColor: "#51237a" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap style={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
              <span role="img" aria-label="cap">
                🎓
              </span>
              SmartED
            </Link>
          </Typography>
          <IconButton
            onClick={handleLogoutOpen}
            style={{ textDecoration: "none", color: "unset" }}>
            <ExitIcon fontSize={"large"} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="My Courses" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {courses.map((a) => {
                  return (
                    <ListItem
                      onClick={() => setCurrCourse(a)}
                      key={a.id}
                      button
                      className={classes.nested}
                      component={NavLink}
                      to={"/course/" + a.name}>
                      <ListItemText
                        primary={a.name}
                        classes={{ primary: classes.listItemText }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
            {[
              "Assessment",
              "Course Goals",
              "My Grades",
              "Course Feedback",
              "VARK",
            ].map((text, index) => (
              <ListItem
                button
                key={text}
                component={NavLink}
                to={
                  ["/assessment", "/goals", "/grades", "/feedback", "/vark"][
                    index
                  ]
                }
                activeStyle={{ background: "rgb(0, 0, 0, 0.1)" }}>
                <ListItemIcon>
                  {
                    {
                      0: <AssessmentIcon />,
                      1: <EmojiEmotionsIcon />,
                      2: <SchoolIcon />,
                      3: <FeedbackIcon />,
                      4: <FingerprintIcon />,
                    }[index]
                  }
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}

            <ListItem button onClick={handleSyncOpen}>
              <ListItemIcon>
                <SyncIcon />
              </ListItemIcon>
              <ListItemText primary="Sync UQ Data" />
            </ListItem>
            <Study />
          </List>
        </div>
      </Drawer>
      <Box className={classes.content}>
        <Toolbar />
        <Switch>
          <Route path="/course/:name">
            <Course
              currCourse={currCourse}
              assessment={assessment}
              courses={courses}
              vark={vark}
            />
          </Route>
          <Route path="/assessment">
            <Assessment assessment={assessment} courses={courses} />
          </Route>
          <Route path="/feedback">
            <Feedback courses={courses} />
          </Route>
          <Route path="/goals">
            <Goals assessment={assessment} courses={courses} />
          </Route>
          <Route path="/grades">
            <Grades assessment={assessment} courses={courses} />
          </Route>
          <Route path="/vark">
            <Vark parentVark={vark} setParentVarkScore={setParentVarkScore} />
          </Route>
          <Route path="/">
            <Home
              vark={vark}
              assessment={assessment}
              courses={courses}
              announcements={announcements}
            />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default StudentApp;
