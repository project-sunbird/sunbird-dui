var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../../utils/GenericFunctions');


var Button = require('../Sunbird/Button');

var _this;

/*
# This component handles downloading and playing of content.
# If the content is not available locally, it shows the DOWNLOAD option, handles download.
# After the content is dowloaded or available locally, PLAY option is displayed and plays the content.
*/
class DownloadAllProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "DownloadAllProgressButton";
    this.setIds([
      "downloadingText",
      "downloadBarContainer",
      "downloadBar",
      "cancelDownloadHolder"
    ])

    window.__DownloadAllProgressButton = this;
    this.isDownloaded = false;
    this.startedDownloading = false;

    _this = this;
    this.isCancelVisible=false;
    console.log("DownloadAllProgressButton props",this.props)

  }


  setCancelButtonVisibility = (value) =>{
    var cmd = this.set({
      id: this.idSet.cancelDownloadHolder,
      visibility: value
    })
    Android.runInUI(cmd, 0);
  }

  handleCancelDownload = () => {

     window.__DownloadAllProgressButton.childrenArray.map((item)=>{
       JBridge.cancelDownload(item);
     })


     this.isCancelVisible=false;
     this.setCancelButtonVisibility("gone");

     this.startedDownloading=false;
     this.isDownloaded=false;
     this.replaceChild(this.idSet.downloadBarContainer, this.getButtons(0,this.props.buttonText).render(), 0);

  }

  updateProgress = (response) => {

    var jsonResponse = JSON.parse(response);
    console.log("response for download all",jsonResponse.status);

    if(jsonResponse.status == "IMPORT_COMPLETED"){
      this.downloadContentCount++;
    }

    var textToShow = ""
    var progress=0
    if(this.downloadContentCount==this.childrenCount)
       {
        textToShow= "All Contents Downloaded"
        this.setCancelButtonVisibility("gone");
        this.isCancelVisible = false;
    }


    else{
      _this.isDownloaded = false;
      textToShow = "DOWNLOADING "+this.downloadContentCount+"/"+this.childrenCount
      progress = (this.downloadContentCount/this.childrenCount)*100;
    }
    if (!this.isCancelVisible ) {
      this.setCancelButtonVisibility("visible");
      this.isCancelVisible = true;
    }
    _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(progress, textToShow).render(), 0);
  }

  setVisibility = (value) => {
    var cmd = this.set({
      id: this.idSet.downloadBar,
      visibility: value

    })
    Android.runInUI(cmd, 0);
  }

  setButtonFor = (identifier) => {
    this.props.identifier=identifier;
  }
  setLocalStatus = (status) =>{
    this.props.localStatus = status;
  }

  setPlayContent = (content) =>{
    this.props.playContent = content;
  }

  setContentDetails = (data) =>{
    this.props.contentDetails = data;
  }


  handleButtonClick = () => {
  // to save download all progress
  this.downloadContentCount=0;
  window.__onContentImportResponse = this.updateProgress;
  this.props.handleButtonClick();
  }


  getDownloadBackground = (value) => {

    value = (value < 0) ? 0 : value;

    var pLeft = parseFloat(value) / parseFloat(100);
    var pRight = (1 - pLeft);

    var mCornerLeft = "8,0,0,8,";
    var mCornerRight = "0,8,8,0,";
    if(pLeft==1){
      mCornerLeft = "8,8,8,8,";
    }else if(pLeft <= 0){
      mCornerRight = "8,8,8,8,";
    }
    return (<LinearLayout
        width="match_parent"
        onClick={this.handleButtonClick}
        root="true"
        height="48">

            <LinearLayout
              width="0"
              height="match_parent"
              weight={pLeft}
              multiCorners={mCornerLeft+window.__Colors.THICK_BLUE}/>

            <LinearLayout
              width="0"
              height="match_parent"
              weight={pRight}
              multiCorners={mCornerRight+window.__Colors.PRIMARY_DARK}/>

        </LinearLayout>)

  }



  getButtons = (value, text) => {
    var _this = this;
    var layout = (
      <RelativeLayout
        width="match_parent"
        height="48"
        root="true">


        { this.getDownloadBackground(value)}


        <TextView
          width="wrap_content"
          height="wrap_content"
          centerInParent="true,-1"
          id={this.idSet.downloadingText}
          style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
          text={text}/>

        </RelativeLayout>)

    return layout;
  }


  getCancelButton = (value, text) => {
    var layout = (


      <LinearLayout
        width="match_parent"
        id={this.idSet.cancelDownloadHolder}
        height="48"
        cornerRadius="5"
        margin="16,16,16,4"
        visibility="gone"
        layoutTransition="true"
        background={window.__Colors.WHITE}
        stroke={"2,"+window.__Colors.THICK_BLUE}>

          <TextView
            width="match_parent"
            height="match_parent"
            gravity="center"
            onClick={this.handleCancelDownload}
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
            text={window.__S.CANCEL_DOWNLOAD﻿}/>

         </LinearLayout>

    )

    return layout;
  }



  render() {


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}
        visibility = {this.props.visibility?this.props.visibility : "visible"}
        id={this.idSet.downloadBar}
        layoutTransition="true">

        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>

        {this.getCancelButton()}

        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="16,4,16,16"
          root="true"
          id={this.idSet.downloadBarContainer}>

          {this.getButtons(0,this.props.buttonText)}

         </LinearLayout>

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = DownloadAllProgressButton;
