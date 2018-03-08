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
    this.id = this.props.id ? this.props.id : this.idSet.downloadBtn;
    this.enqueuedForDownload = [];
    _this = this;
    this.isCancelVisible = false;
    console.log("DownloadAllProgressButton props", this.props);
    this.cb_id = Math.floor(Math.random() * 1000); //Random number to for callback id
    console.log("cb_id", this.cb_id);

  }

  update = (listOfIds) => {
    if (this.btnState == this.BTN_STATES.IDLE) {
      this.btnState = this.BTN_STATES.DOWNLOADING;
      this.downloadContentCount = 0;
    }
    this.childrenArray = listOfIds;
    this.setCancelButtonVisibility("visible");
    JBridge.downloadAllContent(this.cb_id, this.childrenArray, utils.getCallbacks(this.updateProgress, "", this.updateProgress));
  }

  setCancelButtonVisibility = (visibility) => {
    //TODO Hiding cancel for now, sdk side issue 
    // var cmd = this.set({
    //   id: this.idSet.cancelDownloadHolder,
    //   visibility: visibility
    // })
    // Android.runInUI(cmd, 0);
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
    this.isDownloaded = false;
    this.replaceChild(this.idSet.downloadBarContainer, this.getButtons(0, this.props.buttonText).render(), 0);
  }

  checkCompleted = () => {
    var completed = 0;
    this.enqueuedForDownload.map((item) => {
      if (item.status == 1) completed += 1;
    });
    return completed;
  }

  updateProgress = (res) => {
    console.log("downloadAll res -> ", res);
    var cb = res[0];
    var id = res[1];
    var data = JSON.parse(res[2]);

    // if (id != this.cb_id) return;
    if (cb == "importContentSuccessResponse" && this.btnState == this.BTN_STATES.DOWNLOADING) {
      data.result.map((item, i) => {
        if (item.status == "ENQUEUED_FOR_DOWNLOAD") {
          this.enqueuedForDownload[i] = {
            id: item.identifier,
            status: 0
          }
        }
      });
      if (this.enqueuedForDownload.length == 0) {
        this.btnState = this.BTN_STATES.IDLE;
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_FOUND);
        this.isDownloaded = false;
        this.setCancelButtonVisibility("gone");
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(0, this.props.buttonText).render(), 0);
      } else {
        this.btnState = this.BTN_STATES.DOWNLOADING;
        var text = "0/" + this.enqueuedForDownload.length;
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(progress, window.__S.DOWNLOADING_1.format(text)).render(), 0);
      }
    }

    if (cb == "onDownloadProgress" && this.enqueuedForDownload.length != 0 && this.btnState == this.BTN_STATES.DOWNLOADING) {
      var completed = this.checkCompleted();
      var progress = (completed / this.enqueuedForDownload.length) * 100;
      var text = completed + "/" + this.enqueuedForDownload.length;
      _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(progress, window.__S.DOWNLOADING_1.format(text)).render(), 0);
    }

    if (cb == "onContentImportResponse" && this.enqueuedForDownload.length != 0 && this.btnState == this.BTN_STATES.DOWNLOADING) {
      if (data.status == "IMPORT_COMPLETED") {
        var newArr = this.enqueuedForDownload.map((item, i) => {
          if (item.id == data.identifier) return { id: item.id, status: 1 };
          else return item;
        });
        this.enqueuedForDownload = newArr;
      }
      var noDownloaded = this.checkCompleted();
      if (noDownloaded == this.enqueuedForDownload.length) {
        this.btnState = this.BTN_STATES.DONE;
        JBridge.stopEventBus(_this.cb_id + "");
        window.__Snackbar.show(window.__S.DOWNLOAD_COMPLETED);
        var cmd = this.set({
          id: this.id,
          visibility: "gone"
        })
        Android.runInUI(cmd, 0);
      }
    }
  }

  handleButtonClick = () => {
    if (this.btnState == this.BTN_STATES.IDLE) {
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

        {this.getDownloadBackground(value)}

        <TextView
          width="wrap_content"
          height="wrap_content"
          centerInParent="true,-1"
          id={this.idSet.downloadingText}
          style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
          text={text} />
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
          height="48"
          width="48"
          visibility="gone"
          id={this.idSet.cancelDownloadHolder}
          onClick={this.handleCancelDownload}>

          <ImageView
            height="48"
            width="48"
            imageUrl="ic_action_close" />
        </LinearLayout>
      </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = DownloadAllProgressButton;
