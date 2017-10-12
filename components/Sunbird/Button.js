

const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");

var Styles = require("../../res/Styles");
var R = require('ramda');

class Button extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "Button";
    this.setIds([
      "Button"
    ]);
    this.ButtonLayout = this.buttonDecision();
  }

  buttonDecision = () => {
    switch (this.props.type) {
      case "BigButton_Primary_DB":
        this.layoutStyle = Styles.Params.BigButton.Primary_DB_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.BLUE;
        this.text = this.props.text;
        break;

      case "BigButton_Primary_DB_Stroke":
        this.layoutStyle = Styles.Params.BigButton.Primary_DB_Layout_Stroke;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.BLUE;
        this.text = this.props.text;
        break;

      case "BigButton_Primary_WB":
        this.layoutStyle = Styles.Params.BigButton.Primary_WB_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.LIGHT;
        this.text = this.props.text;
        break;

      case "BigButton_Secondary_DB":
        this.layoutStyle = Styles.Params.BigButton.Secondary_DB_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.LIGHT;
        this.text = this.props.text;
        break;

      case "BigButton_Secondary_WB":
        this.layoutStyle = Styles.Params.BigButton.Secondary_WB_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.BLUE;
        this.text = this.props.text;
        break;

      case "SmallButton_Primary_WB":
        this.layoutStyle = Styles.Params.SmallButton.WB_Primary_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.LIGHT;
        this.text = this.props.text;
        break;

      case "SmallButton_Primary_DB":
        this.layoutStyle = Styles.Params.SmallButton.DB_Primary_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.BLUE;
        this.text = this.props.text;
        break;

      case "SmallButton_Secondary_WB":
        this.layoutStyle = Styles.Params.SmallButton.WB_Secondary_Layout;
        this.textStyle = window.__TextStyle.textStyle.blueButton;
        this.text = this.props.text;
        break;

      case "SmallButton_Secondary_BT":
        this.layoutStyle = Styles.Params.SmallButton.WB_Secondary_Layout;
        this.textStyle = window.__TextStyle.textStyle.TABBAR.SELECTED;
        this.text = this.props.text;
        break;

      case "SmallButton_Secondary_DB":
        this.layoutStyle = Styles.Params.SmallButton.DB_Secondary_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.LIGHT;
        this.text = this.props.text;
        break;

      case "StepperButton_DB":
        this.layoutStyle = Styles.Params.StepperButton.WB_LAYOUT;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.LIGHT;
        this.text = this.props.text;
        break;

      case "StepperButton_WB":
        this.layoutStyle = Styles.Params.StepperButton.DB_LAYOUT;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.BLUE;
        this.text = this.props.text;
        break;

      default:
        this.layoutStyle = Styles.Params.BigButton.Primary_WB_Layout;
        this.textStyle = window.__TextStyle.textStyle.CARD.ACTION.LIGHT;
        this.text = this.props.text;
        break;
    }
  }

  onButtonClick = () => {
    this.props.onClick(this.props.text);
  }

  render() {

    this.layout = (
      <LinearLayout
          feedback="false"
          padding={this.props.padding}
          margin={this.props.margin}
          weight={this.props.weight}
          id={this.idSet.Button}
          onClick={this.onButtonClick}
          style={this.layoutStyle}>
        <TextView
      style={this.textStyle}
      text = {this.props.text}/>
        </LinearLayout>);

    return this.layout.render();
  }
}

module.exports = Button;
