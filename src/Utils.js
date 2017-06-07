"use strict";
var callbackMapper = require('@juspay/mystique-backend').helpers.android.callbackMapper;


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

exports["showUI'"] = function(callback) {
  return function(errCallback) {
    return function(state) {
      return function(noAction) {
        return function() {
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
exports["sendUpdatedState'"] = function(success) {
  return function(error) {
    return function(state) {
      return function(noAction) {
        return function() {
          console.log('sendupdatedstate', state);
          console.log("------------------>\t\tUPDATING state via handleStateChange")
          if (!noAction) {
            window.__duiCb = success;
          }

          var currentScreen = window.__CACHED_SCREENS[window.__CURR_SCREEN];
          currentScreen = currentScreen.hasOwnProperty('screen') ? currentScreen.screen : {};

          if (currentScreen.hasOwnProperty('handleStateChange')) {
            currentScreen.handleStateChange(state);
          } else {
            console.error('Current screen can not handle state changes');
          }

          if (noAction) {
            setTimeout(function() {
              success()();
            }, 200);
          }
        };
      };
    };
  };
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
            console.log("Headers are ", headers);
            headers = headers.map(function(header) {
              var hdr = {};
              hdr[header.value0] = header.value1;
              return hdr;
            });
            console.log("Headers are ", headers);
            console.log("Response", arguments)
            var callback = callbackMapper.map(function(params) {
              console.log("Response from android", params)
              if (arguments && arguments[0].length >= 3) {
                success({
                  status: arguments[0],
                  response: JSON.parse(arguments[1] || "{}"),
                  statusCode: arguments[2]
                })();
              } else {
                console.log("Invalid Response from android ", arguments);
                success({
                  status: "failed",
                  response: {},
                  statusCode: "500"
                })();
              }
            });

            JBridge.callAPI(method, url, btoa(JSON.stringify(data)), btoa(JSON.stringify(headers)), true, callback);
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
