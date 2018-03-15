var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var TextInputView = require("../components/Sunbird/core/TextInputView");
var CircularLoader = require('../components/Sunbird/core/CircularLoader');
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var ShareFilePopup = require('../components/Sunbird/ShareFilePopup');
var TextStyle = require("../res/TextStyle.js");

window.R = require("ramda");
var _this;

class SettingsScreenActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.setIds([
      "linkShareIntents",
      "popUpContainer",
      "parentId"
    ]);
    this.shouldCacheScreen = false;
    window.__SettingsScreenActivity = this;
    //this.defaultlang = this.getCurrentLanguage();
    this.visible = true;
    this.screenName = "Settings";
    _this = this;
  }

  defaultlang = () => {
    var languages = window.__RootScreen.languageMap;
    var currLanguageCode = window.__CurrentLanguage;
    for(var language in languages){
      if(languages[language]==currLanguageCode)
      return language;
    }
    return "Error getting language"
  }

  datasync = () => {
      JBridge.logSettingsClickedEvent(window.__S.DATA_SYNC);
      var whatToSend = [];
      var event = { tag: "OPEN_DataSyncScreenActivity", contents: whatToSend};
      window.__runDuiCallback(event);
  }
  handleClick = () => {
    window.__Snackbar.show(window.__S.COMING_SOON);
    }

  handleChangeLang = () => {
    JBridge.logSettingsClickedEvent(window.__S.LANGUAGE_SETTINGS);
    var whatToSend = { "profile" : JSON.stringify("{}")}
    var event = { tag: "OPEN_LanguageSelectActivitySt", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleShareClick = () => {
    var cb = (containerId) => {
      JBridge.logSettingsClickedEvent("Share");
      JBridge.shareApk(containerId);
    }
    this.SharePopup.show(window.__S.SHARE_APP.format(JBridge.getAppName()), cb);
  }

  openAboutUsActivity = () => {
    JBridge.logSettingsClickedEvent(window.__S.ABOUT_APP);
    var whatToSend = { "profile" : JSON.stringify("{}")}
    var event = { tag: "OPEN_AboutUsActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }


  onBackPressed = () => {
    if (this.SharePopup.getVisibility()){
      this.SharePopup.hide();
    } else {
      var whatToSend = [];
      var event = { tag: "BACK_SettingsScreenActivity", contents: whatToSend };
      window.__runDuiCallback(event);
    }
  }

  handleSupportClick = () => {
    var cb = (containerId) => {
      JBridge.logSettingsClickedEvent(window.__S.SUPPORT);
      JBridge.supportEmail(containerId);
    }
    this.SharePopup.show(window.__S.SEND_EMAIL, cb);
  }

  getSharePopUP = () => {
    this.SharePopup = (
      <ShareFilePopup />
    );
    return this.SharePopup;
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            padding="0,1,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getBody = (mainstr,substr,fun) => {
    return (<LinearLayout
              background= "#ffffff"
              width="match_parent"
              height="wrap_content">
            <LinearLayout
             width = "match_parent"
             onClick={fun}
             height = "wrap_content"
             clickable="true"
             background= "#ffffff"
             orientation= "horizontal">
            <LinearLayout
              width = "wrap_content"
              height = "wrap_content"
              padding = "16,16,16,16"
              orientation= "vertical">
              <TextView
                width = "wrap_content"
                textSize= "14"
                height= "wrap_content"
                color="#000000"
                //style= {TextStyle.DARK}
                text = {mainstr}/>
             <TextView
                textSize= "14"
                width = "wrap_content"
                height= "wrap_content"
                color="#000000"
                alpha="0.3"
                text = {substr}/>
             </LinearLayout>
             <LinearLayout
                height="match_parent"
                weight = "1"/>
             <ImageView
                     width="10"
                     height="10"
                     imageUrl={"ic_action_arrow_right"}
                     margin="0,25,8,0"/>
             </LinearLayout>
             </LinearLayout>);
  }

  getBody2 = (mainStr,fun) => {
     return (<LinearLayout
              background= "#ffffff"
              width="match_parent"
              height="wrap_content">
            <LinearLayout
             width = "match_parent"
             onClick={fun}
             height = "wrap_content"
             clickable="true"
             background= "#ffffff"
             orientation= "horizontal">
            <LinearLayout
              width = "wrap_content"
              height = "wrap_content"
              padding = "16,16,16,16"
              orientation= "vertical">
              <TextView
                width = "wrap_content"
                textSize= "14"
                height= "wrap_content"
                color="#000000"
                text = {mainStr}/>
             </LinearLayout>
             <LinearLayout
                height="match_parent"
                weight = "1"/>
             <ImageView
                     width="10"
                     height="10"
                     imageUrl={"ic_action_arrow_right"}
                     margin="0,25,8,0"/>
             </LinearLayout>
             </LinearLayout>);
  }

  afterRender = () => {
    JBridge.logSettingsScreenEvent("SETTINGS");
  }

  render = () => {
    this.layout = (
      <RelativeLayout
        root="true"
        width="match_parent"
        height="match_parent">
        <LinearLayout
          background="#e2e2e2"
          orientation="vertical"
          width="match_parent"
          height="match_parent">
          <SimpleToolbar
            title="Settings"
            afterRender={this.afterRender}
            width="match_parent"
            onBackPress={this.onBackPressed} />
          <LinearLayout
            width="match_parent"
            height="4"/>
          {this.getBody(window.__S.LANGUAGE_SETTINGS, window.__S.CURRENT_LANGUAGE + this.defaultlang(), this.handleChangeLang)}
          {this.getLineSeperator()}
          {this.getBody("Data Sync", "Backup your data, Transfer Telemetry", this.datasync)}
          {this.getLineSeperator()}
          {this.getBody("Device Tags", "Add/Remove Device Tags", this.handleClick)}
          <LinearLayout
            width="match_parent"
            height="4" />
          {this.getBody(window.__S.SUPPORT, window.__S.SUPPORT_MESSAGE, this.handleSupportClick)}
          {this.getLineSeperator()}
          {this.getBody2(window.__S.SHARE_APP.format(JBridge.getAppName()), this.handleShareClick)}
          {this.getLineSeperator()}
          {this.getBody2(window.__S.ABOUT_APP, this.openAboutUsActivity)}
        </LinearLayout>
        {this.getSharePopUP()}
      </RelativeLayout>
    );
    return this.layout.render();
  }
}
module.exports = Connector(SettingsScreenActivity);
