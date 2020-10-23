import React from 'react';
import { Box } from '@material-ui/core';

const CourseResources = ({ course, resources }) => {
    return (
        <div>
            resources page for {course.name}
        </div>
    );
}

export default CourseResources;