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
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var Styles = require("../../../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var _this;

class SharePopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer",
      "spinnerContainer",
      "linkShareIntents",
      "fileShareIntents"
    ]);
    this.chosenItem;
    this.selectedList = [];
    _this=this;
    window.__SharePopup = this;
    console.log("SHARE POPUP CME")
  }


  show = () => {
    this.setVisibility("visible");
  }

  hide = () => {
    this.setVisibility("gone");
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentContainer,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }



  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getContent = () =>{
    var fileLinkAvailable;
    var textLinkAvailable;

    this.props.data.map((item, index) => {

      if(item.type == "file"){
        fileLinkAvailable = true;
      }else(item.type == "text")
        textLinkAvailable = true;

    });
    

    return (

      <ScrollView
      width="match_parent"
      height="wrap_content">

      <LinearLayout
      orientation="vertical"
      width="match_parent"
      height="wrap_content">

      <LinearLayout
      width="wrap_content"
      height="wrap_content"
      orientation="vertical"
      visibility={textLinkAvailable?"visibile":"gone"}>

        <TextView
        margin="0,25,0,12"
        width="match_parent"
        style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}
        height="wrap_content"
        text="As Link"/>


        <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

             <LinearLayout
              width="wrap_content"
              id={this.idSet.linkShareIntents}
              height="wrap_content"/>

             

        </HorizontalScrollView>

      </LinearLayout>


      <LinearLayout
      width="wrap_content"
      height="wrap_content"
      orientation="vertical"
      visibility={fileLinkAvailable?"visibile":"gone"}>

       <TextView
          margin="0,25,0,12"
          width="match_parent"
          style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}
          height="wrap_content"
          text="As File"/>


         <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

              <LinearLayout
              width="wrap_content"
              id={this.idSet.fileShareIntents}
              height="wrap_content"/>

        </HorizontalScrollView>

        </LinearLayout>

      
     </LinearLayout>
     </ScrollView>
     );

  }

 
  getHeader = () => {
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      gravity="center_vertical"
      margin="0,0,0,0">

          <TextView
           width = "wrap_content"
           height = "wrap_content"
           gravity="center_vertical"
           text = "Share this"
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

           <ViewWidget
           width="0"
           weight="1"
           height="0"/>

           <ImageView
           width="18"
           height="18"
           onClick={this.handleDismissClick}
           gravity="center_vertical"
           imageUrl="ic_action_close"/>

      </LinearLayout>
    )
  }



  getBody = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "350"
              root="true"
              visibility="visible"
              orientation= "vertical"
              clickable = "true"
              padding="16,18,16,16"
              background="#ffffff">
              
             {this.getHeader()}

             {this.getContent()}

            
            </LinearLayout>)
  }

  
  handleDismissClick = () => {
    this.hide();
  }


  shareContent = () =>{

    _this.props.data.map((item, index) => {
      if(item.type == "file"){
        JBridge.shareContentThroughIntent(item.data,"file",_this.idSet.fileShareIntents);
      }else if(item.type == "text"){
        JBridge.shareContentThroughIntent(item.data,"text",_this.idSet.linkShareIntents);
      }

    });

  }

  afterRender = () => {
      console.log("AFTER RENDER IN SHARE POPUP");
      this.shareContent();
  }



  render() {

    this.layout = (
      <LinearLayout 
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        afterRender={this.afterRender}
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">
          <LinearLayout
            height="0"
            width="match_parent"
            onClick={this.handleDismissClick}
            weight="1"/>

          {this.getBody()}


      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = SharePopup;
