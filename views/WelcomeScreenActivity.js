var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var debounce = require("debounce");
var objectAssign = require('object-assign');


var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");


class WelcomeScreenActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([]);
    this.shouldCacheScreen = false;
    this.screenName = "WelcomeScreenActivity";
  }
  showLanguagesScreen=()=>{
    var whatToSend = []
    var event = { tag: "OPEN_StateSelectActivity", contents: whatToSend };
    window.__runDuiCallback(event);
  }
  render(){
    var imgUrl = "ic_launcher";
    var textToDisplay = JBridge.getAppName();
    var tempImageHolder = JBridge.getFromSharedPrefs("logo_url")||"";
    if (tempImageHolder != "__failed" && tempImageHolder != ""){
      imgUrl = tempImageHolder;
    }
    this.layout=(
    <LinearLayout
    root="true"
    clickable="true"
    width="match_parent"
    height="match_parent"
    gravity="center"
    orientation="vertical"
    background="#ffffff">
      <LinearLayout 
       weight="1"/>
      <ImageView
        height="80"
        width="80"
        circularImageUrl = {"1," + imgUrl}/>
      <TextView
        height="wrap_content"
        width="wrap_content"
        text={window.__S.WELCOME_M1.format(textToDisplay)}
        margin="10,0,10,10"
        style={window.__TextStyle.textStyle.HEADING.DARK}/>
      <TextView
        height="wrap_content"
        width="wrap_content"
        text={"Structured education for the educators"}
        margin="10,0,10,10"
        style={window.__TextStyle.textStyle.HINT.BOLD}/>  
      <LinearLayout 
       weight="1"/>
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        cornerRadius="5"
        background={window.__Colors.PRIMARY_DARK}
        alignParentBottom="true,-1"
        margin="30,0,30,30"
        gravity="center">
        <TextView
        text={window.__S.SELECT_STATE_TO_GET_STARTED}
        textAllCaps="true"
        padding="10,10,10,10"
        onClick={this.showLanguagesScreen}
        textStyle={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.TIME}/>
      </LinearLayout>
  </LinearLayout>
  );
  return this.layout.render();  
      
  }
}

module.exports = Connector(WelcomeScreenActivity);


