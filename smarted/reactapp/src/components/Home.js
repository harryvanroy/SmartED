import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import VarkChart from "./VarkChart";
import VarkBreakdown from "./VarkBreakdown";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";

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

function checkDate(dateString) {
  if (isNaN(parseInt(dateString[0]))) {
    return new Date(2020, 10, 20); // assume middle of exam block
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
}

function Home({ assessment, courses, vark, announcements }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogAnn, setDialogAnn] = React.useState({});
  const [altOpen, setAltOpen] = React.useState(false);

  const handleVarkOpen = () => {
    setOpen(true);
  };

  const handleVarkClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (ann) => {
    return function () {
      setOpenDialog(true);
      setDialogAnn(ann);
    };
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogAnn({});
  };

  const handleAltOpen = () => {
    setAltOpen(true);
  };

  const handleAltClose = () => {
    setAltOpen(false);
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {dialogAnn.title}
          <Typography color="primary">
            Posted on {dialogAnn.dateAdded}
          </Typography>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 20 }}>
          <Typography>{dialogAnn.content}</Typography>
        </DialogContent>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleVarkClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">About VARK</DialogTitle>
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

      <Dialog
        open={altOpen}
        onClose={handleAltClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">VARK score breakdown</DialogTitle>
        <DialogContent>
          <VarkBreakdown V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
        </DialogContent>
      </Dialog>

      <Grid container justify="center" spacing={3} style={{ minWidth: 550 }}>
        <Grid item xs={8}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">Announcements</Typography>
                </div>
                <Box style={{ maxHeight: 760, overflow: "auto" }}>
                  {announcements
                    .sort(
                      (a, b) =>
                        Date.parse(b.dateAdded) - Date.parse(a.dateAdded)
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
                          variant="outlined"
                        >
                          <Typography
                            style={{
                              flexGrow: 1,
                              textAlign: "left",
                              margin: 10,
                            }}
                          >
                            {ann.title.slice(0, 25) + "..."}
                          </Typography>
                          <Typography
                            style={{
                              margin: 10,
                              color: "#51237a",
                            }}
                          >
                            {
                              courses.filter(
                                (course) => course.id === ann.course
                              )[0].name
                            }
                          </Typography>
                          <Typography style={{ margin: 10 }}>
                            {ann.dateAdded.slice(8, 10) + 
                            ann.dateAdded.slice(4,8) + 
                            ann.dateAdded.slice(0,4)}
                          </Typography>
                        </Paper>
                      </ButtonBase>
                    ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5">
                    VARK summary
                    <Button
                      style={{ marginLeft: 5 }}
                      color="primary"
                      onClick={handleVarkOpen}
                    >
                      Read more
                    </Button>
                  </Typography>
                </div>
                {isNaN(vark.V) ? (
                  <Typography align="center">
                    Please complete vark quiz
                  </Typography>
                ) : (
                  <div>
                    <VarkChart V={vark.V} A={vark.A} R={vark.R} K={vark.K} />
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 12 }}
                      onClick={handleAltOpen}
                    >
                      My VARK Score
                    </Button>
                  </div>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5">Upcoming assessment</Typography>
                </div>
                <Box
                  style={{ maxHeight: 300, overflow: "auto" }}
                  flex={1}
                  flexDirection="column"
                >
                  {courses.map((course) => (
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
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export { Home, checkDate };
