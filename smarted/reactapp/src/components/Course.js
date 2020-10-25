import React, { useEffect } from "react";
import Cookies from "js-cookie";
import {
  Grid,
  Paper,
  Box,
  Typography,
  ButtonBase,
  Button,
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
import Chip from "@material-ui/core/Chip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { checkDate } from "./Home";
import axios from "axios";

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
    maxWidth: 400,
  },
}));

const VChip = withStyles({
  root: {
    backgroundColor: "#603E95",
  },
})((props) => <Chip size="small" label="V" {...props} />);

const AChip = withStyles({
  root: {
    backgroundColor: "#009DA1",
  },
})((props) => <Chip size="small" label="A" {...props} />);

const RChip = withStyles({
  root: {
    backgroundColor: "#FAC22B",
  },
})((props) => <Chip size="small" label="R" {...props} />);

const KChip = withStyles({
  root: {
    backgroundColor: "#D7255D",
  },
})((props) => <Chip size="small" label="K" {...props} />);

const displayResource = (V, A, R, K) => {
  return (
    <div>
      {V && <VChip />}
      {A && <AChip />}
      {R && <RChip />}
      {K && <KChip />}
    </div>
  );
};

const Course = ({ currCourse, assessment, courses }) => {
  const classes = useStyles();

  const [files, setFiles] = React.useState([]);
  const [resources, setResources] = React.useState([]);

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
                  <a
                    style={{ display: "inline-block" }}
                    target="_blank"
                    href={res.blackboardLink}
                  >
                    {res.title}
                  </a>
                  <div style={{ display: "inline-block", marginLeft: 3 }}>
                    {displayResource(res.V, res.A, res.R, res.K)}
                  </div>
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
                <div>
                  <a target="_blank" href={res.blackboardLink}>
                    {res.title}
                  </a>
                  {displayResource(res.V, res.A, res.R, res.K)}
                </div>
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
              <Paper
                elevation={3}
                className={classes.paper}
                style={{ height: 760, overflow: "auto" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className={classes.paperTitle}
                >
                  <Typography variant="h5">Resources</Typography>
                </div>
                <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpanded={["root"]}
                  defaultExpandIcon={<ChevronRightIcon />}
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
    </Box>
  );
};

export default Course;
