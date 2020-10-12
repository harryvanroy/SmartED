import React from 'react';
import Cookies from "js-cookie";

//DETERMINE LOCATION
var url;
if (typeof Cookies.get('EAIT_WEB') !== "undefined") {
  console.log("ON DECO SITE");
  url = "https://deco3801-pogware.uqcloud.net";
} else {
  console.log("ON LOCAL");
  url = "http://localhost:8000";
}
console.log("location: " + url);
//

function Assessment() {
  return (
    <div>
      Assessment page.
     </div>
  );
};

export default Assessment;