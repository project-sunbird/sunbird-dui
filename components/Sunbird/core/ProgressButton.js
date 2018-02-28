var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../../../utils/GenericFunctions');


var Button = require('../../Sunbird/Button');

var _this;

/*
# This component handles downloading and playing of content.
# If the content is not available locally, it shows the DOWNLOAD option, handles download.
# After the content is dowloaded or available locally, PLAY option is displayed and plays the content.
*/
class ProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ProgressButton";
    this.setIds([
      "downloadingText",
      "downloadBarContainer",
      "downloadBar",
      "cancelDownloadHolder"
    ])

    window.__ProgressButton = this;
    this.isDownloaded = false;
    this.startedDownloading = false;

    _this = this;
    this.isCancelVisible=false;
    console.log("progress button props",this.props)

  }

  afterRender = () => {
    this.checkContentLocalStatus(this.props.localStatus);
  }

  setCancelButtonVisibility = (value) =>{
    var cmd = this.set({
      id: this.idSet.cancelDownloadHolder,
      visibility: value
    })
    Android.runInUI(cmd, 0);
  }

  handleCancelDownload = () => {

     JBridge.cancelDownload(this.props.identifier)

     this.isCancelVisible=false;
     this.setCancelButtonVisibility("gone");

     this.startedDownloading=false;
     this.isDownloaded=false;
     this.replaceChild(this.idSet.downloadBarContainer, this.getButtons(0,this.props.buttonText).render(), 0);

  }


  checkContentLocalStatus = (status) => {
    var callback = callbackMapper.map(function (data) {
      var data = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("data in progress local", data)
      if (data.isAvailableLocally == true) {
        _this.isDownloaded = true;
        console.log("status local", status)
        _this.props.playContent = JSON.stringify(data)
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons("100", window.__S.PLAY).render(), 0);
      } else {
        _this.isDownloaded = false;
        console.log("status not local", status)
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons("0", window.__S.DOWNLOAD).render(), 0);
      }
    });//end of callback
    JBridge.getContentDetails(this.props.identifier, callback, false);
  }

  updateProgress = (res) => {
    console.log("inside updateProgress in ProgressButton -> ", res);

    var cb = res[0];
    var id = res[1];
    var data = JSON.parse(res[2]);
    if (id != _this.props.identifier) return;

    var textToShow = "";
    if (cb == "onDownloadProgress" && !this.isDownloaded) {

      data.downloadProgress = (data.downloadProgress == undefined || data.downloadProgress < 0) ? 0 : data.downloadProgress;
      _this.isDownloaded = false;
      this.isCancelVisible = true;
      this.setCancelButtonVisibility("visible");
      textToShow = window.__S.DOWNLOADING.format(data.downloadProgress);
      _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(data.downloadProgress, textToShow).render(), 0);
    } else if (cb == "onContentImportResponse") {

      if (data.status == "NOT_FOUND") {

        this.isCancelVisible = false;
        this.setCancelButtonVisibility("gone");
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(0, window.__S.DOWNLOAD).render(), 0);
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        return;
      } else if (data.status == "IMPORT_COMPLETED") {

        console.log(data.downloadProgress, "DONE");
        _this.props.changeOverFlowMenu();
        _this.isDownloaded = true;
        textToShow = window.__S.PLAY;
        _this.isCancelVisible = false;
        _this.setCancelButtonVisibility("gone");
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(100, textToShow).render(), 0);
      }
    }
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
      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        console.log(this.isDownloaded,this.props)
        if (this.isDownloaded) {
          var callback = callbackMapper.map(function (data) {
            data = utils.decodeBase64(data[0]);
            var parsedData = JSON.parse(utils.jsonifyData(data));
            console.log("data from progress", parsedData);
            JBridge.playContent(data, parsedData.identifier, parsedData.contentData.pkgVersion, utils.getFuncMapped(_this.checkTelemetry));
          });
          JBridge.getContentDetails(_this.props.identifier, callback, false);

        } else if(JBridge.isNetworkAvailable()){

          if (!this.startedDownloading) {
            this.startedDownloading = true;
            console.log("\n\n\n\n\n\n\n\n\n isCourse",this.props.isCourse)
            JBridge.importCourse(this.props.identifier, this.props.isCourse, utils.getCallbacks(_this.updateProgress, "", _this.updateProgress));
          }
        }
        else{
            window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
        }

      } else {
        this.setPermissions();
      }

  }


  checkTelemetry = (telemetryData) => {
    console.log("telemetry data in ProgressButton -> ", telemetryData);
    
    var cb = telemetryData[0];
    var id = telemetryData[1];
    var data = JSON.parse(utils.decodeBase64(telemetryData[2]));

    telemetryData = data;
    console.log("telemetry Data", telemetryData);
    console.log("props", this.props);
    console.log("telemetryData.eid", telemetryData.eid);
    if (telemetryData.eid == "END") {
      JBridge.stopTelemetryEvent();
      window.__RatingsPopup.show();
      var time = new Date();
      var date = utils.formatDate(time);
      var contentProgress = {};
      var courseIdentifer = "";



      contentProgress['contentId'] = this.props.identifier;
      contentProgress['courseId'] = this.props.contentDetails.hierarchyInfo[0].identifier;
      contentProgress['status'] = telemetryData.edata.summary[0].progress == 100 ? 2 : 1;
      contentProgress['progress'] = telemetryData.edata.summary[0].progress;
      contentProgress['lastAccessTime'] = date;
      contentProgress['result'] = "pass";
      contentProgress['grade'] = "B";
      contentProgress['score'] = "10";
      var enrolledCourse;
      console.log("contentProgress", contentProgress)

      if (window.__enrolledCourses && window.__enrolledCourses != "") {
        window.__enrolledCourses.map(function (item) {
          if (item.courseId == _this.props.contentDetails.hierarchyInfo[0].identifier)
            enrolledCourse = item;
        })
      }
      console.log("enrolled", enrolledCourse)
      contentProgress['batchId'] = enrolledCourse.hasOwnProperty("batchId") ? enrolledCourse.batchId : 0;
      console.log("batch ID", enrolledCourse)

      var url = window.__apiUrl + "/api/course/v1/content/state/update"

      console.log("date", date)

      var requestObject = {};

      var body = {
        "request": {
          "userId": window.__userToken,
          "contents": [
            contentProgress
          ]
        }
      };

      var callback = callbackMapper.map(function (data) {
        console.log(data)
        if (data[0] == "true") {
          console.log("in patch", body)
          window.__patchCallback = (data) => {
            console.log("patchApiCb -> ", data); 
          }
          if (window.__currCourseDetails && window.__currCourseDetails != {} && window.__currCourseDetails.endDate) {
            var eEndTime = (new Date(window.__currCourseDetails.endDate)).getTime();
            var eCurrTime = (new Date()).getTime();
            console.log("epochs -> "+ eEndTime + ", " + eCurrTime);
            
            if (eCurrTime < eEndTime){
              window.__currCourseDetails.reload = true;
              JBridge.patchApi(url, JSON.stringify(body), window.__user_accessToken, window.__apiToken);
            } else {
              JBridge.showToast("Unable to update progress as batch has ended.", "short");
            }
          }
        }
      })
      JBridge.getContentType(this.props.contentDetails.hierarchyInfo[0].identifier, callback)
    }
  }


  setPermissions = () => {

   var callback = callbackMapper.map(function(data) {

      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_warning_grey",window.__S.STORAGE);
      }

    });

    JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");

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
    var text = this.props.text;


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
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

module.exports = ProgressButton;
