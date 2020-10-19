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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import Latex from 'react-latex';

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

let currentDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);

function calculatePriority(item) {
  return (item.weight / (1 + Math.log(checkDate(item.dateDescription) - currentDate.getDate())));
}


function Assessment({ assessment, courses }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handlePriorityOpen = () => {
    setOpen(true);
  };

  const handlePriorityClose = () => {
    setOpen(false);
  };

  return (

    <div>
      <Dialog
        open={open}
        onClose={handlePriorityClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Priority</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            The priority value is calcuated with consideration for the weighting and due date of the assessment.
            An assignment with a higher priority value indicates a more crucial upcoming assignment.
            <br></br>
            The priority is calculated with the following:
            <br></br>
          </DialogContentText>
          <h3>
            <Latex displayMode={true}>$weighting \div \ln(1 + daysleft)$</Latex>
          </h3>
        </DialogContent>
      </Dialog>

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
                      <TableCell align="left">
                        <Button align="left"
                          style={{ marginLeft: 5, textTransform: "none" }}
                          color="primary"
                          onClick={handlePriorityOpen}
                        >
                          Priority
                    </Button>
                      </TableCell>
                      <TableCell style={{ width: "40%" }}>Assessment</TableCell>
                      <TableCell align="center">Weight</TableCell>
                      <TableCell align="right">Due Date</TableCell>
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
                      ).sort(function (a, b) { return calculatePriority(b) - calculatePriority(a) })
                      .map((item) => (
                        <TableRow
                          key={item.id}
                        >
                          <TableCell align="center">
                            {Math.round(100 * calculatePriority(item)) / 100}
                          </TableCell>
                          <TableCell component="th" scope="row" style={{ width: "50%" }}>
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

                    {assessment
                      .filter(
                        (allAssess) =>
                          allAssess.course === course.id &&
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate()
                          ) >= checkDate(allAssess.dateDescription)
                      )
                      .map((item) => (
                        <TableRow
                          key={item.id}
                          style={{ backgroundColor: "rgba(0, 255, 0, 0.05)" }}
                        >
                          <TableCell align="center">
                            N/A
                          </TableCell>
                          <TableCell component="th" scope="row" style={{ width: "40%" }}>
                            {item.name}
                          </TableCell>
                          <TableCell align="center">
                            {item.weight}%
                          </TableCell>
                          <TableCell align="right" style={{ width: "30%" }}>
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
