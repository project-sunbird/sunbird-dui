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
    this.checkContentLocalStatus(this.props.identifier);
    _this = this;

  }



  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function(status) {


      if (status == "true") {
        _this.isDownloaded = true;
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons("100", "PLAY").render(), 0);

      }



    });
    JBridge.getLocalContentStatus(identifier, callback);
  }



  updateProgress = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.props.identifier)
      return;

    var textToShow = ""
    data.downloadProgress=data.downloadProgress<0?0:data.downloadProgress;

    if (parseInt(data.downloadProgress) == 100) {

      _this.isDownloaded = true;
      textToShow = "PLAY"


    } else {
      _this.isDownloaded = false;
      textToShow = "DOWNLOADED " + data.downloadProgress + "%"

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
        JBridge.playContent(this.props.identifier);

      } else {
        console.log("download");
        JBridge.importCourse(this.props.identifier);

      }
    } else {
      console.log("handleButtonClick PERMISSION");
      this.setPermissions();
    }

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
