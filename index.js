
import containers from './containers/container';

import ext from './ext';
import { main } from './output/Main/index.js';
import { changeFlow } from './output/Main/index.js';
import { typeFlow } from './output/Main/index.js';
import { onBoardingFLow } from './output/Main/index.js';
var utils = require('./utils/GenericFunctions');

const purescriptMain = main;
const purescriptChangeFlow = changeFlow;
const purescriptTypeFlow = typeFlow;
const purescriptUserActivityFlow = onBoardingFLow;

const profilePopUpType = {
  EXPERIENCE: 1,
  EDUCATION: 2,
  ADDRESS: 3
}

// import lock from './lock';
// require('es6-promise').polyfill();
ext();

function getCurrTime() {
  return (new Date()).getTime();
}


String.prototype.format = function() {
    var newStr = this, i = 0;
    while (/%s/.test(newStr))
        newStr = newStr.replace("%s", arguments[i++]);
    return newStr;
};

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

  window.__API_TIMEOUT=20000; //20 seconds for timeout

  window.__apiTokenExpireCount = 0;

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
     if(window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.hasOwnProperty("onBackPressed")){
        window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onBackPressed();
    }
  }

  window.onStop = () => {
    console.log("onStop");
    if(window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.hasOwnProperty("onStop")){
      window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onStop();
    }
  }

  window.onDestroy = () =>{
    console.log("onDestroy");
    utils.clearDeeplinkPreferences();
    if(window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.hasOwnProperty("onDestroy")){
      window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onDestroy();
    }
  }

  window.onResume = () => {
    console.log("onResume");
    if(window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.hasOwnProperty("onResume")){
      window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onResume();
    }
  }

  window.onPause = () => {
    console.log("onPause");
    if(window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.hasOwnProperty("onPause")){
      window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onPause();
    }
  }


  window.onActivityLifeCycleEvent = (event) => {
    console.log("-->", event);

    if (window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onActivityLifeCycleEvent) {
      window.__CACHED_SCREENS[window.__CURR_SCREEN].screen.onActivityLifeCycleEvent(event);
    }
  }


  window.__PROFILE_POP_UP_TYPE = profilePopUpType;
}

 /*************************************
 *************Remove for debug build***
 **************************************/
 console.log("isDebuggable ", JBridge.isDebuggable());
 if (!JBridge.isDebuggable()){
   window.console.log = function(msg){}

   window.console.info = function(msg){}

   window.console.error = function(msg){}

   window.console.warn = function(msg){}

   window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
     return true;
   }
 }
/*************Until here******************
******************************************/



const duiShowScreen = (callback, state) => {
  console.log("state in indexjs",state.screen);
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
    //window.__CACHED_SCREENS[__CURR_SCREEN].screen.onPop(state);
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
  console.log("state in runDuiCallback",state);
  let callback = window.__duiCb;
  console.log("callback is ",callback,state,JSON.stringify(state))
  callback ? callback(JSON.stringify(state))() : JSON.stringify(state);
};

const logoutUser = () => {
  if (JBridge.isNetworkAvailable()){
    JBridge.logLogoutSuccess(window.__userToken);
    window.__Snackbar.show("Logged out");
    JBridge.unregisterFCM();
    JBridge.setInSharedPrefs("intentNotification", "__failed");
    JBridge.setInSharedPrefs("logged_in","NO");
    JBridge.setInSharedPrefs("user_id", "__failed");
    JBridge.setInSharedPrefs("user_name",  "__failed");
    JBridge.setInSharedPrefs("user_token",  "__failed");
    JBridge.setInSharedPrefs("refresh_token",  "__failed");
    JBridge.setInSharedPrefs("logo_url", "__failed");
    JBridge.setInSharedPrefs("logo_file_path", "__failed");
    JBridge.setInSharedPrefs("orgName", "__failed");
    JBridge.setInSharedPrefs("channelId", "__failed");
    JBridge.setParams();
    window.__pressedLoggedOut=true;
    JBridge.keyCloakLogout(window.__apiUrl + "/auth/realms/sunbird/protocol/openid-connect/logout");
    purescriptUserActivityFlow();
  } else {
    window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
  }

}

let purescriptInit = () => {
  window.__duiShowScreen = duiShowScreen;
  window.__duiCb = null;
  window.__runDuiCallback = runDuiCallback;
  window.__setCallback = setCallback
  window.__changePureScriptFlow = purescriptChangeFlow;
  window.__Logout = logoutUser
  window.__typeFlow = purescriptTypeFlow;

  purescriptMain();
};

window.onWebSocketMessage = function(message) {
  console.log(atob(message));
}

purescriptInit({});
