const uiHandler = require("@juspay/mystique-backend/src/ui_handlers").android;
var dispatcher;
const R = require('ramda');


//Reducer
const ScreenReducer = require("../state_machines/Screens");

const reducer = require("@juspay/mystique-backend/src/state_managers").reducer({
  "SCREEN": ScreenReducer
});

// Screens
const RootScreen = require("../views/RootScreen");
const SplashScreenActivity = require("../views/SplashScreenActivity");
const LanguageSelectActivity = require("../views/LanguageSelectActivity");
const WelcomeScreenActivity = require("../views/WelcomeScreenActivity");
const StateSelectActivity = require("../views/StateSelectActivity");
const SettingsScreenActivity = require("../views/SettingsScreenActivity");
const AboutUsActivity = require("../views/AboutUsActivity");
const AboutUsScreen = require("../views/AboutUsScreen");
const LanguageSelectActivitySt = require("../views/LanguageSelectActivitySt");
const DataSyncScreenActivity = require("../views/DataSyncScreenActivity");


//Home
const MainActivity = require("../views/MainActivity");
const UserActivity = require("../views/UserActivity");
//Course or Learn
const CourseInfoActivity = require("../views/CourseInfoActivity");
const CourseEnrolledActivity = require("../views/CourseEnrolledActivity");
const ModuleDetailActivity = require("../views/ModuleDetailActivity");
const ViewBatchActivity = require("../views/ViewBatchActivity");

//Resource

//Comunity
const CommunityInfoActivity = require("../views/CommunityInfoActivity");
const CommunityViewAllActivity = require("../views/CommunityViewAllActivity");
//Profile
const NotificationActivity = require("../views/NotificationActivity");
const ResourceDetailActivity = require("../views/ResourceDetailActivity");
const ResourceViewAllActivity = require("../views/ResourceViewAllActivity");
const CourseViewAllActivity = require("../views/CourseViewAllActivity");
const AnnouncementViewAllActivity = require("../views/AnnouncementViewAllActivity")
const SearchActivity = require("../views/SearchActivity");
const FilterActivity = require("../views/FilterActivity");
const AdditionalInformationActivity = require("../views/AdditionalInformationActivity");
const GuestInformationActivity = require("../views/GuestInformationActivity");
const AddressActivity = require("../views/AddressActivity");
const EducationActivity = require("../views/EducationActivity");
const ExperienceActivity = require("../views/ExperienceActivity");
const CommProfSearchActivity = require("../views/CommProfSearchActivity");
const ProfileActivity = require("../views/ProfileActivity");
const AnnouncementDetailActivity = require("../views/AnnouncementDetailActivity");

const ContentPreviewScreen = require("../views/ContentPreviewScreen");
const QRActivity = require("../views/QRActivity");
// ScreenActions
const RootScreenActions = require("../actions/RootScreenActions");

var determineScreen = (screenName, state) => {
  var screen;


  // Space has been added for dir strucuture
  // add accordingly
  switch (state.currScreen) {
    case "CourseEnrolledActivity":
      screen = new(CourseEnrolledActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "SplashScreenActivity":
      screen = new(SplashScreenActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "LanguageSelectActivity":
      screen = new (LanguageSelectActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "LanguageSelectActivitySt":
      screen = new (LanguageSelectActivitySt(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "DataSyncScreenActivity":
      screen = new(DataSyncScreenActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "SettingsScreenActivity":
      screen = new(SettingsScreenActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "AboutUsActivity":
      screen = new(AboutUsActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "AboutUsScreen":
      screen = new(AboutUsScreen(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "WelcomeScreenActivity":
      screen = new(WelcomeScreenActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "StateSelectActivity":
      screen = new(StateSelectActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "MainActivity":
      screen = new(MainActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "ViewBatchActivity":
      screen = new(ViewBatchActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "UserActivity":
      screen = new(UserActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "AdditionalInformationActivity":
      screen = new(AdditionalInformationActivity(dispatcher, RootScreenActions))(null,null,state);
      break;
    case "GuestInformationActivity":
      screen = new(GuestInformationActivity(dispatcher, RootScreenActions))(null,null,state);
      break;
    case "ModuleDetailActivity":
      screen = new(ModuleDetailActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "ContentPreviewScreen":
      screen = new(ContentPreviewScreen(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "AnnouncementDetailActivity":
       screen = new(AnnouncementDetailActivity(dispatcher,RootScreenActions))(null,null, state);
       break;
    case "CourseInfoActivity":
      screen = new(CourseInfoActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "AnnouncementViewAllActivity":
      screen = new(AnnouncementViewAllActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "NotificationActivity":
      screen = new(NotificationActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "ResourceDetailActivity":
      screen = new(ResourceDetailActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "ResourceViewAllActivity":
      screen = new(ResourceViewAllActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "CourseViewAllActivity":
      screen = new(CourseViewAllActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "SearchActivity":
      screen = new(SearchActivity(dispatcher, RootScreenActions))(null, null, state);
      break;
    case "FilterActivity":
      screen = new(FilterActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "CommProfSearchActivity":
      screen = new(CommProfSearchActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "ProfileActivity":
      screen = new(ProfileActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "AddressActivity":
      screen = new(AddressActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "EducationActivity":
      screen = new(EducationActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "ExperienceActivity":
      screen = new(ExperienceActivity(dispatcher, RootScreenActions))(null, null, state);
      break;

    case "RootScreen":
      screen = new(RootScreen(dispatcher,RootScreenActions))(null, null,state) ;
      break;

    case "QRActivity":
      screen = new(QRActivity(dispatcher,RootScreenActions))(null, null,state) ;
      break;
  }

  return screen;
}

var returnIfCached = function(screenName) {
  return window.__CACHED_SCREENS[screenName];
}

var renderRootScreen = (state, dispatcher) => {
  window.__ROOTSCREEN = new(RootScreen(dispatcher, RootScreenActions))({}, null, state);
  return window.__ROOTSCREEN;
}

var updateNode = function(data) {
  var oldScreenId = window.__CACHED_SCREENS[data.action].screen.layout.idSet.id;
  window.__MODE = (new Date()).getTime() + " mode";
  window.__CACHED_SCREENS[data.action].screen = determineScreen(data.action, data.state);
  // delete old id
}

window.__CLEAR_STACK = function(screenName) {
  window.__SCREEN_STACK = [screenName];
}

var addToStack = function(screenName, screenData) {
  if (typeof screenData.screen.shouldStackScreen !== "undefined" && !screenData.screen.shouldStackScreen)
    return;

  var stackLen = window.__SCREEN_STACK.length;

  if (!stackLen)
    window.__SCREEN_STACK.push(screenName);
  else if (window.__SCREEN_STACK[stackLen - 1] !== screenName)
    window.__SCREEN_STACK.push(screenName);
}

var renderScreen = function(data) {
  JBridge.hideKeyboard();

  var screen;
  var isCached = false;
  var takeFromCache = true;
  var screenData = window.__CACHED_SCREENS[data.action];


  if (screenData) {
    isCached = true;

    screen = screenData.screen;

    if (typeof screen.shouldCacheScreen !== "undefined" && !screen.shouldCacheScreen) {
      console.info("updating screen ", data.action);
      updateNode(data);
      takeFromCache = false;
      console.log("data.action", screen);
    }
  } else {
    window.__ANIMATE_DIR = 1;
    screen = determineScreen(data.action, data.state);
    window.__CACHED_SCREENS[data.action] = {
      index: window.__SCREEN_COUNT,
      screen: screen,
      timeStamp: (new Date()).getTime(),
    }

    window.__SCREEN_COUNT++;
    screenData = window.__CACHED_SCREENS[data.action];
  }

  addToStack(data.action, window.__CACHED_SCREENS[data.action]);
  return { screen: screenData.screen, isCached: isCached, takeFromCache: takeFromCache }
}

var appendToRoot = function(screen) {
  window.__SCREEN_INDEX++;
  window.__ROOTSCREEN.appendChild(window.__ROOTSCREEN.idSet.root, screen.render(), window.__SCREEN_INDEX, screen.afterRender);
}

var getDirection = function() {
  if (window.__CACHED_SCREENS[window.__CURR_SCREEN].timeStamp >= window.__CACHED_SCREENS[window.__PREV_SCREEN].timeStamp)
    return 1;

  return -1;
}

var handleGoBack = function(data) {
  JBridge.hideKeyboard();

  var stackLen = window.__SCREEN_STACK.length;
  var cmd = "";
  if (stackLen == 1) {
    __ROOTSCREEN.minimizeApp();
    return;
  }

  var screenData = window.__CACHED_SCREENS[window.__CURR_SCREEN];
  if (screenData.screen.onBackPress) {
    if (!screenData.screen.onBackPress()) {
      console.log("failed");
      return;
    }
  }


  window.__PREV_SCREEN = window.__SCREEN_STACK[stackLen - 1];
  window.__CURR_SCREEN = window.__SCREEN_STACK[stackLen - 2];
  window.__SCREEN_STACK.pop();

  var screen = window.__CACHED_SCREENS[window.__CURR_SCREEN].screen;
  var state = R.merge(data.state, { currScreen: window.__CURR_SCREEN });

  data = R.merge(data, { action: window.__CURR_SCREEN, state: state });

  if (typeof screen.shouldCacheScreen !== "undefined" && !screen.shouldCacheScreen) {
    console.info("updating screen ", window.__CURR_SCREEN);
    updateNode(data);
    window.__ANIMATE_DIR = getDirection();
    appendToRoot(window.__CACHED_SCREENS[window.__CURR_SCREEN].screen);
  } else {
    window.__ANIMATE_DIR = -1;
    screen.onPop(data.state, "backPress");
  }
}

var handleScreenActions = function(data) {
  var currView;
  var res;

  console.log("action", data.action)
  console.log("screen", data.state.currScreen)

  if (data.action == "GO_BACK") {
    console.log("going back");
    handleGoBack(data);
    return {};
  }

  if (data.state.isInit) {
    console.info("App Start");
    currView = renderRootScreen(data.state, dispatcher);

    dispatcher('SCREEN', data.state.currScreen, {});
    return { render: currView.render() };
  }

  if (window.__CURR_SCREEN == data.action) {
    console.warn("Screen already rendered ", window.__CURR_SCREEN);
    return {};
  }

  if (!window.__CURR_SCREEN && !window.__PREV_SCREEN) {
    console.info("First Screen Append");
    window.__CURR_SCREEN = data.action;
    appendToRoot(renderScreen(data).screen);
    return {};
  }

  window.__PREV_SCREEN = window.__CURR_SCREEN;
  window.__CURR_SCREEN = data.action;

  res = renderScreen(data);

  console.log(res);
  if (!res.isCached) {
    appendToRoot(res.screen);
    return {};
  } else if (res.takeFromCache) {
    window.__ANIMATE_DIR = getDirection();

    if (res.screen.onPop)
      res.screen.onPop(data.state);
  } else {
    console.log("appendToRoot");
    window.__ANIMATE_DIR = getDirection();
    appendToRoot(res.screen);
  }

  return {};
}

var Containers = {
  handleStateChange: (data) => {
    var currView;

    if (data.stateHandler == "SCREEN")
      return handleScreenActions(data);

    currView = window.__CACHED_SCREENS[stateHandler].screen;
    return currView.handleStateChange(data) || {};
  }
}

dispatcher = require("@juspay/mystique-backend").stateManagers.dispatcher(Containers, uiHandler, reducer);

module.exports = {
  init: () => {
    var initialState = {};
    dispatcher("SCREEN", "INIT_UI", initialState);
  },
  changeScreen: (screen, state) => {
    console.log("container", state)
    dispatcher("SCREEN", screen, state);
  }
}
