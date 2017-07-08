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

var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var Styles = require("../../res/Styles");
var TextStyle = require("../../res/TextStyle");
var _this;


class RadioListItem extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'image'
    ]);

    this.isSelected = this.props.isSelected ? this.props.isSelected : false;

    console.log("SELCTED STATUS FOR ", this.props.title, "\t", this.isSelected);
  }



  handleClick = () => {
    this.isSelected = !this.isSelected;
    var cmd = "";

    if (this.isSelected) {
      cmd = this.set({
        id: this.idSet.image,
        imageUrl: "ic_checked"
      })
    } else {
      cmd = this.set({
        id: this.idSet.image,
        imageUrl: "ic_unchecked"
      })
    }
    this.props.onItemClick(this.props.title, this.isSelected);

    Android.runInUI(cmd, 0);

  }



  render() {
    this.layout = (
      <LinearLayout 
        root="true" 
        margin="0,0,0,10"
        gravity="center_vertical"
        afterRender={this.afterRender}
        width="wrap_content" >
      

        <ImageView 
          onClick={this.handleClick}
          id={this.idSet.image}
          padding="0,12,12,12"
          imageUrl={this.isSelected?"ic_checked":"ic_unchecked"}
          margin="0,0,10,0"
          width="48"
          height="48"/>

        <TextView style={TextStyle.textStyle.bigBody} text={this.props.title}/>


       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = RadioListItem;
