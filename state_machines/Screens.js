var objectAssign = require('object-assign');

var localState = {
  isInit: false,
  currScreen: null
};

module.exports = function(action, payload, state) {
  localState = payload;

  switch (action) {
    case "INIT_UI":
      localState.isInit = true;
      localState.currScreen = "SPLASH";
      // localState.currScreen = "EXPLORE_SCREEN";
      break;

    case "SPLASH":
      localState.isInit = false;
      localState.currScreen = "SPLASH";
      break;

    case "HOME":
      localState.isInit = false;
      localState.currScreen = "HOME";
      break;

    case "COURSE_INFO_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COURSE_INFO_SCREEN";
      break;

    case "COURSE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COURSE_ACTIVITY_SCREEN";
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

    case "COMMUNITY_VIEW_ALL_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COMMUNITY_VIEW_ALL_SCREEN";
      break;
    case "COMMUNITY_INFO_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COMMUNITY_INFO_SCREEN";
      break;

    case "CLASSROOM_CONTENT_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASSROOM_CONTENT_SCREEN";
      break;




    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
