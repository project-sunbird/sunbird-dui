window.__ENV = 0;

const getScreenDetails = () => {
  try {
    let details = JSON.parse(Android.getScreenDimensions());
    return {
      screen_width: details.width + "",
      screen_height: details.height + ""
    }
  } catch (err) {
    console.error("error in gettting screen dimensions, setting default values", err)
    return {
      screen_width: "720",
      screen_height: "1920"
    }
  }
}

module.exports = function() {
  if (!window.__ENV) {
    window.__DEVICE_DETAILS = getScreenDetails();
  }
}
