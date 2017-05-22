"use strict";
var callbackMapper = require('@juspay/mystique-backend').helpers.android.callbackMapper;

exports["sendUpdatedState'"] = function(success) {
  return function(error) {
    return function(state) {
      return function() {
        var currentScreen = window.__CACHED_SCREENS[window.__CURR_SCREEN];
        if (currentScreen.hasOwnProperty('handleStateChange')) {
          currentScreen.handleStateChange(state);
          success()();
        }
      };
    };
  };
};

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


exports["setRegistrationToken'"] = function(success) {
  return function(err) {
    return function(token) {
      return function() {
        JBridge.setInSharedPrefs("registrationToken", token);
        success()();
      };
    };
  };
};

exports["getRegistrationToken'"] = function(success) {
  return function(err) {
    return function() {
      success(JBridge.getFromSharedPrefs("registrationToken"))();
    };
  };
};

exports["setEmployeeDetails'"] = function(success) {
  return function(err) {
    return function(empDetails) {
      return function() {
        JBridge.setInSharedPrefs("empDetails", JSON.stringify(empDetails));
        success()();
      };
    };
  };
};

exports["getEmployeeDetails'"] = function(success) {
  return function(err) {
    return function() {
      var empDetails = JBridge.getFromSharedPrefs("empDetails");
      console.log("empDetails", empDetails);
      success(JSON.parse(empDetails))();
    };
  };
};

exports["setLoginToken'"] = function(success) {
  return function(err) {
    return function(token) {
      return function() {
        JBridge.setInSharedPrefs("loginToken", token);
        success()();
      };
    };
  };
};

exports["getLoginToken'"] = function(success) {
  return function(err) {
    return function() {
      success(JBridge.getFromSharedPrefs("loginToken"))();
    };
  };
};


exports["getDeviceDetails'"] = function(success) {
  return function(err) {
    return function() {
      success(JSON.parse(JBridge.getDeviceDetails()))();
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

