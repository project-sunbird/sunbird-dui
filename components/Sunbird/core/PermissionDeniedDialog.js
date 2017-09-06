const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
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
      "permissionTextHolder",
      "permissionSettingsMsg"
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
      text : data + " "+window.__S.PERMISSION_DENIED
    }),0);

    Android.runInUI(this.set({
      id: this.idSet.permissionSettingsMsg,
      text : window.__S.PERMISSION_SETTING_MSG+" "+data
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
              padding = "16,0,16,16"
              cornerRadius="5"
              weight="1"
              gravity = "center">
                  <FeatureButton
                    typeface = "bold"
                    clickable="true"
                    width = "match_parent"
                    height = "50"
                    cornerRadius="4"
                    stroke = {"2," + window.__Colors.WHITE}
                    background = {window.__Colors.PRIMARY_ACCENT}
                    text = {window.__S.OPEN_SETTINGS }
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "14"/>
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
                margin="0,80,0,0"
                gravity="center_horizontal"
                id={this.idSet.permissionIconHolder}
                imageUrl={"ic_warning_grey"}/>

               <TextView
                width="wrap_content"
                height="wrap_content"
                id={this.idSet.permissionTextHolder}
                text={window.__S.PERMISSION_NOT_AVAILABLE}
                margin="0,9,0,0"
                gravity="center_horizontal"
                style={window.__TextStyle.textStyle.HINT.DULL}/>


              <TextView
                width="260"
                height="wrap_content"
                margin="0,120,0,0"
                gravity="center_horizontal"
                id={this.idSet.permissionSettingsMsg}
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

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