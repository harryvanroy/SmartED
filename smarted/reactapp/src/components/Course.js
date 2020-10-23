import React from 'react';
import Cookies from "js-cookie";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Box, Typography, ButtonBase, Button } from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { checkDate } from "./Home"

//DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  paperTitle: {
    textAlign: "center",
    fontSize: "1.5em",
    paddingBottom: "15px",
  },
}));

function Course({ course, assessment, resources, announcements }) {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="h4">
        Course: {course}
      </Typography>
      <Grid container justify="center" spacing={3} style={{ marginTop: 12 }}>
        <Grid item xs={8}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">
                    Announcements
                    <Link to={"./announcements"}>
                      <Button
                        style={{ marginLeft: 5 }}
                        color="primary">
                        View all
                      </Button>
                    </Link>
                  </Typography>
                </div>
                <Box style={{ maxHeight: 1052, overflow: "auto" }}>
                  {announcements
                    .sort(
                      (a, b) =>
                        Date.parse(b.dateAdded) - Date.parse(a.dateAdded)
                    )
                    .map((ann) => (
                      <ButtonBase key={ann.id} style={{ width: "100%" }}>
                        <Paper
                          //onClick={handleOpenDialog(ann)}
                          square
                          style={{
                            minHeight: 50,
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                          key={ann.id}
                          variant="outlined"
                        >
                          <Typography
                            style={{
                              flexGrow: 1,
                              textAlign: "left",
                              margin: 10,
                            }}
                          >
                            {ann.title}
                          </Typography>
                          <Typography
                            style={{
                              margin: 10,
                              color: "#51237a",
                            }}
                          >
                            {/*{
                              courses.filter(
                                (course) => course.id === ann.course
                              )[0].name
                            }*/}
                          </Typography>
                          <Typography style={{ margin: 10 }}>
                            {ann.dateAdded.slice(0, 10)}
                          </Typography>
                        </Paper>
                      </ButtonBase>
                    ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">
                    Recommended resources
                    <Link to={"./resources"}>
                      <Button
                        style={{ marginLeft: 5 }}
                        color="primary">
                        View all
                      </Button>
                    </Link>
                  </Typography>
                </div>
                <Box style={{ maxHeight: 1052, overflow: "auto" }}>
                  Hi
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5">Upcoming assessment</Typography>
                </div>
                <Box
                  style={{ maxHeight: 655, overflow: "auto" }}
                  flex={1}
                  flexDirection="column"
                >
                  <TableContainer
                    style={{ marginBottom: 20 }}
                    key={course.id}
                    component={Paper}
                    variant="outlined"
                  >
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">{course.name}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assessment
                          .filter(
                            (allAssess) =>
                              allAssess.course === course.id &&
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate()
                              ) < checkDate(allAssess.dateDescription)
                          )
                          .map((assessCourse) => {
                            let currentDate = new Date(
                              new Date().getFullYear(),
                              new Date().getMonth(),
                              new Date().getDate()
                            );
                            return (
                              <TableRow key={assessCourse.id}>
                                {checkDate(assessCourse.dateDescription) <
                                  currentDate.setDate(
                                    currentDate.getDate() + 7
                                  ) ? (
                                    <TableCell>
                                      <Typography>
                                        {assessCourse.name}{" "}
                                        <Button color="secondary">
                                          DUE SOON
                                      </Button>
                                      </Typography>
                                    </TableCell>
                                  ) : (
                                    <TableCell>
                                      <Typography>
                                        {assessCourse.name}
                                      </Typography>
                                    </TableCell>
                                  )}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Course;
