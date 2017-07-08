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
      console.log("afterRender","came")
     JBridge.setClickFeedback(this.idSet.buttonText);
  }

  render() {
    this.layout = (
      <LinearLayout
        id = {this.props.id} 
        height={this.props.height || "wrap_content"}
        width={this.props.width || "wrap_content"}
        orientation="horizontal"
        cornerRadius="2"
        clickable={this.props.clickable||"true"}
        margin={this.props.margin||"0,0,0,0"}
        stroke={this.props.stroke||"3,"+this.props.background||"1,#000000"}
        background={this.props.background||"#FFFFFF"}
        onClick={this.buttonFunction}
        visibility={this.props.visibility||"visible"}
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
          textSize={this.props.textSize || "18"}
          padding={this.props.padding ||"10,10,10,10"}
          color={this.props.textColor||"#FFFFFF"}/>
      </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = FeatureButton;
