import React from "react";
import Cookies from "js-cookie";
import { Box, Typography } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Home, checkDate } from "./Home";


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
  table: {
  },
}));


function Assessment({ assessment, courses }) {
  const classes = useStyles();
  console.log(courses);

  return (
    <div>
      <Typography variant="h4">Assessment</Typography>
      <Grid style={{ marginTop: 5 }} container spacing={3}>
        {courses.map((course) => (
          <Grid key={course.id} item xs={6}>
            <Paper className={classes.paper} elavation={3}>
              <div className={classes.paperTitle}>
                <Typography variant="h5">{course.name}</Typography>
              </div>
              <TableContainer
                style={{ marginBottom: 10, marginTop: 10, width: "100%" }}
                component={Paper}
                elavation={3}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "50%" }}>Assessment</TableCell>
                      <TableCell align="center">Weight</TableCell>
                      <TableCell align="right">Due Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assessment
                      .filter(
                        (allAssess) =>
                          allAssess.course === course.id
                      )
                      .map((item) => (
                        <TableRow
                          key={item.id}
                        >
                          <TableCell component="th" scope="row" style={{width: "50%"}}>
                            {item.name}
                          </TableCell>
                          <TableCell align="center">
                            {item.weight}%
                          </TableCell>
                          <TableCell align="right">
                            {item.dateDescription}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Assessment;
