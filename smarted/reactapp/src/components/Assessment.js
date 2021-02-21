import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { checkDate } from "./Home";
import Latex from "react-latex";

//DETERMINE LOCATION
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
  date: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

let currentDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);

const calculatePriority = (item) => {
  return (
    item.weight /
    Math.log(
      (checkDate(item.dateDescription) - currentDate) / (1000 * 3600 * 24) + 1
    )
  );
};

const Assessment = ({ assessment, courses }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Priority</DialogTitle>
        <DialogContent>
          The priority value is calcuated with consideration for the weighting
          and due date of the assessment. An assignment with a higher priority
          value indicates a more crucial upcoming assignment.
          <br></br>
          <br></br>
          The priority is calculated with the following:
          <br></br>
          <Typography variant="h6">
            <Latex displayMode={true}>$weighting \div \ln(1 + daysleft)$</Latex>
          </Typography>
        </DialogContent>
      </Dialog>

      <Typography variant="h4">Assessment</Typography>
      <Grid style={{ marginTop: 5 }} container spacing={3}>
        {courses.map((course) => (
          <Grid key={course.id} item xs={12}>
            <Paper className={classes.paper} elavation={3}>
              <Box className={classes.paperTitle}>
                <Typography variant="h5">{course.name}</Typography>
              </Box>
              <TableContainer
                style={{ marginBottom: 10, marginTop: 10 }}
                component={Paper}
                elavation={3}
                variant="outlined">
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <Button
                          align="left"
                          style={{ textTransform: "none" }}
                          color="primary"
                          onClick={() => setOpen(true)}>
                          Priority
                        </Button>
                      </TableCell>
                      <TableCell align="center">Assessment</TableCell>
                      <TableCell align="center">Weight</TableCell>
                      <TableCell className={classes.date} align="right">
                        Due Date
                      </TableCell>
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
                      .sort(function (a, b) {
                        return calculatePriority(b) - calculatePriority(a);
                      })
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell align="left">
                            {Math.round(100 * calculatePriority(item)) / 100}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {item.name}
                          </TableCell>
                          <TableCell align="left">{item.weight}%</TableCell>
                          <TableCell className={classes.date} align="right">
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
                        <TableRow key={item.id}>
                          <TableCell align="left">N/A</TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {item.name}
                          </TableCell>
                          <TableCell align="left">{item.weight}%</TableCell>
                          <TableCell className={classes.date} align="right">
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
    </Box>
  );
};

export default Assessment;
