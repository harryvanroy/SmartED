import React from "react";
import { Button, Box, Typography } from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";

import Cookies from "js-cookie";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SyncData = () => {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    showPassword: false,
    syncing: false,
    done: false,
  });
  const [openErr, setOpenErr] = React.useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleErrClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErr(false);
  };

  const handleSubmit = () => {
    setValues({ ...values, syncing: true });

    axios(url + "/Database/refresh/", {
      method: "post",
      data: {
        username: values.username,
        password: values.password,
      },
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);
        setValues({ ...values, syncing: false });
        setValues({ ...values, done: true });
      })
      .catch((err) => {
        setOpenErr(true);
      });
  };

  return (
    <Box display="flex" justifyContent="center">
      <Snackbar
        open={openErr}
        autoHideDuration={2000}
        onClose={handleErrClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleErrClose} severity="error">
          Error submitting!
        </Alert>
      </Snackbar>
      {values.done ? (
        <h4>Done Syncing!</h4>
      ) : values.syncing ? (
        <Box display="flex" justifyContent="center" flexDirection="column">
          <CircularProgress style={{ margin: "auto" }} />
          <h4>Syncing... This may take awhile, please wait...</h4>
        </Box>
      ) : (
        <>
          <FormControl fullWidth>
            <Input
              style={{ margin: 12 }}
              placeholder="UQ username"
              variant="outlined"
              onChange={handleChange("username")}
            />
          </FormControl>
          <FormControl fullWidth>
            <Input
              style={{ margin: 12 }}
              placeholder="Password"
              id="standard-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            style={{ margin: 12 }}
            onClick={handleSubmit}
            variant="contained"
          >
            Sync
          </Button>
        </>
      )}
    </Box>
  );
};

export default SyncData;
