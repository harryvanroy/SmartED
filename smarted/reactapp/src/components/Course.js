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

function Course({ currCourse, assessment, courses }) {
  const classes = useStyles();

  console.log(courses);
  console.log(currCourse);

  return (
    <Box>
      <Typography variant="h4">
        Course: {currCourse}
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
                    Resources
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
                  {courses.filter(course => course.name === currCourse).map((course) => (
                    <TableContainer
                      style={{ marginBottom: 20 }}
                      key={course.id}
                      component={Paper}
                      variant="outlined"
                    >
                      <Table aria-label="simple table">
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
                  ))}
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
