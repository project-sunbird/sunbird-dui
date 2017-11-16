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
    case "WelcomeScreenActivity":
      localState.isInit = false
      localState.currScreen = "WelcomeScreenActivity";
      break;
    case "StateSelectActivity":
      localState.isInit = false
      localState.currScreen = "StateSelectActivity";
      break;
    case "ViewBatchActivity":
      localState.isInit = false
      localState.currScreen = "ViewBatchActivity";
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

    case "ContentPreviewScreen":
      localState.isInit = false;
      localState.currScreen = "ContentPreviewScreen";
      break;

    case "CourseInfoActivity":
      localState.isInit = false;
      localState.currScreen = "CourseInfoActivity";
      break;

    case "ProfileActivity":
      localState.isInit = false;
      localState.currScreen = "ProfileActivity";
      break;

    case "AnnouncementViewAllActivity":
      localState.isInit = false;
      localState.currScreen = "AnnouncementViewAllActivity";
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

    case "CommProfSearchActivity":
    localState.isInit = false;
    localState.currScreen = "CommProfSearchActivity";
    break;

    case "UserActivity":
      localState.isInit = false
      localState.currScreen = "UserActivity";
      break;

    case "QRActivity":
      localState.isInit = false
      localState.currScreen = "QRActivity";
      break;

    case "AdditionalInformationActivity":
      localState.isInit = false
      localState.currScreen ="AdditionalInformationActivity"
      break;
    case "AnnouncementDetailActivity":
      localState.isInit = false
      localState.currScreen ="AnnouncementDetailActivity"
      break;
    case "AddressActivity":
      localState.isInit = false
      localState.currScreen = "AddressActivity";
      break;
    case "EducationActivity":
      localState.isInit = false
      localState.currScreen = "EducationActivity";
      break;
    case "ExperienceActivity":
      localState.isInit = false
      localState.currScreen = "ExperienceActivity";
      break;
    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
