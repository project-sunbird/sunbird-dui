
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
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
    JBridge.syncTelemetry();
    JBridge.logsplashScreenEvent();
    JBridge.logCorrelationPageEvent("SPLASHSCREEN","","");

    setTimeout(() => {
      var whatToSend = [];
      var event = { tag: "OPEN_UserActivity", contents: whatToSend}
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
