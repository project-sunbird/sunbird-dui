var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../../../utils/GenericFunctions');


var Button = require('../../Sunbird/Button');

var _this;

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

    var callback = callbackMapper.map(function(data){
      var data = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("data in progress local",data)
      if(data.isAvailableLocally == true){
        _this.isDownloaded = true;
      console.log("status local", status)
        _this.props.playContent = JSON.stringify(data)
      // this.props.playContent = JSON.stringify(data)
      _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons("100", window.__S.PLAY).render(), 0);
      }
      else{
        _this.isDownloaded = false;
      console.log("status not local", status)
      _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons("0", window.__S.DOWNLOAD).render(), 0);
      }


    })
    JBridge.getContentDetails(this.props.identifier,callback)


  }

  updateProgress = (pValue) => {
    var cmd;


    var data = JSON.parse(pValue);

    if (data.identifier != _this.props.identifier){
      console.log("NOT mine")
      return;
    }

    var textToShow = ""

    data.downloadProgress = ( data.downloadProgress == undefined || data.downloadProgress < 0 )? 0 : data.downloadProgress;
    console.log("--->\t\t\t\n\n\n", data);
     console.log(data.downloadProgress)
     if(data.status == "NOT_FOUND"){
          this.setCancelButtonVisibility("gone");
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(0, window.__S.DOWNLOAD).render(), 0);
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        return;
     }
    if (parseInt(data.downloadProgress) == 100) {
    console.log(data.downloadProgress ,"DONE")
      _this.props.changeOverFlowMenu();
      _this.isDownloaded = true;
      textToShow = window.__S.PLAY;
      _this.isCancelVisible=true;
      _this.setCancelButtonVisibility("gone");

    } else {
      console.log(data.downloadProgress , "UPDATING")
      _this.isDownloaded = false;
      textToShow = window.__S.DOWNLOADING.format(data.downloadProgress)

    }
    if(!this.isCancelVisible && data.downloadProgress>0){
        this.setCancelButtonVisibility("visible");
        this.isCancelVisible=true;

    }

    _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(data.downloadProgress, textToShow).render(), 0);

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

      window.__getDownloadStatus = this.updateProgress;

      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        console.log(this.isDownloaded,this.props)
        if (this.isDownloaded) {
          window.__getGenieEvents = this.checkTelemetry;
          // if(this.props.playContent!=null && this.props.playContent!=undefined){
          //   console.log("play local content")
          //   JBridge.playContent(btoa(JSON.stringify(this.props.playContent)));
          // }
          // else{
            var callback = callbackMapper.map(function(data){
              console.log("data from progress",JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0]))))
              JBridge.playContent(utils.decodeBase64(data[0]));
            });
            JBridge.getContentDetails(_this.props.identifier,callback);
          // }

        } else if(JBridge.isNetworkAvailable()){

          if (!this.startedDownloading) {
            this.startedDownloading = true;
            console.log("\n\n\n\n\n\n\n\n\n isCourse",this.props.isCourse)
            JBridge.importCourse(this.props.identifier, this.props.isCourse);
          }
        }
        else{
            window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
        }

      } else {
        this.setPermissions();
      }

  }


  checkTelemetry = (telemetryData) => {
    telemetryData = JSON.parse(utils.decodeBase64(telemetryData));
    console.log("telemetry Data",telemetryData);
    console.log("props",this.props)
    if (telemetryData.eid == "OE_END") {
        JBridge.stopEventBus();
        var time = new Date();
        var date = utils.formatDate(time);
        var contentProgress = {};
        var courseIdentifer = "";



        contentProgress['contentId'] = this.props.identifier;
        contentProgress['courseId'] = this.props.contentDetails.hierarchyInfo[0].identifier;
        contentProgress['status'] = telemetryData.edata.eks.progress == 100 ? 2 : 1;
        contentProgress['progress'] = telemetryData.edata.eks.progress;
        contentProgress['lastAccessTime'] = date;
        if(telemetryData.edata.eks.progress == 100){
          contentProgress['lastCompletedTime'] = date;
        }
        contentProgress['result'] = "pass";
        contentProgress['grade'] = "B";
        contentProgress['score'] = "10";
        var enrolledCourse;
        console.log("contentProgress",contentProgress)

        window.__enrolledCourses.map(function(item){
          if(item.courseId == _this.props.contentDetails.hierarchyInfo[0].identifier)
            enrolledCourse = item;
        })
        console.log("enrolled",enrolledCourse)
        contentProgress['batchId'] = enrolledCourse.hasOwnProperty("batchId")? enrolledCourse.batchId : 0 ;
        console.log("batch ID",enrolledCourse)

        var url = window.__apiUrl + "/api/course/v1/content/state/update"

        console.log("date",date)

        var requestObject = {};

        var body = {
                  "id":"unique API ID",
                  "ts":"response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
                    "params": {

                      },
                  "request":{
                      "userId": window.__userToken,
                    "contents":[
                            contentProgress
                     ]
                    }
                  }


    var callback = callbackMapper.map(function(data){
        console.log(data)
        if(data[0] == "true"){
            console.log("in patch",body)

            JBridge.patchApi(url,JSON.stringify(body),window.__userToken,window.__apiToken);
          }
      })
      JBridge.getContentType(this.props.contentDetails.hierarchyInfo[0].identifier,callback)

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
