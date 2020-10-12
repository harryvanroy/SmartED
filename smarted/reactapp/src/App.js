import React, { useEffect } from 'react';
import StudentApp from './StudentApp';
import TeacherApp from './TeacherApp';

const App = () => (
      JSON.parse(localStorage.getItem('isTeacher'))
      ? (<TeacherApp />)
      : (<StudentApp />)
)
export default App;