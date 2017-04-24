const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
const Styles = require("../../res/Styles");
const TextStyle = require("../../res/TextStyle");
const Alert = require("./Alert");

class Paragraphs extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "Alert";
    this.setIds(["Alert","contentText","headingText"]);
    this.invert=(this.props.invert!==undefined)?this.props.invert:false;
    this.titleStyle = (this.invert)?TextStyle.textStyle.paragraphHead:TextStyle.textStyle.paragraphHeadWhite;
    this.bodyStyle = (this.invert)?TextStyle.textStyle.paragraphContent:TextStyle.textStyle.paragraphContentWhite;
    this.titleStyle = (this.props.titleStyle)?this.props.titleStyle:this.titleStyle;
    this.bodyStyle = (this.props.bodyStyle)?this.props.bodyStyle:this.bodyStyle;
  }

  updateText(headingText,contentText) {
    var cmd = this.set({
      id: this.idSet.contentText,
      text: contentText
    });
    cmd+= this.set({
      id: this.idSet.headingText,
      text: headingText
    });
    Android.runInUI(cmd,null);
  }
  
  
  render() {
    this.layout = (
      <LinearLayout
        height = "wrap_content"
        width = "match_parent"
        orientation = "vertical">
        <TextView
          id={this.idSet.headingText}
          style = {this.titleStyle}
          textFromHtml = {this.props.headingText}
          margin="0,0,0,20"/>
        <TextView
          id={this.idSet.contentText}
          style = {this.bodyStyle}
          textFromHtml = {this.props.contentText}/>  
      </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = Paragraphs;