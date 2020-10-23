import React, { useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import { Button, Box, Typography } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import SubjectIcon from "@material-ui/icons/Subject";
import FeedbackIcon from "@material-ui/icons/Feedback";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import SchoolIcon from "@material-ui/icons/School";
import { Switch, Route, Link, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import TeacherResources from "./components/teacher/TeacherResources";
import TeacherFeedback from "./components/teacher/TeacherFeedback";
import Students from "./components/teacher/Students";
import TeacherGrades from "./components/teacher/TeacherGrades";
import TeacherHome from "./components/teacher/TeacherHome";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import HomeIcon from "@material-ui/icons/Home";
import DeleteIcon from "@material-ui/icons/Delete";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";

import axios from "axios";

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
  formControl: {
    margin: theme.spacing(0),
    minWidth: 100,
  },
}));

const TeacherApp = ({ user }) => {
  const classes = useStyles();
  const [editCourseOpen, setEditCourseOpen] = React.useState(false);
  const [addCourseCode, setAddCourseCode] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [feedback, setFeedback] = React.useState([]);
  const [currentCourse, setCurrentCourse] = React.useState(
    JSON.parse(localStorage.getItem("currentCourse"))
  );
  const [assessment, setAssessment] = React.useState([]);

  useEffect(() => {
    axios(url + "/Database/teacher-courses/", {
      method: "get",
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        setCourses(res.data);
        console.log(res.data[0]);
        if (currentCourse === null) {
          setCurrentCourse(res.data[0]);
          localStorage.setItem("currentCourse", JSON.stringify(res.data[0]));
        }
        //setCurrentCourse(res.data[0])
        let resp = [];
        let promises = [];
        res.data.forEach((course) => {
          promises.push(
            axios(url + `/Database/course-assessment/?id=${course.id}`, {
              method: "get",
              withCredentials: true,
            }).then((resAss) => {
              resp.push(
                [
                  ...new Set(resAss.data.map((o) => JSON.stringify(o))),
                ].map((s) => JSON.parse(s))
              );
            })
          );
        });
        Promise.all(promises).then(() =>
          setAssessment([].concat.apply([], resp))
        );
      })
      .then((res) => {
        axios(url + `/Database/get-course-feedback/?id=${currentCourse.id}`, {
          method: "get",
          withCredentials: true,
        }).then((res) => {
          setFeedback(res.data);
        });
      });
  }, [currentCourse]);

  const handleEditCourseOpen = () => {
    setEditCourseOpen(true);
  };

  const handleEditCourseClose = () => {
    setEditCourseOpen(false);
  };

  const handleAddCourseChange = (event) => {
    setAddCourseCode(event.target.value);
  };

  const handleAddCourseSubmit = () => {
    console.log(addCourseCode);
    axios(url + "/Database/add-teacher-course/", {
      method: "post",
      data: { course: addCourseCode },
      withCredentials: true,
    }).then((res) => {
      console.log("successfully added");
    });
    //todo: catch error and maybe adding... progress 
    // and update courses immediately
  };

  const handleDeleteCourse = (a) => {
    axios(url + "/Database/delete-teacher-course/?id=" + String(a.id), {
      method: "delete",
      withCredentials: true,
    }).then((res) => {
      console.log("successfully deleted");
      courses.filter((course) => course.id !== a.id);
    });
    //todo: update courses immediately
  };

  function editCoursesDialog() {
    return (
      <Dialog
        open={editCourseOpen}
        onClose={handleEditCourseClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Courses</DialogTitle>
        <DialogContent>
          {courses.map((a) => (
            <Box display="flex" justifyContent="spaceBetween">
              <MenuItem style={{ width: "80%" }}>{a.name}</MenuItem>
              <MenuItem
                value="del"
                value={a}
                onClick={() => handleDeleteCourse(a)}
              >
                <DeleteIcon value="del" />
              </MenuItem>
            </Box>
          ))}
          <DialogContentText style={{ color: "black" }}>
            <Box display="flex" justifyContent="center">
              <FormControl fullWidth>
                <Input
                  style={{ margin: 12 }}
                  placeholder="Course code"
                  variant="outlined"
                  onChange={handleAddCourseChange}
                />
              </FormControl>
              <Button
                style={{ margin: 12 }}
                onClick={handleAddCourseSubmit}
                variant="contained"
              >
                Add
              </Button>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

  const handleCourseChange = (e) => {
    console.log(e);
    if (e.target.value === "edit") {
      handleEditCourseOpen();
    } else {
      localStorage.setItem("currentCourse", JSON.stringify(e.target.value));
      setCurrentCourse(e.target.value);
    }
  };

  if (!currentCourse) {
    return null;
  }
  return (
    <div>
      <div className={classes.root}>
        {editCoursesDialog()}
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
            <Typography style={{ marginRight: 20 }}>
              {currentCourse.name}
            </Typography>
            <FormControl
              style={{ marginRight: 18, marginTop: 5, marginBottom: 5 }}
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel
                id="demo-simple-select-outlined-label"
                style={{ color: "white" }}
              >
                Course
              </InputLabel>
              <Select
                value=""
                className={classes.selectBorder}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="Course"
                style={{ color: "white" }}
                onChange={handleCourseChange}
              >
                {courses.map((a) => (
                  <MenuItem key={a.name} value={a}>
                    {a.name}
                  </MenuItem>
                ))}
                <MenuItem key="edit" value="edit">
                  Edit Courses
                </MenuItem>
              </Select>
            </FormControl>
            <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
              <HomeIcon fontSize={"large"} />
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
              {["Students", "Resources", "Grades", "Feedback"].map(
                (text, index) => (
                  <ListItem
                    button
                    key={text}
                    component={NavLink}
                    exact
                    to={
                      [
                        "/",
                        "/teacherresources",
                        "/teachergrades",
                        "/teacherfeedback",
                      ][index]
                    }
                    activeStyle={{ background: "rgb(0, 0, 0, 0.1)" }}
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
                )
              )}
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route path="/teacherresources">
              <TeacherResources course={currentCourse} />
            </Route>
            <Route path="/teachergrades">
              <TeacherGrades assessment={assessment} course={currentCourse} />
            </Route>
            <Route path="/teacherfeedback">
              <TeacherFeedback feedback={feedback} />
            </Route>
            <Route path="/">
              <Students course={currentCourse} />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default TeacherApp;
