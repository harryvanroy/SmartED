import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import VarkChart from "../VarkChart";
import Cookies from "js-cookie";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}

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

const Students = ({ course }) => {
  const [vark, setVark] = React.useState({
    V: 0.25,
    A: 0.25,
    R: 0.25,
    K: 0.25,
  });
  const [studentsAtRisk, setStudentsAtRisk] = React.useState([]);
  const classes = useStyles();

  const GetCourseVARK = ({ id }) => {
    axios(url + "/Database/course-average-vark/?id=" + course.id, {
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
  };

  useEffect(() => {
    GetCourseVARK(course.id);

    axios(url + `/Database/students-at-risk/?id=${course.id}`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setStudentsAtRisk(res.data);
    });
  }, [course]);

  return (
    <div>
      <Grid container justify="center" spacing={3} style={{ minWidth: 550 }}>
        <Grid item xs={8}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <TableContainer
                style={{ marginBottom: 10, height: 650 }}
                component={Paper}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 7,
                  }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">Students at risk</Typography>
                </div>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell align="right">Current grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentsAtRisk.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.student.username} ({row.student.firstname}{" "}
                          {row.student.lastname})
                        </TableCell>
                        <TableCell align="right">{row.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5">Course VARK Summary</Typography>
                </div>
                {isNaN(vark.V) ? (
                  <Typography align="center">
                    Students have not completed VARK survey
                  </Typography>
                ) : (
                  <VarkChart V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Students;
