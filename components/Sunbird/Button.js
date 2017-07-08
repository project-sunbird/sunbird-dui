/*
Copyright (c) 2012-2017 "JUSPAY Technologies"
JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]

This file is part of JUSPAY Platform.

JUSPAY Platform is free software: you can redistribute it and/or modify
it for only educational purposes under the terms of the GNU Affero General
Public License (GNU AGPL) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
For Enterprise/Commerical licenses, contact <info@juspay.in>.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
be liable for all damages without limitation, which is caused by the
ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
damages, claims, cost, including reasonable attorney fee claimed on Juspay.
The end user has NO right to claim any indemnification based on its use
of Licensed Software. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.


*/

const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

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
