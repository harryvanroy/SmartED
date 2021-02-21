import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  Input,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import Cookies from "js-cookie";
import axios from "axios";
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
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPassword: false,
    syncing: false,
    done: false,
  });
  const [openErr, setOpenErr] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleErrClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErr(false);
  };

  const handleSubmit = () => {
    if (values.username === "" || values.password === "") {
      return;
    }
    setValues({ ...values, syncing: true });
    axios(url + "/Database/refresh/", {
      method: "post",
      data: {
        username: values.username,
        password: values.password,
      },
      withCredentials: true,
    })
      .then(() => {
        setValues({ ...values, syncing: false });
        setValues({ ...values, done: true });
      })
      .catch(() => {
        setOpenErr(true);
        setValues({ ...values, done: true });
      });
  };

  return (
    <Box display="flex" justifyContent="center">
      <Snackbar
        open={openErr}
        autoHideDuration={2000}
        onClose={handleErrClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleErrClose} severity="error">
          Error submitting!
        </Alert>
      </Snackbar>
      {values.done ? (
        <Typography>Done Syncing!</Typography>
      ) : values.syncing ? (
        <Box display="flex" justifyContent="center" flexDirection="column">
          <CircularProgress style={{ margin: "auto" }} />
          <Typography>Syncing. This may take a while, please wait.</Typography>
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
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setValues({
                        ...values,
                        showPassword: !values.showPassword,
                      })
                    }
                    onMouseDown={(event) => event.preventDefault()}>
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            style={{ margin: 12 }}
            onClick={handleSubmit}
            variant="contained">
            Sync
          </Button>
        </>
      )}
    </Box>
  );
};

export default SyncData;
