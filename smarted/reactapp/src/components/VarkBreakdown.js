import React from "react";
import { Typography, Box } from "@material-ui/core";
import VisibilityOutlinedIcon  from "@material-ui/icons/VisibilityOutlined";
import HearingOutlinedIcon from "@material-ui/icons/HearingOutlined"
import TouchAppOutlinedIcon from "@material-ui/icons/TouchAppOutlined"
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Brightness1Icon from '@material-ui/icons/Brightness1';

const types = {
  V: "Visual learner",
  A: "Auditory learner",
  R: "Read-Write learner",
  K: "Kinesthetic learner",
};

const minorTypes = {
  V: "visual",
  A: "auditory",
  R: "read-write",
  K: "is kinesthetic",
};

const descriptor = {
  V: "respond positively to visual stimuli, especially shapes and patterns",
  A: "respond positively to auditory stimuli such as sounds, however this also includes both spoken and written communication",
  R: "respond positively to written stimuli, where information is displayed as words",
  K: "have a perceptual preference related to the use of experience or practice, both real or simulated",
}

const resources = {
  V: "lecture slides, diagrams and YouTube videos",
  A: "lectures, seminars, podcasts and tutorials",
  R: "textbooks, articles and problem sets and past exams",
  K: "practicals, demonstration videos, and hands on examples",
};

const techniques = {
  V: "use colours and diagrams when note taking",
  A: "communicate with peers and talk yourself through the problem at hand",
  R: "spend time to write efficient yet detailed summaries of the content",
  K: "seek out practical applications of the topics",
};

const majorIcon = (major) => {
  if (major === "") {
    return(
        [<VisibilityOutlinedIcon style={{ fontSize : 30 }}></VisibilityOutlinedIcon>,
        <HearingOutlinedIcon style={{ fontSize : 30 }}></HearingOutlinedIcon>,
        <CreateOutlinedIcon style={{ fontSize : 30 }}></CreateOutlinedIcon>,
        <TouchAppOutlinedIcon style={{ fontSize : 30 }}></TouchAppOutlinedIcon>]
    )
  } else if (major === "V") {
    return(
      <VisibilityOutlinedIcon style={{ fontSize : 30 }}></VisibilityOutlinedIcon>
    )
  } else if (major === "A") {
    return(
      <HearingOutlinedIcon style={{ fontSize : 30 }}></HearingOutlinedIcon>
    )
  } else if (major === "R") {
    return(
      <CreateOutlinedIcon style={{ fontSize : 30 }}></CreateOutlinedIcon>
    )
  } else if (major === "K") {
    return(
      <TouchAppOutlinedIcon style={{ fontSize : 30 }}></TouchAppOutlinedIcon>
    )
  }
}

const minorIcon = (minor) => {
  if (minor === "V") {
    return(
      <VisibilityOutlinedIcon style={{ fontSize : 24 }}></VisibilityOutlinedIcon>
    )
  } else if (minor === "A") {
    return(
      <HearingOutlinedIcon style={{ fontSize : 24 }}></HearingOutlinedIcon>
    )
  } else if (minor === "R") {
    return(
      <CreateOutlinedIcon style={{ fontSize : 24 }}></CreateOutlinedIcon>
    )
  } else if (minor === "K") {
    return(
      <TouchAppOutlinedIcon style={{ fontSize : 24 }}></TouchAppOutlinedIcon>
    )
  }
}

const displayTypeDot = (size, type) => {
  if (type === "V") {
    return (<Brightness1Icon style={{fontSize:size, color:"#603E95"}} />);
  } else if (type === "A") {
    return (<Brightness1Icon style={{fontSize:size, color:"#009DA1"}} />);
  } else if (type === "R") {
    return (<Brightness1Icon style={{fontSize:size, color:"#FAC22B"}} />);
  } else if (type === "K") {
    return (<Brightness1Icon style={{fontSize:size, color:"#D7255D"}} />);
  }
};

const classifier = ({ V, A, R, K }) => {
  if (V < 0.3 && A < 0.3 && R < 0.3 && K < 0.3) {
    return { major: "", minor: "" };
  } else if (V > 0.5) {
    return { major: "V", minor: "" };
  } else if (A > 0.5) {
    return { major: "A", minor: "" };
  } else if (R > 0.5) {
    return { major: "R", minor: "" };
  } else if (K > 0.5) {
    return { major: "K", minor: "" };
  } else {
    var varkArray = [V, A, R, K];
    var labels = ["V", "A", "R", "K"];
    var a1 = -Infinity;
    var a2 = -Infinity;
    var b1 = -1;
    var b2 = -1;
    for (var i = 0; i < varkArray.length; i++) {
      if (varkArray[i] > a1) {
        b2 = b1;
        a1 = varkArray[i];
        b1 = i;
      } else if (varkArray[i] === a1) {
        b2 = i;
        a2 = a1;
      } else if (varkArray[i] > a2) {
        a2 = varkArray[i];
        b2 = i;
      }
    }
    return { major: labels[b1], minor: labels[b2] };
  }
};

const majorTypeBreakdown = (major) => {
  if (major === "") {
    return (
      <Box style={{marginBottom : 24}}>
        <Typography variant="h4">Multi Learner {majorIcon(major)}</Typography>
        <Typography variant="subtitle1">
          You don't let any single learning type define you, and benefit equally
          from Visual, Auditory, Written and Kinesthetic stimuli. Use a variety
          of course resources as much as possible, and supplement with further
          learning through external sources.
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box style={{marginBottom : 24}}>
        <Typography variant="h4"> {displayTypeDot(30, major)} Primary: {types[major]} {majorIcon(major)}</Typography>
        <Typography variant="subtitle1">
          Your primary learning style is {minorTypes[major]}. This means you 
          {" "}{descriptor[major]}. You may find the following resources useful: 
          {" "}{resources[major]}. Try to {" "}{techniques[major]} to get the best
          learning outcomes.
        </Typography>
      </Box>
    );
  }
};

const minorTypeBreakdown = (minor) => {
  return (
    <Box style={{marginBottom : 24}}>
      <Typography variant="h5"> {displayTypeDot(24, minor)} Secondary: {types[minor]} {minorIcon(minor)}</Typography>
      <Typography variant="subtitle1">
        Your secondary style is {minorTypes[minor]}. Supplement the above 
        resources with {" "}{resources[minor]}. Also try to {techniques[minor]}.
      </Typography>
    </Box>
  );
};

const majorResourceRecommendations = (major) => {
  return (
    <Box style={{marginBottom : 24}}>
      <Typography variant="subtitle1">
        Look for resources with the {displayTypeDot(12, major)} tag.
      </Typography>
    </Box>
  )
}

const minorResourceRecommendations = (minor) => {
  return (
    <Box style={{marginBottom : 24}}>
      <Typography variant="subtitle1">
        Look for resources with the {displayTypeDot(12, minor)} tag.
      </Typography>
    </Box>
  )
}

const breakdown = ({ major, minor }) => {
  console.log(major);
  console.log(minor);
  if (minor === "") {
    return (
      <div>
        {majorTypeBreakdown(major)}
        {majorResourceRecommendations(major)}
      </div>
    );
  } else {
    return (
      <div>
        {majorTypeBreakdown(major)}
        {majorResourceRecommendations(major)}
        {minorTypeBreakdown(minor)}
        {minorResourceRecommendations(minor)}
      </div>
    );
  }
};

const VarkBreakdown = (V, A, R, K) => {
  return breakdown(classifier(V, A, R, K));
};

export default VarkBreakdown;
