
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var utils = require('../utils/GenericFunctions');
window.R = require("ramda");

class SplashScreenActivity extends View {

  constructor(props, children, state) {
    super(props, children, state);
    window.__Check = 0;
    this.icon;
    this.textToDisplay;
    this.getUserToken();
    this.getApiUrl();
    this.getIcon();
    this.getTextToDisplay();
    window.__pressedLoggedOut=false;
    this.isUserOnboarded = JBridge.getFromSharedPrefs("isUserOnboarded");
  //  window.__getGenieEvents = this.dummyFunction;
  }

  dummyFunction = (response) => {
    console.log("response genie events",JSON.parse(utils.decodeBase64(response)));
  }

  getTextToDisplay = () => {
      var textToDisplay = JBridge.getFromSharedPrefs("orgName");
      if (textToDisplay == "__failed" || textToDisplay == ""){
          textToDisplay = JBridge.getAppName();
      }
      this.textToDisplay = textToDisplay;
  }

  getIcon = () => {
    var icon = JBridge.getFromSharedPrefs("logo_url");
    if (icon  == "__failed" || icon == "undefined" || icon == "") {
      icon = "ic_launcher";
    }
    this.icon = icon;
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  getApiUrl = ()=>{
    var Url = JBridge.getApiUrl();
    window.__loginUrl = "https://"+Url;
    window.__apiUrl = "https://"+Url
    window.__deepLinkUrl = Url;
  }

  getUserToken = ()=>{
    window.__apiToken = JBridge.getFromSharedPrefs("api_token");
    console.log("in user token", window.__apiToken);

    if (window.__apiToken == "__failed" || window.__apiToken == "") {
        JBridge.getApiToken(callbackMapper.map(token => {
            console.log("user token", token[0]);
            window.__apiToken = token[0];
            JBridge.setInSharedPrefs("api_token", token[0]);
        }));
    }
  }

  afterRender = () => {

    var epoch = JBridge.epochTime();
      var connectionType = JBridge.checkConnectionType();
      if(epoch < 26979 || connectionType == "wifi")
        JBridge.syncTelemetry(15000); // 15 seconds delay if its first day of installation or device is connected to wifi
      else
        JBridge.syncTelemetry(30000); // 30 seconds delay otherwise

    JBridge.logsplashScreenEvent();
    JBridge.logCorrelationPageEvent("SPLASHSCREEN","","");

    setTimeout(() => {
      if (window.__loggedInState == "YES" || window.__loggedInState == "GUEST") {
        var event = { tag: "OPEN_UserActivity", contents: [] }
      }
      else if (this.isUserOnboarded == "__failed" || this.isUserOnboarded == "false") {
        var event = { tag: "OPEN_LanguageSelectActivity", contents: [] }
      }
      window.__runDuiCallback(event);
    }, 2000);
  }


  handleStateChange = () => {
  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        width="match_parent"
        height="match_parent"
        gravity="center"
        background={window.__Colors.WHITE}
        orientation="vertical">

          <ImageView
            height="250"
            width="250"
            layout_gravity="center"
            circularImageUrl = {"1," + this.icon}/>
          <TextView
            text={this.textToDisplay}
            margin="20,120,20,20"
            layout_gravity="center"
            textSize = "18"
            height="wrap_content"/>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreenActivity);
