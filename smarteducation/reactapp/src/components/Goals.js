import React from 'react';
import { Button, Container, Box, Typography } from '@material-ui/core';

function Goals() {
  return (
    <Box width="80%">
      <Typography variant="h4">
        Course goals
      </Typography>
      
      <Button variant="contained" color="primary" size="large" m={10}>
        ADD/CHANGE
      </Button>
    </Box>
  );
};

export default Goals;
