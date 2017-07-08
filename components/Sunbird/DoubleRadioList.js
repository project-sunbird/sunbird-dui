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
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var Styles = require("../../res/Styles"); 
var TextStyle = require("../../res/TextStyle"); 
var RadioListItem = require('../Sunbird/RadioListItem');

var _this;


class DoubleRadioList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "DoubleRadioList";
    this.list = this.props.items;
    _this = this;
  }



getSingleRow = (item,index) =>{
  return (<RadioListItem
          title={item}
          index={index}/>);
}



renderItems() {
      var lengthOfMenu = Object.keys(this.list).length;
      this.totalItems = this.props.items.splice(0,lengthOfMenu/2)
      this.rightItems = this.props.items.splice(0,lengthOfMenu/2);
      this.leftItems = this.totalItems.splice(0,lengthOfMenu/2);

      var leftBar = "";
      var rightBar = "";
      leftBar = this.leftItems.map((item, index) => {
        return this.getSingleRow(item,index);
      });

      rightBar = this.rightItems.map((item, index) => {
        return this.getSingleRow(item,index);
      });
      this.totalBar = (
          <LinearLayout
          orientation = "horizontal"
          width = "wrap_content"
          height = "wrap_content">
          <LinearLayout
          orientation = "vertical"
          width = "wrap_content"
          height = "wrap_content">
          {leftBar}
          </LinearLayout>
          <LinearLayout
          orientation = "vertical"
          width = "wrap_content"
          height = "wrap_content"
          margin = "86,0,0,0">
          {rightBar}
          </LinearLayout>
          </LinearLayout>
        )

    return this.totalBar;
  }


  render() {
    this.layout = (
      <LinearLayout 
        orientation="vertical"
        root="true" 
        width="wrap_content" >
           
        {this.renderItems()}
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = DoubleRadioList;