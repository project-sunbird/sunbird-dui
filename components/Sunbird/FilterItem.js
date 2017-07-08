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
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
const transitParams = require('../../transitions');
const filterParams = require('../../FilterParams');

var _this;

class FilterItem extends View {

  constructor(props, children) {
    super(props, children);
    this.setIds([
      "filterCount",

    ]);
    this.content = this.props.data;

    this.filterList = this.content.values;
    this.filterLable = this.content.name;


    console.log("FITLER ITEM PARAMA", this.content);
  }


  handleClick = () => {

    console.log("SHOWING POPUP")
    console.log("FOR ", this.filterList);
    window.__FilterPopup.setContent(this.filterList, this.handleSelection)
    window.__FilterPopup.show()
  }


  getSelectedCount = (list) => {

    var count = 0;
    list.map((item) => {
      if (item.apply == true)
        count++;
    })
    return count;
  }


  handleSelection = (newList) => {
    console.log("handleSelection", newList)
    console.log("seected Length", this.getSelectedCount(newList))

    window.__FilterPopup.hide()
    this.filterList = newList;
    this.content.values = this.filterList;
    var cmd = this.set({
      id: this.idSet.filterCount,
      text: this.getSelectedCount(newList) + " added"
    });

    Android.runInUI(cmd, null);
    this.props.onUpdate(this.content)

  }

  render() {
    this.layout = (
      <LinearLayout
              width="match_parent"
              height="wrap_content"
              margin="16,16,16,0"
              gravity="center_vertical"
              onClick={this.handleClick}>
            
             <LinearLayout
              width="match_parent"
              height="match_parent"
              padding="10,10,0,10"
              gravity="center_vertical"
              background={window.__Colors.WHITE_F4}>

                <TextView
                width="wrap_content"
                height="wrap_content"
                text={this.filterLable}
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                <ViewWidget 
                height = "1"
                width = "0"
                weight = "1"/>

                <TextView
                width="wrap_content"
                height="wrap_content"
                id={this.idSet.filterCount}
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                <ImageView
                width="24"
                height="24"
                imageUrl="ic_chevron_right"/>

              </LinearLayout>
            </LinearLayout>

    )
    return this.layout.render();
  }


}

module.exports = FilterItem;
