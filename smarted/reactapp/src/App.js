import React, { useEffect } from 'react';
import StudentApp from './StudentApp';
import TeacherApp from './TeacherApp';
import axios from 'axios';
import Cookies from 'js-cookie';

// DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  // console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  // console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

const App = () => {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    axios(url+'/Database/initialize/', {
      method: "get",
      withCredentials: true
    }).then(res => {
      setUser(res.data);
    })
  }, []);

  return (
    <div>
      {user !== null && (user.is_student === 0 ? <TeacherApp user={user} /> : <StudentApp user={user} />)}
    </div>
  );
}

export default App;