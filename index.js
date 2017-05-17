import containers from './containers/container';

import ext from './ext';
import { main } from './output/Main/index.js';
import { home } from './output/Main/index.js';

const purescriptMain = main;
const purescriptHome = home;

// import lock from './lock';
// require('es6-promise').polyfill();
ext();

function getCurrTime() {
  return (new Date()).getTime();
}

if (typeof window !== "undefined") {
  window.callJSCallback = require("@juspay/mystique-backend/").helpers.android.callbackMapper.callJSCallback;
  window.__WIDTH = window.__DEVICE_DETAILS.screen_width;
  window.__HEIGHT = window.__DEVICE_DETAILS.screen_height;
  window.__ID = 1;
  window.__NODE_ID = 1;
  window.__SCREEN_INDEX = -1;
  window.__PROXY_FN = {};
  window.__FN_INDEX = 0;
  window.__FN_MAP = {};
  window.__ROOTSCREEN = null;
  window.__CACHED_SCREENS = {};
  window.__SCREEN_COUNT = 0;
  window.__CURR_SCREEN = null;
  window.__PREV_SCREEN = null;
  window.__ANIMATE_DIR = null;
  window.__SCREEN_STACK = [];
  window.__LAST_FN_CALLED = null;
  window.__THROTTELED_ACTIONS = [];
  window.__ALL_ONCLICKS = [];

  window.callUICallback = function() {
    var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    var fName = args[0]
    var functionArgs = args.slice(1)
    var currTime;
    var timeDiff;

    if (window.__ALL_ONCLICKS.indexOf(fName) != -1) {
      if (args[2] && args[2] == "feedback") {
        JBridge.setClickFeedback(args[1]);
        return;
      }
    }

    if (window.__THROTTELED_ACTIONS.indexOf(fName) == -1) {
      window.__PROXY_FN[fName].call(null, ...functionArgs);
    } else if (window.__LAST_FN_CALLED && (fName == window.__LAST_FN_CALLED.fName)) {
      currTime = getCurrTime();
      timeDiff = currTime - window.__LAST_FN_CALLED.timeStamp;

      // add the lock file
      // window.__LOCK.lastActionTime = currTime;

      if (timeDiff >= 2000) {
        console.log("BUTTON_CLICKED_" + window.__CURR_SCREEN);
        window.__PROXY_FN[fName].call(null, ...functionArgs);
        window.__LAST_FN_CALLED.timeStamp = currTime;
      } else {
        console.warn("function throtteled", fName);
        console.warn("time diff", timeDiff);
      }
    } else {
      console.log("BUTTON_CLICKED_" + window.__CURR_SCREEN);
      currTime = getCurrTime();
      // window.__LOCK.lastActionTime = currTime;
      window.__PROXY_FN[fName].call(null, ...functionArgs);
      window.__LAST_FN_CALLED = {
        timeStamp: (new Date()).getTime(),
        fName: fName
      }
    }
  };

  window.onBackPressed = () => {
    console.log("onBackPressed");
    window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onBackPressed();
  }

  window.onActivityLifeCycleEvent = (event) => {
    console.log("-->", event);

    if (window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onActivityLifeCycleEvent) {
      window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onActivityLifeCycleEvent(event);
    }
  }
}

const duiShowScreen = (callback, state) => {
  window.__duiCb = callback;
  if (state.screen != window.__CURR_SCREEN) {
    var stackLen = window.__SCREEN_STACK.length;

    if (stackLen > 2) {
      if (window.__SCREEN_STACK[stackLen - 2] == state.screen) {
        containers.changeScreen("GO_BACK", state);
      } else {
        containers.changeScreen(state.screen, state);
      }
    } else {
      containers.changeScreen(state.screen, state);
    }
  } else {
    window.__CACHED_SCREENS[__CURR_SCREEN].screen.onPop(state);
  }
};

const setCallback = (callback, state) => {
  window.__duiCb = callback;
};


window.otpRules = {
  "matches": {
    "sender": ["DM-JUSPAY"],
    "message": "Your otp is"
  },
  "otp": "\\d{6}",
  "bank": "BHIM",
  "otp_timeout": 60
};

const runDuiCallback = (state) => {
  let callback = window.__duiCb;
  callback ? callback(state)() : state;
};

let purescriptInit = () => {
  window.__duiShowScreen = duiShowScreen;
  window.__duiCb = null;
  window.__runDuiCallback = runDuiCallback;
  window.__setCallback = setCallback
  window.__runViewPagerFlow = purescriptHome;
  purescriptMain();
};

window.onWebSocketMessage = function(message) {
  console.log(atob(message));
}

purescriptInit({});
