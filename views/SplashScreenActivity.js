
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");

var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var objectAssign = require('object-assign');

window.R = require("ramda");

class SplashScreenActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "SplashScreenActivity"
    window.__apiToken = ""
    window.__Check = 0;
    this.getUserToken()
    window.__pressedLoggedOut=false;

    this.icon = JBridge.getFromSharedPrefs("logo_url") == "__failed" ? "ic_launcher" : JBridge.getFromSharedPrefs("logo_url");

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
    console.log("in user token");
    window.__apiToken = JBridge.getFromSharedPrefs("api_token");
    var callback = callbackMapper.map(function(token){
      console.log("user token",token[0]);
      window.__apiToken = token[0];
      JBridge.setInSharedPrefs("api_token", token[0]);
    });

    if (window.__apiToken == "__failed")
      JBridge.getApiToken(callback);

  }

  afterRender = () => {
    JBridge.syncTelemetry();
    JBridge.logsplashScreenEvent();
    JBridge.logCorrelationPageEvent("SPLASHSCREEN","","");
    // JBridge.setInSharedPrefs("logged_in","YES");
    // JBridge.setInSharedPrefs("user_id", "029c72b5-4691-4bf2-a6de-72b18df0b748");
    // JBridge.setInSharedPrefs("user_name", "vinay");
    // JBridge.setInSharedPrefs("user_token", "029c72b5-4691-4bf2-a6de-72b18df0b748");

    // window.__loginUrl = "https://staging.ntp.net.in";

    // window.__apiUrl = "https://staging.ntp.net.in";

    // window.__deepLinkUrl = "staging.ntp.net.in";
    this.getApiUrl();

    setTimeout(() => {
      var whatToSend = [];
      // var event = { tag: "OPEN_WelcomeScreenActivity", contents: whatToSend};
      // if(("YES"==JBridge.getFromSharedPrefs("logged_in"))){
        var event = { tag: "OPEN_UserActivity", contents: whatToSend}
    // }
      window.__runDuiCallback(event);
    }, 2000);
  }


  handleStateChange = () => {
    return true;
  }

  render() {
    var imgUrl = "ic_launcher";
    var textToDisplay = JBridge.getAppName();//window.__S.SPLASH_MESSAGE;
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed"){
      imgUrl = JBridge.getFromSharedPrefs("logo_url");
    }
    if (JBridge.getFromSharedPrefs("orgName") != "__failed"){
      textToDisplay = JBridge.getFromSharedPrefs("orgName");
    }

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
            circularImageUrl = {"1," + imgUrl}/>
          <TextView
            text={textToDisplay}
            margin="20,120,20,20"
            layout_gravity="center"
            height="wrap_content"/>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreenActivity);
