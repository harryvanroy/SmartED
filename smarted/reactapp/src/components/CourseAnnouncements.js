import React from 'react';
import { Box } from '@material-ui/core';

const CourseAnnouncements = ({ course, announcements }) => {
    return (
        <div>
            announcements page for {course.name}
        </div>
    );
}

export default CourseAnnouncements;