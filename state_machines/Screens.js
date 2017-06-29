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
      // localState.currScreen = "COURSE_DETAIL_SCREEN";
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

    case "COURSE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COURSE_ACTIVITY_SCREEN";
      break;
    case "EnrolledCourseScreen":
      localState.isInit = false;
      localState.currScreen = "EnrolledCourseScreen";
      break;
    case "EXPLORE_SCREEN":
      localState.isInit = false;
      localState.currScreen = "EXPLORE_SCREEN";
      break;
    case "COURSE_QUIZ_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COURSE_QUIZ_ACTIVITY_SCREEN";
      break;

    case "PROFILE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "PROFILE_ACTIVITY_SCREEN";
      break;


    case "PROFILE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "PROFILE_ACTIVITY_SCREEN";
      break;

    case "CourseInfoScreen":
      localState.isInit = false;
      localState.currScreen = "CourseInfoScreen";
      break;

    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
