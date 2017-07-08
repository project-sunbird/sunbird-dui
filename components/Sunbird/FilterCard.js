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
var FilterItem = require('../Sunbird/FilterItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
const transitParams = require('../../transitions');

var _this;

class FilterCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount',
      'rowsContainer'
    ]);
    _this = this;
    this.listOfFilters = this.props.filterData;
    this.EaseOut = transitParams.animParams.EaseOut;

  }

  handleUpdate = (newList) => {
    var newList = [];
    this.listOfFilters.map((item) => {
      var tmpVar = item;
      if (tmpVar.name === newList.name) {
        tmpVar = newList
      }
      newList.push(tmpVar)
    })
    this.updateFilterList = newList;
    this.props.onFilterUpdate(this.updateFilterList)
  }

  getFilterRows = () => {
    var layout = this.listOfFilters.map((item, index) => {


      return (<FilterItem
                  data = {item}
                  onUpdate={this.handleUpdate}/>)

    })

    return (
      <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  gravity="center_vertical">

                    {layout}

                </LinearLayout>)

  }


  render() {
    this.layout = (
      <LinearLayout
                height="wrap_content"
                width="match_parent"
                background={window.__Colors.WHITE}
                orientation="vertical">

                <ScrollView
                width="match_parent"
                height="match_parent">

              
                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  id={this.idSet.rowsContainer}
                  gravity="center_vertical">


                    {this.getFilterRows()}
                
                </LinearLayout>  


                </ScrollView>

      
              </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = FilterCard;
