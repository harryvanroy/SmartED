import React, { useEffect } from "react";
import { FormGroup, FormControlLabel, Checkbox, Paper } from "@material-ui/core";
import { withStyles, useStyles } from "@material-ui/core/styles"
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
import Chip from '@material-ui/core/Chip';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const VCheckbox = withStyles({
  root: {
    color: '#603E95',
    '&$checked': {
      colorcolor: '#603E95',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const VChip = withStyles({
  root: {
    backgroundColor: '#603E95',
  },
})((props) => <Chip size="small" label="V" {...props} />);

const ACheckbox = withStyles({
  root: {
    color: '#009DA1',
    '&$checked': {
      colorcolor: '#009DA1',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const AChip = withStyles({
  root: {
    backgroundColor: '#009DA1',
  },
})((props) => <Chip size="small" label="A" {...props} />);

const RCheckbox = withStyles({
  root: {
    color: '#FAC22B',
    '#FAC22B': {
      colorcolor: '#FAC22B',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const RChip = withStyles({
  root: {
    backgroundColor: '#FAC22B',
  },
})((props) => <Chip size="small" label="R" {...props} />);

const KCheckbox = withStyles({
  root: {
    color: '#D7255D',
    '#D7255D': {
      colorcolor: '#D7255D',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const KChip = withStyles({
  root: {
    backgroundColor: '#D7255D',
  },
})((props) => <Chip size="small" label="K" {...props} />);


const TeacherResources = ({ course }) => {
  const [tags, setTags] = React.useState({
    V: false,
    A: false,
    R: false,
    K: false,
  });

  const handleChangeTags = (event) => {
    setTags({ ...tags, [event.target.name]: event.target.checked });
  };

  const displayResource = (name, V, A, R, K) => {
    return (
      <div>
        {name}&nbsp;
        {V === 1 &&
          <VChip />}
        {A === 1 &&
          <AChip />}
        {R === 1 &&
          <RChip />}
        {K === 1 &&
          <KChip />}
      </div>
    );
  }

  useEffect(() => {
  }, [course]);

  return (
    <div>
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
            >
              <MenuItem value={1}>
                {displayResource("Lecture 1", 1, 0, 1, 1)}
              </MenuItem>
            </Select>
            {/*{resources
                .filter((res) => res.course === course.id)
                .map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}*/}


            <FormGroup row>
              <FormControlLabel
                control={<VCheckbox checked={tags.V} onChange={handleChangeTags} name="V" />}
                label="V"
              />
              <FormControlLabel
                control={<ACheckbox checked={tags.A} onChange={handleChangeTags} name="A" />}
                label="A"
              />
              <FormControlLabel
                control={<RCheckbox checked={tags.R} onChange={handleChangeTags} name="R" />}
                label="R"
              />
              <FormControlLabel
                control={<KCheckbox checked={tags.K} onChange={handleChangeTags} name="K" />}
                label="K"
              />
            </FormGroup>
            <Button
              style={{ marginTop: 10 }}
              variant="contained"

              color="primary"
            >
              TAG
            </Button>
          </FormControl>
        </Grid>
        <Grid item style={{ width: "100%", marginBottom: 20 }}>
          <Typography variant="h5">
            Resource feedback
          </Typography>
          <TableContainer
            style={{ marginBottom: 10, marginTop: 10 }}
            component={Paper}
          >
            <Table style={{ minWidth: 550 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Resource</TableCell>
                  <TableCell align="right">Student</TableCell>
                  <TableCell align="right">Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*feedback.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.user.username} ({row.user.name})
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleOpenDialog(row.feedback)}
                      >
                        View feedback
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}*/}
                <TableRow>
                  <TableCell component="th" scope="row">Stuff</TableCell>
                  <TableCell align="right" component="th" scope="row">anon</TableCell>
                  <TableCell align="right">This sucks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};
export default TeacherResources;
