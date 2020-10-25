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
import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import { useSpring, animated } from "react-spring/web.cjs";
import Chip from "@material-ui/core/Chip";
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

const MinusSquare = (props) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
};

const PlusSquare = (props) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
};

const CloseSquare = (props) => {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
};

const TransitionComponent = (props) => {
  const style = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
};

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

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

function Course({ currCourse, assessment, courses }) {
  const classes = useStyles();

  const [files, setFiles] = React.useState([]);
  const [resources, setResources] = React.useState([]);

  useEffect(() => {
    axios(url + `/Database/course-files/${currCourse.id}/?format=json`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setFiles(res.data);
      console.log(res.data);
      console.log(currCourse);
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

  const displayResource = (name, V, A, R, K) => {
    return (
      <div>
        {name}&nbsp;
        {V === 1 && <VChip />}
        {A === 1 && <AChip />}
        {R === 1 && <RChip />}
        {K === 1 && <KChip />}
      </div>
    );
  };

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
                  <Typography variant="h5">Resources</Typography>
                </div>
                <TreeView
                  className={classes.root}
                  defaultExpanded={["0"]}
                  defaultCollapseIcon={<MinusSquare />}
                  defaultExpandIcon={<PlusSquare />}
                  defaultEndIcon={<CloseSquare />}
                >
                  <StyledTreeItem nodeId="1" label="Learning Resources">
                    {files
                      .filter((file) => !file.isAssessment)
                      .map((fileRes) => (
                        <StyledTreeItem
                          key={fileRes.id}
                          nodeId={"" + fileRes.id}
                          label={fileRes.name}
                        >
                          {resources
                            .filter((res) => res.folder === fileRes.id)
                            .map((resFile, index) => (
                              <StyledTreeItem
                                key={index}
                                nodeId={"" + index}
                                label={
                                  <a
                                    target="_blank"
                                    href={resFile.blackboardLink}
                                  >
                                    {resFile.title}
                                  </a>
                                }
                              ></StyledTreeItem>
                            ))}
                        </StyledTreeItem>
                      ))}
                  </StyledTreeItem>
                  <StyledTreeItem nodeId="1" label="Assessment">
                    {files
                      .filter((file) => file.isAssessment)
                      .map((fileAsses) => (
                        <StyledTreeItem
                          key={fileAsses.id}
                          nodeId={"" + fileAsses.id}
                          label={fileAsses.name}
                        >
                          {resources
                            .filter((res) => res.folder === fileAsses.id)
                            .map((resFile, index) => (
                              <StyledTreeItem
                                key={index}
                                nodeId={"" + index}
                                label={
                                  <a
                                    target="_blank"
                                    href={resFile.blackboardLink}
                                  >
                                    {resFile.title}
                                  </a>
                                }
                              ></StyledTreeItem>
                            ))}
                        </StyledTreeItem>
                      ))}
                  </StyledTreeItem>
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
                  {courses
                    .filter((course) => course.name === currCourse)
                    .map((course) => (
                      <TableContainer
                        style={{ marginBottom: 20 }}
                        key={course.id}
                        component={Paper}
                        variant="outlined"
                      >
                        <Table aria-label="simple table">
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
    </Box>
  );
}

export default Course;
