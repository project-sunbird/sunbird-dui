const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
const Styles = require("../../res/Styles");
const Symbols = require("../../res/Symbols");
const Colors = require('../../res/Colors');
const TextStyle = require("../../res/TextStyle");

class ListItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ListItem";
    this.setIds(["avatarIcon","title","subTitle","amount","time","status"]);

    this.layoutHeight = this.props.type === "big" ? "95":"68";
  }

  listItemGeneration = (value) =>{
    var cmd = this.set({
          id: this.idSet.title,
          text: value.title
        });
        cmd += this.set({
          id: this.idSet.subTitle,
          text: value.subTitle
        });
        cmd += this.set({
          id: this.idSet.amount,
          text: Symbols.symbol.RUPEE+""+value.amount
        });
        cmd += this.set({
          id: this.idSet.time,
          text: value.timeStramp
        });
        cmd += this.set({
          id: this.idSet.status,
          visibility: "visible",
          text: value.status
        });
    return cmd;
  }

  listItemStatus = (value) =>{
    var cmd = this.set({
      id: this.idSet.title,
      text: value.title
    });
    
    cmd += this.set({
      id: this.idSet.subTitle,
      text: value.subTitle
    });
    
    cmd += this.set({
      id: this.idSet.amount,
      text: Symbols.symbol.RUPEE+""+value.amount
    });
    
    cmd += this.set({
      id: this.idSet.time,
      text: value.timeStramp
    });
    
    cmd += this.set({
      id: this.idSet.status,
      visibility:"visible",
      color:value.statusColor,
      text: value.status
    });

    cmd += this.set({
      id: this.idSet.avatarIcon,
      imageUrl: value.imageUrl
    });
    
    return cmd;
  }
  
  render() {
    this.layout = (
      <RelativeLayout>
        <LinearLayout
          feedback="true"
          width="match_parent"
          padding = "20,15,20,10"
          background = {Colors.color.WHITE}
          height = {this.layoutHeight}>

          <LinearLayout
            height = "match_parent"
            orientation = "vertical">      
            <ImageView
              id = {this.idSet.avatarIcon}
              width = "40"
              height = "40"
              cornerRadius = "40"
              imageUrl = {this.props.imageUrl}
              layout_gravity = "center"/>
            <TextView
              id = {this.idSet.status}
              layout_gravity = "center_horizontal"
              style = {TextStyle.textStyle.transactionStatus}
              margin = "0,5,0,0"/>
          </LinearLayout>

          <LinearLayout
            height = "match_parent"
            orientation = "vertical">       
            <TextView
              id = {this.idSet.title}
              style = {TextStyle.textStyle.bigBody}
              margin = "16,0,0,0"/>
            <TextView
              id = {this.idSet.subTitle}
              style = {TextStyle.textStyle.smallBody}
              margin = "16,0,0,0"/>
          </LinearLayout>

          <Space
            width = "0" weight ="1"/>

          <LinearLayout
            height = "match_parent"
            gravity = "center_vertical"
            orientation = "vertical">       
            <TextView
              id = {this.idSet.amount}
              layout_gravity = "right"
              style = {TextStyle.textStyle.listAmount}/>
            <Space
              height = "0"
              weight = "1"/>
            <TextView
              id = {this.idSet.time}
              style = {TextStyle.textStyle.smallBody}/>
          </LinearLayout>
          
        </LinearLayout>
      </RelativeLayout>)
    return this.layout.render();
  }
}

module.exports = ListItem;
