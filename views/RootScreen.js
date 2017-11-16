var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");

var Snackbar = require('../components/Sunbird/SnackBar')

var TextStyle = require("../res/TextStyle");
var Symbols = require("../res/Symbols").symbol;
var Colors = require("../res/Colors").color;
var Styles = require("../res/Styles");
var Font = require("../res/Font");
var objectAssign = require('object-assign');

var LoaderDialog = require('../components/Sunbird/core/LoaderDialog');
var PageFilterPopup = require('../components/Sunbird/PageFilterPopup');
var CustomPopUp = require('../components/Sunbird/CustomPopUp');
var PreviewImagePopup = require('../components/Sunbird/PreviewImagePopup');
var ContentLoaderDialog = require('../components/Sunbird/core/ContentLoaderDialog');
var PermissionDeniedDialog = require('../components/Sunbird/core/PermissionDeniedDialog');
var LanguagePopup = require('../components/Sunbird/core/LanguagePopup');
var ForceUpgradePopup = require('../components/Sunbird/ForceUpgradePopup');
var ProfileImagePopUp = require('../components/Sunbird/ProfileImagePopUp');


const Str = require("../res/Strings") ;


class RootScreen extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'root',
      'filterDialog',
      'blurContainer',
      'popupContainer'
    ]);

    window.__RootScreen = this;
    window.__CurrentLanguage = JBridge.getKey("languagePref", "en_US");
    window.__S = Str.strings();
    window.setLanguage = Str.setLanguage;
    window.__TextStyle = TextStyle;
    window.__Symbols = Symbols;
    window.__Colors = Colors;
    window.__Styles = Styles;
    window.__Font = Font;
    window.__ObjectAssign = objectAssign;


    window.__userOrgImg=JBridge.getFromSharedPrefs("org_img");
    if(window.__userOrgImg==="__failed"){
      window.__userOrgImg="ic_launcher";
    }

    console.log("RootScreen")

    this.setStatusBarColor(window.__Colors.BLACK);

    window.__reRender = this.reRenderRoot;

  }

  handleStateChange = () => {
    return true;
  }

  setStatusBarColor(color) {
    let _color = "set_color=android.graphics.Color->parseColor:s_" + color + ";";

    Android.runInUI(
      "set_win=ctx->getWindow;get_win->addFlags:i_-2147483648;" + _color + "get_win->setStatusBarColor:get_color",
      null
    );
  }

  reRenderRoot = () => {
    this.replaceChild(this.idSet.popupContainer, this.getBody().render(), 0);
    console.log("before BNavFlowRestart");
    // window.__BNavFlowRestart();
    console.log("after BNavFlowRestart");
  }

  getBody = () => {
    return (
      <RelativeLayout>
        <ForceUpgradePopup/>
        <LoaderDialog/>
        <PageFilterPopup/>
        <ContentLoaderDialog/>
        <PermissionDeniedDialog/>
        <CustomPopUp/>
        <PreviewImagePopup
          defaultImage="https://pbs.twimg.com/media/CRafzhtWIAEQ2c9.png"/>
        <LanguagePopup/>
        <ProfileImagePopUp
          height="match_parent"
          width="match_parent"/>
        <Snackbar/>

      </RelativeLayout>
    );
  }

  render() {
    this.layout = (
      <RelativeLayout
        root="true"
        width="match_parent"
        height="match_parent">

        <LinearLayout
          orientation="vertical"
          width="match_parent"
          height="match_parent">

          <RelativeLayout
            id = {this.idSet.root}
            width="match_parent"
            height="match_parent">
          </RelativeLayout>

        </LinearLayout>

        <RelativeLayout
          id = {this.idSet.popupContainer}>
          {this.getBody()}
        </RelativeLayout>
      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(RootScreen);
