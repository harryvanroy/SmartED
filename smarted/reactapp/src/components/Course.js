import React, { useEffect } from "react";
import Cookies from "js-cookie";
import {
  Grid,
  Paper,
  Box,
  Typography,
  ButtonBase,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { checkDate } from "./Home";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import FeedbackIcon from "@material-ui/icons/Feedback";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import Vark from "./Vark";

//DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
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
  root: {
    height: 264,
    flexGrow: 1,
  },
}));

const displayResource = (name, V, A, R, K) => {
  return (
    <span>
      {name}&nbsp;
      {V && <Brightness1Icon style={{ fontSize: 12, color: "#603E95" }} />}
      {A && <Brightness1Icon style={{ fontSize: 12, color: "#009DA1" }} />}
      {R && <Brightness1Icon style={{ fontSize: 12, color: "#FAC22B" }} />}
      {K && <Brightness1Icon style={{ fontSize: 12, color: "#D7255D" }} />}
    </span>
  );
};

const Course = ({ currCourse, assessment, courses, vark }) => {
  const classes = useStyles();

  const [files, setFiles] = React.useState([]);
  const [resources, setResources] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState({
    text: "",
    anon: false,
    course: 0,
  });

  const handleOpen = (id) => (event) => {
    setFeedback({ ...feedback, course: id });
    setOpen(true);
  };

  const handleClose = (event) => {
    setFeedback({ text: "", anon: false, course: 0 });
    setOpen(false);
  };

  const handleTextChange = (event) => {
    setFeedback({ ...feedback, text: event.target.value });
  };

  const handleAnonChange = (event) => {
    setFeedback({ ...feedback, anon: event.target.checked });
  };

  const handleSubmit = (event) => {
    axios(url + `/Database/post-resource-feedback/`, {
      method: "post",
      data: {
        id: feedback.course,
        feedback: feedback.text,
      },
      withCredentials: true,
    });
  };

  let resourceData = files
    .filter((file0) => !file0.isAssessment)
    .map((file) => {
      return {
        id: "" + file.id,
        name: file.name,
        children: resources
          .filter((res0) => res0.folder === file.id)
          .map((res, index) => {
            return {
              id: "" + index,
              name: (
                <div>
                  <a target="_blank" href={res.blackboardLink}>
                    {displayResource(res.title, res.V, res.A, res.R, res.K)}
                  </a>
                  <IconButton onClick={handleOpen(res.id)}>
                    <FeedbackIcon fontSize="small"></FeedbackIcon>
                  </IconButton>
                </div>
              ),
              children: [],
            };
          }),
      };
    });

  let assessmentData = files
    .filter((file0) => file0.isAssessment)
    .map((file) => {
      return {
        id: "" + file.id,
        name: file.name,
        children: resources
          .filter((res0) => res0.folder === file.id)
          .map((res, index) => {
            return {
              id: "" + index,
              name: (
                <a target="_blank" href={res.blackboardLink}>
                  {displayResource(res.title, res.V, res.A, res.R, res.K)}
                </a>
              ),
              children: [],
            };
          }),
      };
    });

  let data = {
    id: "root",
    name: "Resources",
    children: [
      {
        id: "resources",
        name: <Button color="primary">Learning Resources</Button>,
        children: resourceData,
      },
      {
        id: "assessment",
        name: <Button color="secondary">Assessment</Button>,
        children: assessmentData,
      },
    ],
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    if (currCourse === undefined) {
      currCourse = JSON.parse(localStorage.getItem("currCourse"));
    }
    if (!localStorage.getItem("currCourse")) {
      localStorage.setItem("currCourse", JSON.stringify(currCourse));
    }
    axios(url + `/Database/course-files/${currCourse.id}/?format=json`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setFiles(res.data);

      let resp = [];
      let promises = [];
      res.data.forEach((file) => {
        promises.push(
          axios(
            url +
              `/Database/course-resources/${currCourse.id}/${file.id}/?format=json`,
            {
              method: "get",
              withCredentials: true,
            }
          ).then((res) => {
            resp.push(res.data);
            console.log(res.data);
          })
        );
      });
      Promise.all(promises).then(() => setResources([].concat.apply([], resp)));
    });
  }, [currCourse, assessment]);

  if (currCourse === undefined) {
    return null;
  }
  return (
    <Box>
      <Typography variant="h4">Course: {currCourse.name}</Typography>
      <Grid
        container
        justify="center"
        spacing={3}
        style={{ marginTop: 12, minWidth: 550 }}
      >
        <Grid item xs={8}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">Recommended resources</Typography>
                </div>
                <div style={{ maxHeight: 100, overflow: "auto" }}>
                  {resources
                    .filter(
                      (res) =>
                        (res.V && vark.V > 0.3) ||
                        (res.A && vark.A > 0.3) ||
                        (res.R && vark.R > 0.3) ||
                        (res.K && vark.K > 0.3)
                    )
                    .map((resFil) => (
                      <div key={resFil.id}>
                        <a target="_blank" href={resFil.blackboardLink}>
                          {displayResource(
                            resFil.title,
                            resFil.V,
                            resFil.A,
                            resFil.R,
                            resFil.K
                          )}
                        </a>
                      </div>
                    ))}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">Resources</Typography>
                </div>
                <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpanded={["root", "resources", "assessment"]}
                  defaultExpandIcon={<ChevronRightIcon />}
                  style={{ height: 470, overflow: "auto" }}
                >
                  {renderTree(data)}
                </TreeView>
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
                    key={currCourse.id}
                    component={Paper}
                    variant="outlined"
                  >
                    <Table aria-label="simple table">
                      <TableBody>
                        {assessment
                          .filter(
                            (allAssess) =>
                              allAssess.course === currCourse.id &&
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
                                    <Typography>{assessCourse.name}</Typography>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Resource feedback</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              placeholder="Type feedback here"
              variant="outlined"
              onChange={handleTextChange}
            />
          </FormControl>
          <Box style={{ marginTop: 6, marginBottom: 12 }}>
            <FormControl
              component="fieldset"
              style={{ marginTop: 12, marginBottom: 12 }}
            >
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox color="primary" onChange={handleAnonChange} />
                  }
                  label="Anonymous? (Constructive feedback only. Bullying or hate speech will not be tolerated)"
                  labelPlacement="end"
                />
              </FormGroup>
            </FormControl>
            <br />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              SEND TO COURSE STAFF
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Course;
