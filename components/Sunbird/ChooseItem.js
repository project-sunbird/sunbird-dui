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
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var FeatureButton = require('../../components/Sunbird/FeatureButton');
var RadioListItem = require('../Sunbird/RadioListItem');

var Styles = require("../../res/Styles");

let IconStyle = Styles.Params.IconStyle;

class ChooseItem extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer"
    ]);
    this.chosenItem;
    this.selectedList = [];
  }



  getFeatureButton = (isClickable) => {
    var color = isClickable == "true" ? window.__Colors.PRIMARY_ACCENT : window.__Colors.PRIMARY_BLACK_22;
    return (<LinearLayout
                  width = "match_parent"
                  orientation="vertical"
                  height="0"
                  alignParentBottom="true,-1"
                  id={this.idSet.featureContainer}
                  padding = "3,3,3,3"
                  weight="20"
                  gravity = "center">
                  <FeatureButton
                    typeface = "bold"
                    clickable={isClickable}
                    width = "match_parent"
                    height = "64"
                    stroke = {"3," + window.__Colors.WHITE}
                    background = {color}
                    text = {this.props.data.confirmText || "Confirm"}
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "18"/>
                </LinearLayout>)


  }


  getList = () => {
    var lengthOfMenu = Object.keys(this.props.data.items).length;
    this.totalItems = this.props.data.items.splice(0, lengthOfMenu / 2)
    this.rightItems = this.props.data.items.splice(0, lengthOfMenu / 2);
    this.leftItems = this.totalItems.splice(0, lengthOfMenu / 2);


    var leftBar = "";
    var rightBar = "";
    leftBar = this.leftItems.map((item, index) => {
      return (<RadioListItem
                  onItemClick={this.handleItemClick}
                  title={item}
                  index={index}/>)
    });

    rightBar = this.rightItems.map((item, index) => {
      return (<RadioListItem
                  onItemClick={this.handleItemClick}
                  title={item}
                  index={index}/>)
    });
    console.log("leftBar BBBBAR", this.leftItems);
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



  getRadioList() {
    return (<LinearLayout
            width = "match_parent"
            height = "0"
            weight="70"
            margin = "0,0,0,0"
            padding = "0,0,10,10"
            orientation = "vertical">

             <ScrollView
              height="wrap_content"
              width="match_parent">

              {this.getList()}
            
              </ScrollView>

            </LinearLayout>)
  }

  getHeader() {
    return (
      <LinearLayout
      width="wrap_content"
      height="0"
      weight="10">

          <TextView
           width = "wrap_content"
           height = "wrap_content"
           text = "Choose from following"
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

      </LinearLayout>
    )
  }


  handleItemClick = (title, checked) => {

    if (checked)
      this.selectedList.push(title)
    else {
      var position = this.selectedList.indexOf(title);
      this.selectedList.splice(position, 1);
    }

    if (this.selectedList.length > 0) {
      this.replaceChild(this.idSet.featureContainer, this.getFeatureButton("true").render(), 0);
    } else {
      this.replaceChild(this.idSet.featureContainer, this.getFeatureButton("false").render(), 0);
    }

  }


  onConfirm = () => {
    console.log("submitted", this.selectedList);

    window.__RootScreen.hideFilterDialog();
    this.props.onSelect(this.selectedList);
  }

  handleSelection = (index) => {
    this.chosenItem = index;
  }

  afterRender = () => {}

  render() {

    this.layout = (
      <LinearLayout
          cornerRadius = "2"
          afterRender={this.afterRender}
          width = "match_parent"
          height = "450"
          orientation= "vertical"
          clickable = "true"
          padding="16,18,16,16"
          alignParentBottom = "true,-1"
          background="#ffffff">
          
         {this.getHeader()}

         {this.getRadioList()}

         {this.getFeatureButton("false")}

        </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ChooseItem;
