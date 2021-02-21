import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  ButtonBase,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VarkChart from "./VarkChart";
import VarkBreakdown from "./VarkBreakdown";

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

const checkDate = (dateString) => {
  if (isNaN(parseInt(dateString[0]))) {
    return null;
  }

  let splitStr =
    dateString.indexOf("-") !== -1
      ? dateString.substr(dateString.indexOf("-") + 2).split(" ")
      : dateString.split(" ");

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let day = parseInt(splitStr[0]);
  let month = months.indexOf(splitStr[1]);
  let year = parseInt("20" + splitStr[2]);
  return new Date(year, month, day);
};

const Home = ({ assessment, courses, vark, announcements }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAnn, setDialogAnn] = useState({});
  const [altOpen, setAltOpen] = useState(false);

  const handleOpenDialog = (ann) => {
    return function () {
      setOpenDialog(true);
      setDialogAnn(ann);
    };
  };

  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setDialogAnn({});
        }}>
        <DialogTitle>
          {dialogAnn.title}
          <Typography color="primary">
            Posted on {dialogAnn.dateAdded}
          </Typography>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 20 }}>
          <Typography>{dialogAnn.content}</Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>About VARK</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            While there are several tools to study learning styles of students,
            the visual-aural-read/write-kinesthetic (VARK) questionnaire is a
            simple, freely available, easy to administer tool that encourages
            students to describe their behavior in a manner they can identify
            with and accept. The aim is to understand the preferred sensory
            modality (or modalities) of students for learning. Teachers can use
            this knowledge to facilitate student learning. Moreover, students
            themselves can use this knowledge to change their learning habits.
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={altOpen} onClose={() => setAltOpen(false)}>
        <DialogTitle>VARK score breakdown</DialogTitle>
        <DialogContent>
          <VarkBreakdown V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
        </DialogContent>
      </Dialog>

      <Grid container justify="center" spacing={3} alignItems="stretch">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} className={classes.paper}>
            <Box
              style={{ display: "flex", justifyContent: "center" }}
              className={classes.paperTitle}>
              <Typography variant="h5">Announcements</Typography>
            </Box>
            <Divider />
            {announcements.length === 0 ? (
              <Typography align="center">Please sync UQ data</Typography>
            ) : null}
            <Box>
              {announcements
                .sort(
                  (a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded)
                )
                .map((ann) => (
                  <ButtonBase key={ann.id} style={{ width: "100%" }}>
                    <Paper
                      onClick={handleOpenDialog(ann)}
                      square
                      style={{
                        minHeight: 50,
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      key={ann.id}
                      variant="outlined">
                      <Typography
                        style={{
                          flexGrow: 1,
                          textAlign: "left",
                          margin: 10,
                        }}>
                        {ann.title.slice(0, 25) + "..."}
                      </Typography>
                      <Box>
                        <Typography
                          style={{
                            margin: 10,
                            color: "#51237a",
                          }}>
                          {
                            courses.filter(
                              (course) => course.id === ann.course
                            )[0]?.name
                          }
                        </Typography>
                        <Typography variant="caption" style={{ margin: 10 }}>
                          {ann.dateAdded.slice(8, 10) +
                            ann.dateAdded.slice(4, 8) +
                            ann.dateAdded.slice(0, 4)}
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Paper elevation={3} className={classes.paper}>
                <Box className={classes.paperTitle}>
                  <Typography variant="h5">
                    VARK summary
                    <Button
                      style={{ marginLeft: 5 }}
                      color="primary"
                      onClick={() => setOpen(true)}>
                      Read more
                    </Button>
                  </Typography>
                </Box>
                {isNaN(vark.V) ? (
                  <Typography align="center">
                    Please complete vark quiz
                  </Typography>
                ) : (
                  <Box>
                    <VarkChart V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 12 }}
                      onClick={() => setAltOpen(true)}>
                      My VARK Score
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <Box className={classes.paperTitle}>
                  <Typography variant="h5">Upcoming assessment</Typography>
                </Box>
                <Box flex={1} flexDirection="column">
                  {courses.map((course) => (
                    <TableContainer
                      style={{ marginBottom: 20 }}
                      key={course.id}
                      component={Paper}
                      variant="outlined">
                      <Table>
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
                                        {assessCourse.name}
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

export { Home, checkDate };
