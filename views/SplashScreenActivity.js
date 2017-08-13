
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var objectAssign = require('object-assign');

window.R = require("ramda");

class SplashScreenActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "SplashScreenActivity"
    window.__apiToken = JBridge.get
    this.getUserToken()
    window.__pressedLoggedOut=false;

    
    
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  getUserToken = ()=>{
    console.log("in user token")
    var callback = callbackMapper.map(function(token){
      console.log("user token",token[0]);
      window.__apiToken = token[0];
    });

    JBridge.getApiToken(callback);

    
  }

  afterRender = () => {
    JBridge.syncTelemetry();
   
    window.__loginUrl = "https://staging.ntp.net.in";
    window.__apiUrl = "https://staging.open-sunbird.org";
    

    setTimeout(() => {
      var whatToSend = [] 
      var event = { tag: "OPEN_UserActivity", contents: whatToSend}
      window.__runDuiCallback(event);
    }, 1000);
  }

  
  handleStateChange = () => {
    return true;
  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        clickable="true"
        width="match_parent"
        height="match_parent"
        orientation="vertical">

          <ImageView
            height="300"
            width="300"
            layout_gravity="center"
            imageUrl="ic_launcher"/>
          <TextView
            text={window.__S.SPLASH_MESSAGE}
            margin="20,120,20,20"
            layout_gravity="center"
            height="wrap_content"/>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreenActivity);
