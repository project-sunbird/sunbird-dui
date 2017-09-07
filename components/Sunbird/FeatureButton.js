
const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");

class FeatureButton extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "buttonText"
    ]);
  }

  changeButtonText = (text) => {
    Android.runInUI(this.set({
            id: this.idSet.buttonText,
            text: text
          }), null);
  }

  buttonFunction = () => {
    this.props.buttonClick();
  }

  afterRender = () =>{
     JBridge.setClickFeedback(this.idSet.buttonText);
  }

  render() {
    this.layout = (
      <LinearLayout
      height={this.props.height || "wrap_content"}
      width={this.props.width || "wrap_content"}
      clickable={this.props.clickable||"true"}
      margin={this.props.margin||"0,0,0,0"}
      stroke={this.props.stroke||"3,"+this.props.background||"1,#000000"}
      background={this.props.background||"#FFFFFF"}
      cornerRadius={this.props.cornerRadius || "2"}
      visibility={this.props.visibility||"visible"}>
      <LinearLayout
        id = {this.props.id}
        height={this.props.height || "wrap_content"}
        width={this.props.width || "wrap_content"}
        orientation="horizontal"
        onClick={this.buttonFunction}
        gravity="center">
        <TextView
          id = {this.idSet.buttonText}
          typeface={this.props.typeface||"normal"}
          text={this.props.text||"CONFIRM"}
          margin="8,0,8,0"
          width="match_parent"
          height="match_parent"
          gravity="center"
          afterRender = {this.afterRender}
          textSize={this.props.textSize || "14"}
          padding={this.props.padding ||"10,10,10,10"}
          color={this.props.textColor||"#FFFFFF"}/>
      </LinearLayout>
    </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = FeatureButton;
