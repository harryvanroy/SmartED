import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VarkChart from "../VarkChart";
import Cookies from "js-cookie";
import axios from "axios";
import InfoIcon from "@material-ui/icons/Info";

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
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [riskDialogOpen, setRiskDialogOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
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

    axios(url + `/Database/students-at-risk/?id=${course.id}`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setStudentsAtRisk(res.data);
    });
  }, [course]);

  return (
    <Box>
      <Dialog open={riskDialogOpen} onClose={() => setRiskDialogOpen(false)}>
        <DialogTitle>At Risk</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A student is classified as "AT RISK" if their current weighted
            average grade in this course is less than 50%. This is a generalised
            statement and may not truly reflect the student's actual risk of
            failure.
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer
            style={{ marginBottom: 10, height: 650 }}
            component={Paper}>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 7,
              }}
              className={classes.paperTitle}>
              <Typography variant="h5">Students at risk </Typography>
              <IconButton onClick={() => setRiskDialogOpen(true)}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Box>
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
                    <TableCell align="right">{row.grade.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className={classes.paper}>
            <Box className={classes.paperTitle}>
              <Typography variant="h5">Course VARK Summary</Typography>
            </Box>
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
    </Box>
  );
};

export default Students;
