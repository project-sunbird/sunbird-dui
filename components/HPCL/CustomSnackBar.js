var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

var Styles = require("../../res/Styles");
var TextStyle = require("../../res/TextStyle").textStyle;
var Colors = require('../../res/Colors').color;

class CustomSnackBar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "CustomSnackBar";

    window.__SNACKBAR = this;
      
    this.setIds([
      "message"
    ]);
  }

  show = () => {
    var cmd = "";

    cmd = this.set({
      id : this.idSet.message,
      a_translationY : "0",
      a_duration : "360"
    })

    Android.runInUI(
      cmd,
      null
    );

    setTimeout(() => {
      this.hide();
    },2000)
  }

  hide = () =>{
    var cmd = "";

    cmd = this.set({
      id : this.idSet.message,
      a_translationY : "360",
      a_duration : "360"
    })

    Android.runInUI(
      cmd,
      null
    );
  }

  setValues = (options) =>{
    var cmd = "";

    cmd = this.set({
      id : this.idSet.message,
      text :options.text,
      background: options.status == "success" ? Colors.GREEN : Colors.RED
    })

    Android.runInUI(
      cmd,
      null
    );
  }
  
  render() {
    var text = this.props.text;

    this.layout = (
      <TextView
        id = {this.idSet.message}
        alignParentBottom = "true,-1"
        width = "match_parent"
        height = "40"
        translationY = "360"
        style = {TextStyle.statusAlert}
        background = {Colors.GRAY}
        padding = "20,0,20,0"
        gravity = "center_vertical"
        color = {Colors.WHITE}
        text = {text ? text : ""}/>
    )

    return this.layout.render();
  }
}

module.exports = CustomSnackBar;
