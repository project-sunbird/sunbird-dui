var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

var SnackBar = require("../components/Sunbird/SnackBar")

var TextStyle = require("../res/TextStyle");
var Symbols = require("../res/Symbols").symbol;
var Colors = require("../res/Colors").color;
var Styles = require("../res/Styles");
var Font = require("../res/Font");

class RootScreen extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'root',
      'filterDialog',
      'blurContainer'
    ]);

    window.__RootScreen = this;

    window.__TextStyle = TextStyle;
    window.__Symbols = Symbols;
    window.__Colors = Colors;
    window.__Styles = Styles;
    window.__Font = Font;

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

  showFilterDialog = (layout) =>{
    this.showBlur();

    let cmd = this.set({
    id: this.idSet.filterDialog,
      visibility:"visible",
    });

    Android.runInUI(cmd,null);

    this.replaceChild(this.idSet.filterDialog, layout.render(), 0);
  }

  hideFilterDialog = () =>{
    this.hideBlur();
    let cmd = this.set({
    id: this.idSet.filterDialog,
      visibility:"gone",
  });

  Android.runInUI(cmd,null);
  }

  
  showBlur = () =>{
  var cmd = this.set({
      id: this.idSet.blurContainer,
      visibility:"visible",
      clickable:"true"
  });

  Android.runInUI(cmd,null);
  }

  hideBlur = () =>{
    var cmd = this.set({
      id: this.idSet.blurContainer,
      visibility:"gone",
      clickable:"false"
    });

    Android.runInUI(cmd,null);
 }

 blurClick = () =>{
  this.hideFilterDialog();
  console.log("handleBlurClick")
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

        <LinearLayout
          id = {this.idSet.blurContainer}
          clickable = "true"
          visibility = "visible"
          onClick = {this.blurClick}
          width = "match_parent"
          height = "match_parent"
          background = "#000000"
          alpha = "0.5"/>

        <LinearLayout
        width="match_parent"
        height="wrap_content"
        weight="1"
        alignParentBottom = "true,-1"
        orientation="vertical"
        id={this.idSet.filterDialog}/>


      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(RootScreen);
