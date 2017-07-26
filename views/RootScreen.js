var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextStyle = require("../res/TextStyle");
var Symbols = require("../res/Symbols").symbol;
var Colors = require("../res/Colors").color;
var Styles = require("../res/Styles");
var Font = require("../res/Font");
var objectAssign = require('object-assign');

var LoaderDialog = require('../components/Sunbird/core/LoaderDialog');
var PageFilterPopup = require('../components/Sunbird/PageFilterPopup');

const Str = require("../res/strings") ;


class RootScreen extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'root',
      'filterDialog',
      'blurContainer'
    ]);

    window.__RootScreen = this;
    window.__S = Str.strings();
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
        <LoaderDialog/>
        <PageFilterPopup/>
      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(RootScreen);
