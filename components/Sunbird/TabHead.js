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
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;


class TabHeadItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "tab_head_item";
    this.setIds([
      "tab",
      "bottomSelector",
      "title",
    ]);
  }

  unselect = () => {
    var _this = this;
    var cmd;
    cmd += this.set({
      id: _this.idSet.title,
      color: window.__Colors.DARK_GRAY
    });
    cmd += this.set({
      id: _this.idSet.bottomSelector,
      background: window.__Colors.DARK_GRAY
    });
    return cmd;
  }

  select = () => {
    var _this = this;
    var cmd;
    cmd += this.set({
      id: _this.idSet.title,
      color: window.__Colors.PRIMARY_ACCENT
    });
    cmd += this.set({
      id: _this.idSet.bottomSelector,
      background: window.__Colors.PRIMARY_ACCENT
    });
    return cmd;
  }



  handleClick = () => {
    if (this.props.item.select == "1") {
      this.props.item.select = "0";
    } else {
      this.props.item.select = "1";
    }
    this.props._onClick(this.props.index);

  }

  afterRender = () => {
    JBridge.setClickFeedback(this.idSet.tab)
  }

  render() {
    this.layout = (
      <LinearLayout 
        weight='1' 
        id={this.idSet.tab}
        afterRender = {this.afterRender}
        onClick={this.handleClick}
        gravity="center"
        height = "50"
        orientation="vertical"
        width="match_parent">

        <TextView 
          id={this.idSet.title}
          text={this.props.item.name}
          color={this.props.item.select=="1"?window.__Colors.PRIMARY_ACCENT:window.__Colors.DARK_GRAY} 
          width="match_parent"
          typeface = "bold"
          height = "0"
          weight="1"
          fontstyle ="SourceSansPro/Bold"
          gravity="center"
          textSize={window.__Font.fontSize.FONT_12}/>

        <ViewWidget
          height="2"
          id={this.idSet.bottomSelector}
          width="match_parent"
          background={this.props.item.select=="1"?window.__Colors.PRIMARY_ACCENT:window.__Colors.DARK_GRAY}/> 
            
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

class TabHead extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "bottom_nav_bar";

    this.setIds([
      "horizontal",
      "TabContainer",
      "TabContainerSingle",
      "title",

    ]);

    this.bottomNavItemList = this.props.tabItems

  }



  handleNavigationChange = (index) => {
    var cmd;
    for (var i = 0; i < this.bottomNavItemList.length; i++) {
      if (i == index) {
        cmd += this.cardList.children[i].select();
      } else {
        cmd += this.cardList.children[i].unselect();
      }
    }
    Android.runInUI(cmd, 0);

    this.props._onClick(index);
  }



  renderBottonNavBarItems = () => {
    var cards = this.bottomNavItemList.map((item, i) => {
      return (
        <TabHeadItem _onClick={this.handleNavigationChange} index = {i} item = {item}/>
      )
    });

    if (cards.length == 1) {
      this.cardList = (
        <LinearLayout 
          layout_gravity="center_horizontal" 
          orientation="vertical" 
          width="match_parent"  
          root="true">
          {cards}
        </LinearLayout>
      )
    } else {
      this.cardList = (
        <LinearLayout width="match_parent" root="true">
          {cards}
        </LinearLayout>
      )
    }
    this.appendChild(this.idSet.TabContainer, this.cardList.render(), 0);
  }



  render() {
    this.layout = (
      <LinearLayout 
        orientation="vertical" 
        width="match_parent"
        height = "50"
        afterRender={this.renderBottonNavBarItems}
        background={window.__Colors.WHITE}>
        <LinearLayout
          id={this.idSet.TabContainer}
          width="match_parent"
          orientation="horizontal"/>
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = TabHead;
