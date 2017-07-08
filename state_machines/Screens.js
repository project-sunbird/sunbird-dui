/*
Copyright (c) 2012-2017 "JUSPAY Technologies"
JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]

This file is part of JUSPAY Platform.

JUSPAY Platform is free software: you can redistribute it and/or modify
it for only educational purposes under the terms of the GNU Affero General
Public License (GNU AGPL) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
For Enterprise/Commerical licenses, contact <info@juspay.in>.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
be liable for all damages without limitation, which is caused by the
ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
damages, claims, cost, including reasonable attorney fee claimed on Juspay.
The end user has NO right to claim any indemnification based on its use
of Licensed Software. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.


*/

var objectAssign = require('object-assign');

var localState = {
  isInit: false,
  currScreen: null
};

module.exports = function(action, payload, state) {
  localState = payload;

  switch (action) {
    case "InitScreen":
      localState.isInit = true;
      localState.currScreen = "SplashScreen";
      break;

    case "SplashScreen":
      localState.isInit = false
      localState.currScreen = "SplashScreen";
      break;
    case "UserScreen":
      localState.isInit = false
      localState.currScreen = "UserScreen";
      break;
    case "HomeScreen":
      localState.isInit = false
      localState.currScreen = "HomeScreen";
      break;

    case "ResourceScreen":
      localState.isInit = false
      localState.currScreen = "ResourceScreen";
      break;

    case "CommunityInfoScreen":
      localState.isInit = false;
      localState.currScreen = "CommunityInfoScreen";
      break;
    case "CourseEnrolledScreen":
      localState.isInit = false;
      localState.currScreen = "CourseEnrolledScreen";
      break;

    case "CommunityViewAllScreen":
      localState.isInit = false;
      localState.currScreen = "CommunityViewAllScreen";
      break;

    case "CourseDetailScreen":
      localState.isInit = false;
      localState.currScreen = "CourseDetailScreen";
      break;

    case "NotificationScreen":
      localState.isInit = false;
      localState.currScreen = "NotificationScreen";
      break;

    case "ResourceDetailScreen":
      localState.isInit = false;
      localState.currScreen = "ResourceDetailScreen";
      break;
    case "ResourceViewAllScreen":
      localState.isInit = false;
      localState.currScreen = "ResourceViewAllScreen";
      break;

    case "CourseInfoScreen":
      localState.isInit = false;
      localState.currScreen = "CourseInfoScreen";
      break;

    case "SearchScreen":
      localState.isInit = false;
      localState.currScreen = "SearchScreen";
      break;

    case "FilterScreen":
      localState.isInit = false;
      localState.currScreen = "FilterScreen";
      break;

    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
