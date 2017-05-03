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
<<<<<<< HEAD
      localState.currScreen = "PROFILE_ACTIVITY_SCREEN";
=======
<<<<<<< HEAD
      localState.currScreen = "PROFILE_ACTIVITY_SCREEN";
=======
      localState.currScreen = "PROFILE_CERTIFICATION_SCREEN";
>>>>>>> 38d7f690747b4690f220ac9e8cfbff9fe0343192
>>>>>>> 73a16818c9adf871c5df4fee32bc267b4f540702
      break;

    case "SPLASH":
      localState.isInit = false;
      localState.currScreen = "SPLASH";
      break;

    case "CHOOSE_COURSE":
      localState.isInit = false;
      localState.currScreen = "CHOOSE_COURSE";
      break;

    case "COURSE_INFO_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COURSE_INFO_SCREEN";
      break;

    case "COURSE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "COURSE_ACTIVITY_SCREEN";
      break;
<<<<<<< HEAD
    case "PROFILE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "PROFILE_ACTIVITY_SCREEN";
      break;
=======

    case "PROFILE_ABOUT_SCREEN":
      localState.isInit = false;
      localState.currScreen = "PROFILE_ABOUT_SCREEN";
      break;
    case "PROFILE_ACTIVITY_SCREEN":
      localState.isInit = false;
      localState.currScreen = "PROFILE_ACTIVITY_SCREEN";
      break;

    case "PROFILE_CERTIFICATION_SCREEN":
      localState.isInit = false;
      localState.currScreen = "PROFILE_CERTIFICATION_SCREEN";
      break;

>>>>>>> 38d7f690747b4690f220ac9e8cfbff9fe0343192
    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
