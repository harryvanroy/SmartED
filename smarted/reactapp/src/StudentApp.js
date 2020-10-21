import React, { useEffect } from "react";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import { makeStyles } from "@material-ui/core/styles";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AssessmentIcon from "@material-ui/icons/Assessment";
import FeedbackIcon from "@material-ui/icons/Feedback";
import SubjectIcon from "@material-ui/icons/Sort";
import SchoolIcon from "@material-ui/icons/School";
import ClassIcon from "@material-ui/icons/Class";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import HomeIcon from "@material-ui/icons/Home";
import SyncIcon from "@material-ui/icons/Sync";

import { Switch, Route, Link, NavLink } from "react-router-dom";
import Assessment from "./components/Assessment";
import Course from "./components/Course";
import Feedback from "./components/Feedback";
import Goals from "./components/Goals";
import Grades from "./components/Grades";
import Resources from "./components/Resources";
import { Home, checkDate } from "./components/Home";
import Vark from "./components/Vark";
import axios from "axios";
import Cookies from "js-cookie";

import Study from "./components/StudySesh";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

import SyncData from "./components/SyncData";

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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "#51237a",
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

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSyncOpen = () => {
    setSyncOpen(true);
  };

  const handleSyncClose = () => {
    setSyncOpen(false);
  };

  function syncDialog() {
    return (
      <Dialog
        open={syncOpen}
        onClose={handleSyncClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Syncronise Your UQ Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            After providing your UQ username and password, all your UQ learning
            resources and announcements data will be pulled from blackboard so
            they can be displayed here!
            <SyncData />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

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
  console.log(announcements);
  return (
    <div className={classes.root}>
      {syncDialog()}

      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap /*style={{flexGrow: 1}}*/>
            <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
              SmartED
            </Link>
          </Typography>
          <Typography style={{ marginLeft: 20, flexGrow: 1 }}>
            Welcome {user.firstname}!
          </Typography>
          <Study />
          <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
            <HomeIcon style={{ marginLeft: 10 }} fontSize={"large"} />
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
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {courses
                  .map((a) => a.name)
                  .map((text, index) => {
                    return (
                      <ListItem
                        onClick={() => setCurrCourse(text)}
                        key={index}
                        button
                        className={classes.nested}
                        component={NavLink}
                        to={"/course/" + text}
                      >
                        <ListItemText
                          primary={text}
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
              "Resources",
              "Course Feedback",
              "VARK",
            ].map((text, index) => (
              <ListItem
                button
                key={text}
                component={NavLink}
                to={
                  [
                    "/assessment",
                    "/goals",
                    "/grades",
                    "/resources",
                    "/feedback",
                    "/vark",
                  ][index]
                }
                activeStyle={{ background: "rgb(0, 0, 0, 0.1)" }}
              >
                <ListItemIcon>
                  {
                    {
                      0: <AssessmentIcon />,
                      1: <EmojiEmotionsIcon />,
                      2: <SchoolIcon />,
                      3: <SubjectIcon />,
                      4: <FeedbackIcon />,
                      5: <FingerprintIcon />,
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
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Switch>
          <Route path="/course/:name">
            <Course course={currCourse} />
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
          <Route path="/resources">
            <Resources />
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
      </main>
    </div>
  );
};

export default StudentApp;
