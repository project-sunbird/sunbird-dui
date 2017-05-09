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
      localState.currScreen = "HOME";

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

    case "CLASS_SUBJECTS_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASS_SUBJECTS_SCREEN";
      break;

    case "CLASS_ASSIGNMENTS_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASS_ASSIGNMENTS_SCREEN";
      break;

    case "CLASS_QUIZ_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASS_QUIZ_SCREEN";
      break;

    case "CLASS_LAB_TESTS_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASS_LAB_TESTS_SCREEN";
      break;
    
    case "CLASS_HOME_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASS_HOME_SCREEN";
      break;

    case "CLASS_TEST_SCREEN":
      localState.isInit = false;
      localState.currScreen = "CLASS_TEST_SCREEN";
      break;

    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
