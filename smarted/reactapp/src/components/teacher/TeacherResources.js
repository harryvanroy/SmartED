import React, { useEffect } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@material-ui/core";
import { withStyles, useStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}

const VCheckbox = withStyles({
  root: {
    color: "#603E95",
    "&$checked": {
      colorcolor: "#603E95",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const ACheckbox = withStyles({
  root: {
    color: "#009DA1",
    "&$checked": {
      colorcolor: "#009DA1",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const RCheckbox = withStyles({
  root: {
    color: "#FAC22B",
    "#FAC22B": {
      colorcolor: "#FAC22B",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const KCheckbox = withStyles({
  root: {
    color: "#D7255D",
    "#D7255D": {
      colorcolor: "#D7255D",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const displayResource = (name, V, A, R, K) => {
  return (
    <div>
      {name}&nbsp;
      {V && <Brightness1Icon style={{ fontSize: 12, color: "#603E95" }} />}
      {A && <Brightness1Icon style={{ fontSize: 12, color: "#009DA1" }} />}
      {R && <Brightness1Icon style={{ fontSize: 12, color: "#FAC22B" }} />}
      {K && <Brightness1Icon style={{ fontSize: 12, color: "#D7255D" }} />}
    </div>
  );
};

const TeacherResources = ({ course }) => {
  const [tags, setTags] = React.useState({
    V: false,
    A: false,
    R: false,
    K: false,
  });
  const [currResource, setCurrResource] = React.useState({});
  const [resources, setResources] = React.useState([]);
  const [feedback, setFeedback] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleChangeTags = (event) => {
    setTags({ ...tags, [event.target.name]: event.target.checked });
  };

  const handlePostVark = () => {
    if (currResource.id) {
      console.log("posting vark for" + currResource.id);
      axios(url + "/Database/assign-resource-vark/", {
        method: "post",
        data: {
          id: currResource.id,
          V: tags.V,
          A: tags.A,
          R: tags.R,
          K: tags.K,
        },
        withCredentials: true,
      }).then((res) => {
        axios(url + `/Database/course-resources/${course.id}/`, {
          method: "get",
          withCredentials: true,
        }).then((res) => {
          setResources(res.data);
          console.log(res.data);
        });
      });
    }
  };

  const handleChooseResource = (event) => {
    setCurrResource(event.target.value);
  };

  const handleOpenFeedback = (id) => (event) => {
    console.log(id);
    axios(url + `/Database/resource-feedback/?id=${id}`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setOpenDialog(true);
      setFeedback(res.data);
    });
  };

  const handleCloseFeedback = (event) => {
    setOpenDialog(false);
    setFeedback([]);
  };

  useEffect(() => {
    axios(url + `/Database/course-resources/${course.id}/`, {
      method: "get",
      withCredentials: true,
    }).then((res) => {
      setResources(res.data);
      console.log(res.data);
    });
  }, [course]);

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseFeedback}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
        <DialogContent>
          <TableContainer
            style={{ marginBottom: 10, marginTop: 10 }}
            component={Paper}
          >
            <Table style={{ minWidth: 550 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell align="right">Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedback.map((res, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {res.user.name} ({res.user.username})
                    </TableCell>
                    <TableCell align="right">{res.feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <Typography variant="h4">Resources</Typography>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        style={{ minWidth: 550 }}
      >
        <Grid item style={{ width: "100%", marginBottom: 20 }}>
          <Typography style={{ marginBottom: 5, textAlign: "center" }}>
            Tag learning resources
          </Typography>
          <FormControl
            style={{
              marginLeft: 6,
              marginRight: 6,
            }}
            fullWidth
            variant="outlined"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Resource
            </InputLabel>
            <Select
              defaultValue=""
              id="demo-simple-select-outlined"
              labelId="demo-simple-select-outlined-label"
              label="resources"
              onChange={handleChooseResource}
            >
              {resources.map((res) => (
                <MenuItem key={res.id} value={res}>
                  {displayResource(res.title, res.V, res.A, res.R, res.K)}
                </MenuItem>
              ))}
            </Select>

            <FormGroup row>
              <FormControlLabel
                control={
                  <VCheckbox
                    checked={tags.V}
                    onChange={handleChangeTags}
                    name="V"
                  />
                }
                label="V"
              />
              <FormControlLabel
                control={
                  <ACheckbox
                    checked={tags.A}
                    onChange={handleChangeTags}
                    name="A"
                  />
                }
                label="A"
              />
              <FormControlLabel
                control={
                  <RCheckbox
                    checked={tags.R}
                    onChange={handleChangeTags}
                    name="R"
                  />
                }
                label="R"
              />
              <FormControlLabel
                control={
                  <KCheckbox
                    checked={tags.K}
                    onChange={handleChangeTags}
                    name="K"
                  />
                }
                label="K"
              />
            </FormGroup>
            <Button
              style={{ marginTop: 10 }}
              variant="contained"
              color="primary"
              onClick={handlePostVark}
            >
              TAG
            </Button>
          </FormControl>
        </Grid>
        <Grid item style={{ width: "100%", marginBottom: 20 }}>
          <Typography variant="h5">Resource feedback</Typography>
          <TableContainer
            style={{ marginBottom: 10, marginTop: 10 }}
            component={Paper}
          >
            <Table style={{ minWidth: 550 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Resource</TableCell>
                  <TableCell align="right">Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell component="th" scope="row">
                      {res.title}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleOpenFeedback(res.id)}
                      >
                        View feedback
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};
export default TeacherResources;
