import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Progress from "react-circle-progress-bar";
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
  console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

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
    minWidth: 650,
  },
}));

function Grades({ courses, assessment }) {
  const [grades, setGrades] = React.useState([]);
  const classes = useStyles();

  useEffect(() => {
    let resp = [];
    let promises = [];
    courses.forEach((course) => {
      promises.push(
        axios(url + `/Database/get-grades/?id=${course.id}`, {
          method: "get",
          withCredentials: true,
        }).then((res) => {
          resp.push({
            assessmentInfo: res.data,
            courseInfo: course,
          });
        })
      );
    });
    Promise.all(promises).then(() =>
      setGrades(
        [].concat.apply(
          [],
          resp.sort(
            (a, b) =>
              b.assessmentInfo.total_earnt - a.assessmentInfo.total_earnt
          )
        )
      )
    );
  }, [courses]);

  if (grades.length === 0) {
    return null;
  }
  console.log(grades);
  return (
    <div>
      <Typography variant="h4">My Grades</Typography>
      <Grid style={{ marginTop: 5 }} container spacing={3}>
        {grades.map((grade) => (
          <Grid key={grade.courseInfo.id} item xs={12}>
            <Paper className={classes.paper} elavation={3}>
              <div className={classes.paperTitle}>
                <Typography variant="h5">{grade.courseInfo.name}</Typography>
              </div>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                  <Progress
                    style={{ marginRight: 30 }}
                    subtitle={`Progress for ${grade.courseInfo.name}`}
                    progress={grade.assessmentInfo.total_earnt}
                    gradient={[
                      { stop: 0.0, color: "#3f51b5" },
                      { stop: 1, color: "#3f51b5" },
                    ]}
                    hideBall
                  />
                  <Typography 
                  style={{ marginRight: 30 }}
                  variant="h6">Out of {grade.assessmentInfo.total_completed}%</Typography>
                </Box>
                <TableContainer
                  style={{ marginBottom: 10, marginTop: 10 }}
                  component={Paper}
                  elavation={3}
                >
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Assessment</TableCell>
                        <TableCell align="right">Grade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {grade.assessmentInfo.items.map((item) => (
                        <TableRow
                          style={
                            parseInt(item.grade) < 50
                              ? { backgroundColor: "rgba(255, 0, 0, 0.05)" }
                              : { backgroundColor: "rgba(0, 255, 0, 0.05)" }
                          }
                          key={item.assessment.name}
                        >
                          <TableCell component="th" scope="row">
                            {item.assessment.name}
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              {parseFloat(item.grade).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Grades;
