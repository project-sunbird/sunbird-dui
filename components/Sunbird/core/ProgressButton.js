var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;


var Button = require('../../Sunbird/Button');

var _this;

class ProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ProgressButton";
    this.setIds([
      "downloadingText",
      "downloadBarContainer",
      "downloadBar"
    ])

    window.__ProgressButton = this;
    this.isDownloaded = false;
    this.startedDownloading = false;
    // console.log("props in console",this.props.contentDetails.isAvailableLocally);
    // this.checkContentLocalStatus(this.props.identifier);


    _this = this;

    console.log("local status content", this.props.localStatus)


  }

  afterRender = () => {
    this.checkContentLocalStatus(this.props.localStatus);
  }


  checkContentLocalStatus = (status) => {
    // console.log("this.props.contentDetails",this.props.contentDetails)
    // var callback = callbackMapper.map(function(status) {
    if (status == true) {
      this.isDownloaded = true;
      console.log("status", status == "true")
      this.replaceChild(this.idSet.downloadBarContainer, this.getButtons("100", "PLAY").render(), 0);

    }

    // });
    // JBridge.getLocalContentStatus(this.props.identifier, callback);

  }

  updateProgress = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.props.identifier)
      return;

    var textToShow = ""
    data.downloadProgress = data.downloadProgress < 0 ? 0 : data.downloadProgress;

    if (parseInt(data.downloadProgress) == 100) {

      _this.isDownloaded = true;
      textToShow = "PLAY"


    } else {
      _this.isDownloaded = false;
      textToShow = "DOWNLOADING " + data.downloadProgress + "%"

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


  handleButtonClick = () => {

    window.__getDownloadStatus = this.updateProgress;
    console.log("dp", this.isDownloaded);

    if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {

      if (this.isDownloaded) {
        console.log("play");
        if (this.props.isCourse == "true") {
          window.__getGenieEvents = this.checkTelemetry;
          JBridge.playChildContent(this.props.identifier)
        } else {
          JBridge.playContent(this.props.identifier);
        }
        
      } else {
        console.log("download");
        if (!this.startedDownloading) {
          this.startedDownloading = true;
          JBridge.importCourse(this.props.identifier, this.props.isCourse);

        }

      }
    } else {
      console.log("handleButtonClick PERMISSION");
      this.setPermissions();
    }

  }
  checkTelemetry = (telemetryData) => {
    console.log("telemetryData", telemetryData);
    telemetryData = JSON.parse(telemetryData);
    console.log(telemetryData)
    if(telemetryData.eid == "OE_END"){
      console.log("reached end of content");
    }
    // JBridge.syncTelemetry();
  }


  setPermissions = () => {

    var callback = callbackMapper.map(function(data) {

      if (data == "SUCCESS") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
      }

    });

    JBridge.setPermissions(callback);
  }


  getDownloadBackground = (value) => {

    value = (value < 0) ? 0 : value;

    var pLeft = parseFloat(value) / parseFloat(100);
    var pRight = (1 - pLeft);

    return (<LinearLayout
        width="match_parent"
        onClick={this.handleButtonClick}
        root="true"
        height="48">

            <LinearLayout
            width="0"
            height="match_parent"
            weight={pLeft}
            multiCorners={"8,0,0,8,"+window.__Colors.THICK_BLUE}/>

            <LinearLayout
            width="0"
            height="match_parent"
            weight={pRight}
            multiCorners={"0,8,8,0,"+window.__Colors.PRIMARY_DARK}/>

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
        >
        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>
        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="16,16,16,16"
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
