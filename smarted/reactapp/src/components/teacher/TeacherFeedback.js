import React, { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DialogContentText,
  Box,
} from "@material-ui/core";
import Cookies from "js-cookie";

// DETERMINE LOCATION
var url;
if (typeof Cookies.get("EAIT_WEB") !== "undefined") {
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const TeacherFeedback = ({ feedback }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const handleOpenDialog = (text) => () => {
    setOpenDialog(true);
    setDialogText(text);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogText("");
  };

  return (
    <Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogText}</DialogContentText>
        </DialogContent>
      </Dialog>
      <Typography variant="h4">Course Feedback</Typography>
      <TableContainer style={{ marginTop: 10 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell align="right">Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedback.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.user.username} ({row.user.name})
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDialog(row.feedback)}>
                    View feedback
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherFeedback;
