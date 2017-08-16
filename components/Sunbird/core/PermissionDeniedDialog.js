const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var CheckBox = require("@juspay/mystique-backend").androidViews.CheckBox;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var FeatureButton = require('../../../components/Sunbird/FeatureButton');
var Styles = require("../../../res/Styles");

let IconStyle = Styles.Params.IconStyle;

///////String hardcoded ASK PERMISSION

class PermissionDeniedDialog extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "bodyWithMessageContainer",
      "bodyContainer",
      "permissionIconHolder",
      "permissionTextHolder"
    ]);
    this.chosenItem;
    this.selectedList = [];
    window.__PermissionDeniedDialog = this;
    this.comment = "";
    this.visibility="";
  }


  setContent(icon,data){

    Android.runInUI(this.set({
      id: this.idSet.permissionIconHolder,
      imageUrl : icon
    }),0);

    Android.runInUI(this.set({
      id: this.idSet.permissionTextHolder,
      text : data
    }),0);

  }


  show = (icon,data) => {
    this.setVisibility("visible");
    this.visibility="visible";
    this.setContent(icon,data);
  }

  hide = () => {
    this.setVisibility("gone");
    this.visibility="gone";
  }

  getVisibility = () =>{
    return this.visibility;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentContainer,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }


  onConfirm = () =>{

    console.log("ASK PERMISSION CLICKED");

    JBridge.showPermissionScreen();

  
  }


  getFeatureButton = () => {
    return (<LinearLayout
              width = "match_parent"
              orientation="vertical"
              height="0"
              id={this.idSet.featureContainer}
              padding = "3,3,3,3"
              cornerRadius="5"
              weight="1"
              gravity = "center">
                  <FeatureButton
                    typeface = "bold"
                    clickable="true"
                    width = "match_parent"
                    height = "56"
                    stroke = {"3," + window.__Colors.WHITE}
                    background = {window.__Colors.PRIMARY_ACCENT}
                    text = "ASK PERMISSION"
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "18"/>
            </LinearLayout>)


  }


   getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }



  getBodyWithMessage = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "400"
              id={this.idSet.bodyWithMessageContainer}
              root="true"
              gravity="center_horizontal"
              orientation= "vertical"
              clickable = "true"
              padding="16,18,16,16"
              background="#ffffff">

              <ImageView
                width="87"
                height="78"
                margin="0,40,0,0"
                gravity="center_horizontal"
                id={this.idSet.permissionIconHolder}
                imageUrl={"ic_flag_warning"}/>

               <TextView
                width="wrap_content"
                height="wrap_content"
                text="PERMISSION NOT AVAILABLE"
                margin="0,9,0,0"
                gravity="center_horizontal"
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>


              <TextView
                width="260"
                height="wrap_content"
                margin="0,90,0,0"
                gravity="center_horizontal"
                id={this.idSet.permissionTextHolder}
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>


              <TextView
                width="wrap_content"
                height="wrap_content"
                margin="0,30,0,0"
                gravity="center_horizontal"
                onClick={this.handleDismissClick}
                textFromHtml={"<font color='#007AFF'><a href=''>"+ window.__S.GO_BACK﻿ + "</a></font>"}
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.BLUE_R}/>



            </LinearLayout>)
  }


  handleDismissClick = () => {
    this.hide();
  }

  getBody = () => {
    return (<LinearLayout
            height="wrap_content"
            width="match_parent"
            root="true"
            background={window.__Colors.WHITE}
            orientation="vertical">  

            
            {this.getBodyWithMessage()}

            {this.getFeatureButton()}

          </LinearLayout>)
  }



  render() {

    this.layout = (
      <LinearLayout 
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">
          
          <LinearLayout
            height="0"
            width="match_parent"
            onClick={this.handleDismissClick}
            weight="1"/>

          <LinearLayout
            height="wrap_content"
            width="match_parent"
            id={this.idSet.bodyContainer}>  

            {this.getBody()}
            
           

          </LinearLayout>

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = PermissionDeniedDialog;