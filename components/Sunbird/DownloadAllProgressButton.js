var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var Button = require('../Sunbird/Button');
var utils = require('../../utils/GenericFunctions');

var _this;

class DownloadAllProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "DownloadAllProgressButton";
    this.setIds([
      "downloadingText",
      "downloadBarContainer",
      "cancelDownloadHolder",
      "downloadBtn"
    ]);

    this.BTN_STATES = {
      IDLE: 0,
      DOWNLOADING: 1,
      DONE: 2
    }
    this.btnState = this.BTN_STATES.IDLE;
    this.childrenArray = [];
    this.isDownloaded = false;
    this.startedDownloading = false;
    this.id = this.props.id ? this.props.id : this.idSet.downloadBtn;
    _this = this;
    this.isCancelVisible=false;
    console.log("DownloadAllProgressButton props",this.props);
    window.__getDownloadStatus = (data) => { console.log("__getDownloadStatus -> ", data) };
    window.__onContentImportResponse = (data) => { console.log("__onContentImportResponse -> ", data) };
    window.__onContentImportProgress = (data) => { console.log("__onContentImportProgress -> ", data) };
  }

  update = (listOfIds) => {
    window.__getDownloadStatus = (data) => { console.log("__getDownloadStatus -> ", data) };
    window.__onContentImportResponse = this.afterDownload;
    window.__onContentImportProgress = this.updateProgress;
    this.childrenArray = listOfIds;
    this.setCancelButtonVisibility("visible");
    JBridge.downloadAllContent(this.childrenArray);
    this.updateProgress(0);
  } 

  setCancelButtonVisibility = (visibility) => {
    var cmd = this.set({
      id: this.idSet.cancelDownloadHolder,
      visibility: visibility
    })
    Android.runInUI(cmd, 0);
  }

  handleCancelDownload = () => {
    if (this.btnState != this.BTN_STATES.DONE) {
      this.btnState = this.BTN_STATES.IDLE;
    }
    this.childrenArray.map((item) => {
      JBridge.cancelDownload(item);
    })
    this.isCancelVisible = false;
    this.setCancelButtonVisibility("gone");
    this.startedDownloading = false;
    this.isDownloaded = false;
    this.replaceChild(this.idSet.downloadBarContainer, this.getButtons(0, this.props.buttonText).render(), 0);
  }

  updateProgress = (progress) => {
    console.log("window.__onContentImportProgress -> ", progress);
    // var jsonResponse = JSON.parse(response);
    // console.log("response for download all", jsonResponse.status);

    // if (jsonResponse.status == "IMPORT_COMPLETED") {
    //   this.downloadContentCount++;
    // }

    // var textToShow = ""
    // var progress = 0
    // if (this.downloadContentCount == this.childrenCount) {
    //   textToShow = "All Contents Downloaded"
    //   this.setCancelButtonVisibility("gone");
    //   this.isCancelVisible = false;
    // } else {
    //   _this.isDownloaded = false;
    //   textToShow = "DOWNLOADING " + this.downloadContentCount + "/" + this.childrenCount
    //   progress = (this.downloadContentCount / this.childrenCount) * 100;
    // }
    // if (!this.isCancelVisible) {
    //   this.setCancelButtonVisibility("visible");
    //   this.isCancelVisible = true;
    // }
    _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(0, window.__S.DOWNLOADING.format(progress)).render(), 0);
  }

  afterDownload = (response) => {
    console.log("window.__onContentImportResponse -> ", response);
    var jsonResponse = JSON.parse(response);
    if (jsonResponse.status == "IMPORT_COMPLETED") {
      var cmd = this.set({
        id: this.id,
        visibility: "gone"
      })
      Android.runInUI(cmd, 0);
      window.__Snackbar.show("Downloaded all contents");
    }
  }

  handleButtonClick = () => {
    if (this.btnState == this.BTN_STATES.IDLE) {
      this.btnState = this.BTN_STATES.DOWNLOADING;
      this.downloadContentCount = 0;
      // window.__onContentImportResponse = this.updateProgress;
      this.props.handleButtonClick();
    }
  }


  getDownloadBackground = (value) => {
    value = (value < 0) ? 0 : value;

    var pLeft = parseFloat(value) / parseFloat(100);
    var pRight = (1 - pLeft);

    var mCornerLeft = "8,0,0,8,";
    var mCornerRight = "0,8,8,0,";
    if (pLeft == 1) {
      mCornerLeft = "8,8,8,8,";
    } else if (pLeft <= 0) {
      mCornerRight = "8,8,8,8,";
    }
    return (<LinearLayout
      width="match_parent"
      root="true"
      height="48">

      <LinearLayout
        width="0"
        height="match_parent"
        weight={pLeft}
        multiCorners={mCornerLeft + window.__Colors.THICK_BLUE} />

      <LinearLayout
        width="0"
        height="match_parent"
        weight={pRight}
        multiCorners={mCornerRight + window.__Colors.PRIMARY_DARK} />
    </LinearLayout>);
  }

  getButtons = (value, text) => {
    var _this = this;
    var layout = (
      <RelativeLayout
        width="match_parent"
        height="48"
        root="true"
        onClick={this.handleButtonClick}>

        { this.getDownloadBackground(value)}

        <TextView
          width="wrap_content"
          height="wrap_content"
          centerInParent="true,-1"
          id={this.idSet.downloadingText}
          style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
          text={text}/>
        </RelativeLayout>);
    return layout;
  }

  render() {
    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="horizontal"
        width="match_parent"
        margin="16,0,16,16"
        background={window.__Colors.WHITE}
        visibility={this.props.visibility ? this.props.visibility : "visible"}
        id={this.id}
        layoutTransition="true">

        <LinearLayout
          height="match_parent"
          weight="1"
          root="true"
          id={this.idSet.downloadBarContainer}>

          {this.getButtons(0, this.props.buttonText)}
        </LinearLayout>

        <LinearLayout
          height = "48"
          width = "48"
          visibility="gone"
          id={this.idSet.cancelDownloadHolder}
          onClick={this.handleCancelDownload}>

          <ImageView
            height="48"
            width="48"
            imageUrl="ic_action_close"/>
        </LinearLayout>
      </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = DownloadAllProgressButton;
