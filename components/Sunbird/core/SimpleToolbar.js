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


*/const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;

var Styles = require("../../../res/Styles");
// TODO : NEED TO FIX THIS
//let IconStyle =  window.__Styles.Params.IconStyle;
let IconStyle = Styles.Params.IconStyle;

class SimpleToolbar extends View {
    constructor(props, children) {
    super(props, children);
    this.displayName = "SimpleToolbar";
  }

  handleMenuClick = (url) => {
    this.props.onMenuItemClick(url);
  }


getMenu = () =>{


      if (this.props.showMenu == undefined || !this.props.showMenu)
        return <Space width="0"/>


      var lenthOfMenu = Object.keys(this.props.menuData.url).length;
      var answerCards = "";
     
      if(lenthOfMenu<=3) {
        answerCards = this.props.menuData.url.map((item, index) => {
           return  <ImageView  
            style = {IconStyle}
            popupMenu = {this.props.items}
            onClick = {() => {this.handleMenuClick(item.imageUrl)}}
            imageUrl = {item.imageUrl}/> 
        })
      }
      else {
      answerCards = this.props.menuData.url.map((item, index) => {
        return this.setMenu(item.imageUrl,index);
      });
    }
   

    return answerCards;
  }



  setMenu = (imageUrl,index) => {
    if(index <=2) {
    return  <ImageView  
        style = {IconStyle}
        popupMenu = {this.props.items}
        onClick = {() => {this.handleMenuClick(index)}}
        popupMenu = {this.homePopUpMenu}
        onMenuItemClick = {this.more}
        imageUrl = { (index == 2) ? "ic_action_overflow" : imageUrl}/> 
    }
    else {
      return <Space width="0"/>      
    }
  }

  getBack = () => {
    if (this.props.hideBack != undefined && this.props.hideBack)
      return <Space width="0"/>

    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      onClick={this.props.onBackPress}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getTitle = () => {
    let margin;

    if (!this.props.showBack && !this.props.logo)
      margin = "12,0,0,0";

    return (<TextView margin={margin} 
          style={window.__TextStyle.textStyle.TOOLBAR.HEADING} 
          text={this.props.title}/>)

  }

  getLogo = () => {
    if (!this.props.logo)
      return <Space width="0"/>

    return ( < ImageView margin = "0,0,10,0"
      style = {
        {
          width: '48',
          height: '48'
        }
      }
      imageUrl = { this.props.logo }/> );
  }

  getIcons = () => {
    if (!this.props.icons)
      return <Space width="0"/>

    return this.props.icons.map((icon, index) => {
      return (<ImageView  
        onClick={() => {this.props.onIconClick(icon)}}
        style = {IconStyle}
        imageUrl = {icon}/>)
    });
  }

  render() {
    let menu = this.getMenu();
    let back = this.getBack();
    let logo = this.getLogo();
    let title = this.getTitle();
    let icons = this.getIcons();

    this.layout = (
      <LinearLayout 
        height="56"
        width="match_parent"
        padding="0,0,0,2"
        gravity="center_vertical"
        root="true" 
        background={window.__Colors.PRIMARY_BLACK_22}
        >

        <LinearLayout
          width="match_parent"
          height="match_parent"
          gravity="center_vertical"
          background={this.props.invert?window.__Colors.WHITE:window.__Colors.LIGHT_VIOLET}
          >
         
          {back}
          {logo}
          {title}
           
          <Space width="0" weight="1"/>
          {icons}
          {menu}
         </LinearLayout>
       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SimpleToolbar;
