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
      localState.currScreen = "SplashScreenActivity";
      break;

     case "SplashScreenActivity":
      localState.isInit = false
      localState.currScreen = "SplashScreenActivity";
      break;

     case "AlternateModuleDetailActivity":
      localState.isInit = false;
      localState.currScreen = "AlternateModuleDetailActivity";
      break;

     case "CommunityInfoActivity":
      localState.isInit = false;
      localState.currScreen = "CommunityInfoActivity";
      break;

    case "CommunityViewAllActivity":
      localState.isInit = false;
      localState.currScreen = "CommunityViewAllActivity";
      break;


    case "CourseEnrolledActivity":
      localState.isInit = false;
      localState.currScreen = "CourseEnrolledActivity";
      break;

    case "CourseInfoActivity":
      localState.isInit = false;
      localState.currScreen = "CourseInfoActivity";
      break;

     case "CourseViewAllActivity":
      localState.isInit = false;
      localState.currScreen = "CourseViewAllActivity";
      break;

      case "FilterActivity":
      localState.isInit = false;
      localState.currScreen = "FilterActivity";
      break;

    case "MainActivity":
      localState.isInit = false
      localState.currScreen = "MainActivity";
      break;

    case "ModuleDetailActivity":
      localState.isInit = false;
      localState.currScreen = "ModuleDetailActivity";
      break;


     case "NotificationActivity":
      localState.isInit = false;
      localState.currScreen = "NotificationActivity";
      break;

    case "ResourceDetailActivity":
      localState.isInit = false;
      localState.currScreen = "ResourceDetailActivity";
      break;
    case "ResourceViewAllActivity":
      localState.isInit = false;
      localState.currScreen = "ResourceViewAllActivity";
      break;

    case "SearchActivity":
      localState.isInit = false;
      localState.currScreen = "SearchActivity";
      break;



    case "UserActivity":
      localState.isInit = false
      localState.currScreen = "UserActivity";
      break;

    case "AdditionalInformationActivity":
      localState.isInit = false
      localState.currScreen ="AdditionalInformationActivity"
      break;
    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
