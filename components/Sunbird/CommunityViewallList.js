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
var SearchToolbar = require('../Sunbird/core/SearchToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var _this;
class CommunityViewallList extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount'
    ]);
    _this=this;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_filter" },
        { imageUrl: "ic_action_search"}
      ]
    }

    this.data = [
            {imageUrl: "http://chinookspirit.org/wp/wp-content/uploads/2015/09/Community-Tree-e1441813462468.jpg", name: "All-India Teachers Association",members:"(250 members)",logo:[]},
            {imageUrl: "http://www.abundantcommunity.com/files/images/stories/ICMA_Tree_Logo.png", name: "Maharashtra Teachers Association",members:"(250 members)", logo:[] },
            {imageUrl: "http://www.cbt.stellarbluehosting.com/images/CBT%20TREE_COLOR2.jpg", name: "Maharashtra Chemistry Teachers Only",members:"(250 members)", logo:[] },
            {imageUrl: "https://thumbs.dreamstime.com/m/tree-as-symbol-23289732.jpg", name: "Maharashtra Chemistry Teachers Only",members:"(250 members)", logo:[] },
        ]

  }


  getRows = () => {
    var layout = this.data.map((item, index) => {
     return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical">
                <LinearLayout
                width="match_parent"
                height="wrap_content"
                gravity="center_vertical"
                margin="16,17,16,17">

                <ImageView
                  height="50"
                  width="50"
                  gravity="center_vertical"
                  imageFromUrl= {item.imageUrl} />

                <LinearLayout
                  height="wrap_content"
                  width="0"
                  weight="1"
                  padding="16,0,0,0"
                  gravity="center_vertical"
                  orientation="vertical">

                      <TextView
                        onClick={item.onMenuItemClick}
                        text={item.name}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.CARD.HEADING}/>

                      <TextView
                        text={item.members}
                        height="wrap_content"
                        singleLine="true"
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                </LinearLayout>

                <ImageView
                  gravity="center_vertical"
                  height="24"
                  width="24"
                  imageUrl= "ic_chevron_right"
                  />

              </LinearLayout>

              <LinearLayout
                width="match_parent"
                background={window.__Colors.PRIMARY_BLACK_22}
                height="1"/>

        </LinearLayout>)
    })

    return layout;
  }


  getLabel(){
    return(<LinearLayout
            width="match_parent"
            height="wrap_content"
            gravity="center_vertical"
            background={window.__Colors.WHITE_F2}>

            <TextView
            width="wrap_content"
            height="wrap_content"
            padding="16,6,0,6"
            gravity="center_vertical"
            background={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}
            text="Viewing all communities you’re a part of"/>

            <ViewWidget
            height="0"
            weight="1"/>

            <ImageView
            width="12"
            height="12"
            margin="0,0,20,0"
            gravity="center_vertical"
            imageUrl="ic_action_arrow_down"/>

            </LinearLayout>)
  }


    handleMenuClick = (url) =>{
      console.log("url clicked",url);
    }

    handleSearch=(data)=>{
      console.log("searched",data);
    }



  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

          <SearchToolbar
            hint="Enter your search"
            invert="true"
            title="Communities"
            onMenuItemClick={this.handleMenuClick}
            menuData={this.menuData}
            onSearch={this.handleSearch}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                  {this.getLabel()}
                  {this.getRows()}

                </LinearLayout>

           </ScrollView>
      </LinearLayout>


    )
    return this.layout.render();
  }
}

module.exports = CommunityViewallList;
