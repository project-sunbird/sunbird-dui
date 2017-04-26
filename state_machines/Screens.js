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
      localState.currScreen = "CHOOSE_COURSE";
      break;

    case "SPLASH":
      localState.isInit = false;
      localState.currScreen = "SPLASH";
      break;

    case "CHOOSE_COURSE":
      localState.isInit = false;
      localState.currScreen = "CHOOSE_COURSE";
      break;

    case "GO_BACK":
      break;

    default:
      throw new Error("Invalid action Passed : action name" + action);
  }

  return objectAssign({}, state, localState);
};
