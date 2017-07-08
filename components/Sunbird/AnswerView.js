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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;


class AnswerView extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "selectorContainer",
      "itemPosition",
      "itemText",
      "parentContainer"
    ]);
    //this.displayName = "answer_view" + (this.props.index != undefined ? ("_" + this.props.index) : "")
    this.displayName = "answer_view";
    this.containsImage = (this.props.item.imageUrl === undefined ? true : false)
    this.selectedStatus = false;

  }


  setStatus = (status) => {
    this.selectedStatus = status;
    var content;
    var cmd;
    if (!status) {
      content = this.getIndexHolder();
      cmd = this.set({
        id: this.idSet.parentContainer,
        stroke: ("2," + window.__Colors.PRIMARY_BLACK_66)
      })
    } else {
      cmd = this.set({
        id: this.idSet.parentContainer,
        stroke: ("2," + window.__Colors.SUCCESS_GREEN)
      })
      content = this.getSelectedImage();
    }
    Android.runInUI(cmd, 0);

    this.replaceChild(this.idSet.selectorContainer, content.render(), 0);
  }


  getIndexHolder = () => {
    return (<TextView id = {this.idSet.itemPosition} text={this.props.index + 1} />)
  }

  getSelectedImage = () => {
    return (<ImageView
            width="40"
            height="40"
            imageUrl={"ic_check_green"}
            margin="0,0,0,0"/>)
  }

  handleSelectionEvent = () => {
    this.setStatus(!this.selectedStatus);
    this.props.onItemSelected(this.props.index, this.selectedStatus);

  }

  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      cornerRadius="5"
      id ={this.idSet.parentContainer}
      margin="0,0,0,12"
      stroke ={"2," + window.__Colors.PRIMARY_BLACK_66}
      height="56">
        <LinearLayout
      width="match_parent"
      gravity="center_vertical"
      allowMultipleClicks="true"
      padding="12,8,12,8"
      onClick={this.handleSelectionEvent}
      height="match_parent">

            <RelativeLayout
              width="40"
              stroke ={"3," + window.__Colors.PRIMARY_BLACK}
              cornerRadius="40"
              margin="0,0,12,0"
              height="40"
              root="true"
              id={this.idSet.selectorContainer}
              gravity="center"
              orientation="vertical">
              
              {this.getIndexHolder()}
             
            </RelativeLayout>
           <TextView
            width="wrap_content"
            height="match_parent"
            gravity="center"
            id = {this.idSet.itemText}
            text={this.props.item.key}
            margin="24,0,0,0"
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

         </LinearLayout> 
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = AnswerView;
