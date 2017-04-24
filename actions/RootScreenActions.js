const callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

module.exports = (dispatcher) => {
  return {
    showScreen : (action, payload) => {
      dispatcher("SCREEN", action, payload);
    }
  };
}
