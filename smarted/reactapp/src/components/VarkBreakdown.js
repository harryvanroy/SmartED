import React from 'react';
import { Typography, Box } from "@material-ui/core";

const types = {
    V: "Visual learner",
    A: "Auditory learner",
    R: "Read-Write learner",
    K: "Kinesthetic learner"
}

const majorTypes = {
    V: "Your primary learning style is visual",
    A: "Your primary learning style is auditory",
    R: "Your primary learning style is read-write",
    K: "Your primary learning style is kinesthetic"
};

const minorTypes = {
    V: "Your secondary learning style is visual",
    A: "Your secondary learning style is auditory",
    R: "Your secondary learning style is read-write",
    K: "Your secondary learning style is kinesthetic"
}

const resources = {
    V: "lecture slides, diagrams, YouTube videos",
    A: "lectures, seminars, podcasts, tutorials",
    R: "textbooks, problem sets and past exams, articles",
    K: "practicals, demonstration videos, practicals, hands on examples"
}

const techniques = {
    V: "use colours and diagrams when note taking",
    A: "communicate with peers and talk yourself through the problem at hand",
    R: "spend time to write efficient yet detailed summaries of the content",
    K: "seek out practical applications of the topics"
}

const classifier = ({ V, A, R, K }) => {
    if (V < 0.3 && A < 0.3 && R < 0.3 && K < 0.3) {
        return ({ major: '', minor: '' });
    } else if (V > 0.5) {
        return ({ major: 'V', minor: '' });
    } else if (A > 0.5) {
        return ({ major: 'A', minor: '' });
    } else if (R > 0.5) {
        return ({ major: 'R', minor: '' });
    } else if (K > 0.5) {
        return ({ major: 'K', minor: '' });
    } else {
        var varkArray = [V, A, R, K];
        var labels = ['V', 'A', 'R', 'K'];
        var a1 = -Infinity;
        var a2 = -Infinity;
        var b1 = -1;
        var b2 = -1;
        for (var i = 0; i < varkArray.length; i++) {
            if (varkArray[i] > a1) {
                a2 = a1;
                b2 = b1;
                a1 = varkArray[i];
                b1 = i;
            } else if (varkArray[i] === a1) {
                a2 = varkArray[i];
                b2 = i;
            }
        }
        return ({ major: labels[b1], minor: labels[b2] });
    }
}

const majorTypeBreakdown = (major) => {
    return (
        <Box>
            <Typography variant="h4">
                Primary: {types[major]}
            </Typography>
            <Typography variant="subtitle1">
                {majorTypes[major]}. You may find the following resources useful: {resources[major]}.
                Try to {techniques[major]} to get the best learning outcomes.
            </Typography>
        </Box>
    );
}

const minorTypeBreakdown = (minor) => {
    return (
        <Box>
            <Typography variant="h5">
                Secondary: {types[minor]}
            </Typography>
            <Typography variant="subtitle1">
                {minorTypes[minor]}. Supplement the above resources with {resources[minor]}.
                Also try to {techniques[minor]}.
            </Typography>

        </Box>
    );
}

const breakdown = ({ major, minor }) => {
    console.log(major);
    console.log(minor);
    if (minor === '') {
        return (majorTypeBreakdown(major));
    } else {
        return (
            <div>
                {majorTypeBreakdown(major)}
                {minorTypeBreakdown(minor)}
            </div>
        );
    }
}

const VarkBreakdown = (V, A, R, K) => {
    return (breakdown(classifier(V, A, R, K)));
}

export default VarkBreakdown;