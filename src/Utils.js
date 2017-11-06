
"use strict";
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");

var callbackMapper = {
  map: function(fn) {
    if (typeof window.__FN_INDEX !== 'undefined' && window.__FN_INDEX !== null) {
      var proxyFnName = 'F' + window.__FN_INDEX;
      window.__PROXY_FN[proxyFnName] = fn;
      window.__FN_INDEX++;
      return proxyFnName;
    } else {
      throw new Error("Please initialise window.__FN_INDEX = 0 in index.js of your project.");
    }
  },
  callJSCallback: function() {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    var fName = params[0];
    var functionArgs = params.slice(1);
    window.__PROXY_FN[fName].call(null, functionArgs);
  }
}

exports["log'"] = function(tag,dataToPrint) {
  var printThis=tag+"===\t==="+dataToPrint
  console.log(printThis)
  return printThis
}

exports["ui'"] = function(err) {
  return function(callback) {
    return function(state) {

      return function(dummyEvents) {
        return function() {
          var screenName = state.constructor.name;
          console.log("dummyEvents", dummyEvents)
          console.log("screenName", screenName)
          console.log("state in ui", state)

          var currentScreen = window.__CACHED_SCREENS[window.__CURR_SCREEN];

          if (currentScreen == undefined || currentScreen.screenName == undefined || (currentScreen.screenName != screenName)) {
            window.__duiShowScreen(callback, { screen: screenName, data: state });
            console.log("ReNDERING new SCREEN ", screenName)
          } else {
            console.log("not ReNDERING SAME SCREEN ")
              //add check for handleStateChnage property
              //currentScreen.handleStateChange(state);
          }
        }
        var noAction = false;
        if (noAction) {
          setTimeout(function() {
            callback(state)();
          }, 1000);
        } else {
          window.handleBackPress = function() {
            state.event = 'goBack';
            callback(state)();
          };
        }
      };
    };
  };
};

exports["showUI'"] = function(callback) {
  return function(errCallback) {
    return function(state) {
      return function(noAction) {
        return function() {
          console.log("showUI exports", state)
          window.__duiShowScreen(callback, state);
          if (noAction) {
            setTimeout(function() {
              callback(state)();
            }, 1000);
          } else {
            window.handleBackPress = function() {
              state.event = 'goBack';
              callback(state)();
            };
          }
        };
      };
    };
  };
};

exports["callbackListner'"] = function(callback) {
  return function(errCallback) {
    return function(state) {
      return function(noAction) {
        return function() {
          window.__setCallback(callback, state);

          if (noAction) {
            setTimeout(function() {
              callback(state)();
            }, 1000);
          } else {
            window.handleBackPress = function() {
              state.event = 'goBack';
              callback(state)();
            };
          }
        };
      };
    };
  };
};

exports["killApp'"] = function(data){
  JBridge.killApp();
  return " ";
}


exports["getJsonFromString"] = function(normalString) {
  return JSON.parse(normalString);

};
exports["getApiUrl"] = function() {
  var url;
  var url = JBridge.getApiUrl();
  return "https://"+url +"/api";
};

exports["getApiUrl1"] = function() {
  var url;
  var url = JBridge.getApiUrl();
  return "https://"+url;
};



exports["sendUpdatedState'"] = function(state) {

  console.log('sendupdatedstate', state);
  console.log("------------------>\t\tUPDATING state via handleStateChange")

  var currentScreen = window.__CACHED_SCREENS[window.__CURR_SCREEN];
  currentScreen = currentScreen.hasOwnProperty('screen') ? currentScreen.screen : {};


  if (currentScreen.hasOwnProperty('handleStateChange')) {
    currentScreen.handleStateChange(state);
  } else {
    console.error('Current screen can not handle state changes');
  }
  return "Done";
};

exports["saveToMemory"] = function(key, data) {
  console.log("--> saving in Shared Pref with key [] => ", key)
  console.log("--> saving in Shared Pref with val [] => ", data)
  JBridge.setInSharedPrefs(key, data);

};

exports["readFromMemory"] = function(key) {
  var data = JBridge.getFromSharedPrefs(key)
  console.log("--> reading from Shared Pref with key [] => ", key, "\nGOT VAL AFTER: ", data)
  return data;
};

exports["sendToScreen'"] = function(data) {

  console.log('sendToScreen', data);
  console.log("------------------>\t\tSending data to screen via getDataFromPureScript")

  var currentScreen = window.__CACHED_SCREENS[window.__CURR_SCREEN];
  currentScreen = currentScreen.hasOwnProperty('screen') ? currentScreen.screen : {};

  if (currentScreen.hasOwnProperty('getDataFromPureScript')) {
    currentScreen.getDataFromPureScript(data);
  } else {
    console.error('Current screen can not receive changes, implemnt getDataFromPureScript');
  }

  // return "SENT";

};

exports["updateState'"] = function(success) {
  return function(err) {
    return function(data) {
      return function(state) {
        return function() {
          state = window.R.merge(state, data);
          success(state)();
        };
      };
    };
  };
};



exports["getLoginStatus'"] = function(success) {
  return function(error) {
    return function(response) {
      return function() {
        console.log(response);
        if (response.response.error) {
          success(false);
        } else {
          success(true);
        }
      };
    };
  };
};

exports["getCurrentDay"] = function(days) {
  var d = new Date();
  var mm = d.getMonth() + 1;
  var dd = d.getDate();
  dd = dd + days;
  return [d.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
}

exports["callAPI'"] = function(success) {
  return function(err) {
    return function(method) {
      method = method.constructor.name;
      return function(url) {
        return function(data) {
          return function(headers) {
            console.log("------------------------> REQUEST AT URL :", url)
            console.log("------------------------> DATA AT URL :", data)
            console.log("------------------------> REQUEST headers :", headers)
            headers = headers.map(function(header) {
              var hdr = {};
              hdr[header.value0] = header.value1;
              return hdr;
            });
            var shouldReturnCallback=true;
            var callback = callbackMapper.map(function(params) {
              console.log("in---------------------------------------------- position")
              if(!shouldReturnCallback){
                  console.log("TIMEOUT reached")
                  return;
                }
               console.log("GOT -> from droid :",params)
               console.log(arguments);
              if (arguments && arguments[0].length >= 3 && shouldReturnCallback) {
                shouldReturnCallback=false;

                var args = [];
                args.push(arguments);

                // console.log(arguments);
                // console.log(params);

                success({
                  status: args[0],
                  response: "",
                  statusCode: 1
                })();
              } else {
                shouldReturnCallback=false;
                console.log("Invalid Response from android ", arguments);
                success({
                  status: "failed",
                  response: {},
                  statusCode: "500"
                })();
              }
            });
             setTimeout(function() {
                if(!shouldReturnCallback){
                  console.log("Got Response at ",url)
                  return;
                }
                console.log("TIMEOUT for ",url)
                shouldReturnCallback=false;
                success({
                  status: "failed",
                  response: {},
                  statusCode: "504"
                })();
              }, window.__API_TIMEOUT);
            console.log("->","BEGIN TEST")
            JBridge.callAPI(method, url, btoa(JSON.stringify(data)), btoa(JSON.stringify(headers)), callback);
          };
        };
      };
    };
  };
};

exports["checkPermission'"] = function(success) {
  return function(err) {
    var callback = callbackMapper.map(function(params) {
      success(params)();
      //have to handle the case of error!
    });
    JBridge.checkPermission(callback)
  }
}

exports["setPermissions'"] = function(success) {
  return function(err) {
    var callback = callbackMapper.map(function(params) {
      success(params)();
      //have to handle the case of error!
    });
    JBridge.setPermissions(callback)
  }
}


exports["getConsumerId'"] = function(success) {
  return function(err) {
    return function() {
      // success(JBridge.getFromSharedPrefs("registrationToken"))();
      success("123")();
    };
  };
};

exports["getDeviceId'"] = function(success) {
  return function(err) {
    return function() {
      // success(JBridge.getFromSharedPrefs("registrationToken"))();
      success("1233245454656")();
    };
  };
};
exports["getUserId'"] = function(success) {
  return function(err) {
    return function() {
      // success(JBridge.getFromSharedPrefs("registrationToken"))();
      success("dfjkv345")();
    };
  };
};

exports["getCurrDate"] = function(){
  var d = new Date();
  return this.formatDate(d)
}

exports["formatDate"] = function(d){
  var temp = d.toString();
  var month = d.getMonth();
  if(month<10){
    month = "0" + d.getMonth();
  }
  var day = d.getDate();
  if(day<10){
    day = "0" + d.getDate();
  }
  var res = d.getFullYear() + "-" + month + "-" + day + " " + d.getHours () + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds() + "+" + temp.substring(29,33);
  console.log("result",res)
  return res;
}

exports["getUserToken"] = function () {
  return window.__userToken;
}

exports["getUserAccessToken"] = function () {
  return window.__user_accessToken;
}
