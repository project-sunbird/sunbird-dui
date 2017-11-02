var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend/src/android_views/FrameLayout");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var objectAssign = require('object-assign');
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var utils = require('../utils/GenericFunctions');
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var PageOption = require('../components/Sunbird/core/PageOption');

var _this;
window.R = require("ramda");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');

class QRActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.setIds([
      "frameLayout",
      "loading",
      "errorPopup",
      "tryAgainBtn",
      "goBackBtn"
    ]);

    this.shouldCacheScreen = false;
    this.menuData = {
      url: [
        { imageUrl: "ic_launcher"},
        { imageUrl: "ic_action_search" }
      ]
    }

    window.BarcodeResult = this.barcodeResult;
    _this = this;
  }

  openFrame = () => {
      QRScanner.openQRScanner(this.idSet.frameLayout);
  }

  onBackPressed = () => {
    QRScanner.closeQRScanner();
    var whatToSend = [];
    var event = { tag: "BACK_QRActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  barcodeResult = (barcode) => {
    QRScanner.closeQRScanner();
    console.log("barcode data", atob(barcode));
    barcode = atob(barcode);
    if (!this.isValidBarcode(barcode)) {
      this.showErrorPopup();
      return;
    }
    var identifier = barcode.substr(barcode.lastIndexOf("/")+1,barcode.length);
    var callback = callbackMapper.map(function(data){
      var item = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("Callback data in QRActivity",item);
      if(item.contentType.toLowerCase() == "course"){
            console.log("Content type is course",item.contentData);
            var whatToSend={course:JSON.stringify(item.contentData)};
            var event={tag:"OPEN_CourseInfoActivity_QR",contents:whatToSend}
            window.__runDuiCallback(event);

      } else if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook"){
              var itemDetails = JSON.stringify(item.contentData);
              _this.deepLinkCollectionDetails = itemDetails;
              console.log("Content type is collecion or TextBook",_this.deepLinkCollectionDetails);

              var whatToSend={course:_this.deepLinkCollectionDetails};
              var event={tag:"OPEN_CourseEnrolledActivity_QR",contents:whatToSend}
              window.__runDuiCallback(event);
      }else{
              var resDetails ={};
              var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");

              resDetails['imageUrl'] = item.hasOwnProperty("contentData") ?"file://"+item.basePath+"/"+item.contentData.appIcon : item.appIcon;
              resDetails['title'] = item.contentData.name;
              resDetails['description'] = item.description;
              resDetails['headFooterTitle'] = headFooterTitle;
              resDetails['identifier'] = item.identifier;
              resDetails['content'] = item;

              console.log("resourceDetails IN QRActivity",resDetails);

              var whatToSend = {resource:JSON.stringify(resDetails)}
              var event = {tag:"OPEN_ResourceDetailActivity_QR",contents:whatToSend}
              window.__runDuiCallback(event);
            }
    });
    JBridge.getContentDetails(identifier,callback);
  }

  showErrorPopup = () => {
    console.log("showErrorPopup");
    var cmd = this.set({
      id: this.idSet.errorPopup,
      visibility: "visible"
    });
    Android.runInUI(cmd, null);
  }

  isValidBarcode = (data) => {
    var identifier = data.substr(data.lastIndexOf("/")+1,data.length);
    console.log("regex match - " + identifier.match(/do_\d{22}/g));
    if (identifier.match(/do_\d{22}/g)){
      return true
    }
    return false;
  }

  handleRetry = () => {
    var cmd = this.set({
      id: this.idSet.errorPopup,
      visibility:"gone"
    });
    Android.runInUI(cmd, null);
    QRScanner.openQRScanner(this.idSet.frameLayout);
  }

  getErrorPopup = () => {
    this.goBackBtn = {
      text : "GO TO HOME",
      id : this.idSet.goBackBtn,
      isClickable : "true",
      onClick : this.onBackPressed
    };

    this.tryAgainBtn = {
      text : "TRY AGAIN",
      id : this.idSet.tryAgainBtn,
      isClickable : "false",
      onClick : this.handleRetry
    }
    var popup = (
      <RelativeLayout
        width="match_parent"
        height="match_parent">
        <LinearLayout
          width="match_parent"
          height="match_parent"
          background="#000000"
          alpha="0.5"/>
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="vertical"
          background="#ffffff"
          alignParentBottom="true, -1">
          <TextView
            margin="16,16,16,16"
            text="Invalid QR"/>
            <PageOption
                width="match_parent"
                buttonItems={[this.goBackBtn, this.tryAgainBtn]}
                hideDivider={false}
                onButtonClick={this.handlePageOption}/>
        </LinearLayout>
      </RelativeLayout>
    );
    return popup;
  }

  render() {
    this.layout = (
      <LinearLayout
        width="match_parent"
        height="match_parent"
        root="true"
        clickable="true"
        background="#FFFFFF"
        orientation="vertical">
        <SimpleToolbar
           title=""
           width="match_parent"
           showMenu="true"
           invert="true"
           menuData={this.menuData}
           onBackPress={this.onBackPressed}
           onMenuItemClick={this.handleMenuClick}/>
        <RelativeLayout
        width="match_parent"
        height="match_parent">
        <LinearLayout
          width="match_parent"
          height="match_parent"
          orientation="vertical">
          <LinearLayout
            width="match_parent"
            height="wrap_content">
            <TextView
              margin="16,16,16,16"
              text="Scan QR code on your textbook"/>
          </LinearLayout>
          <FrameLayout
            id={this.idSet.frameLayout}
            afterRender = {this.openFrame}
            width="match_parent"
            height="match_parent"
            background="#FFFFFF"/>
        </LinearLayout>
        <LinearLayout
          width="match_parent"
          height="match_parent"
          visibility="gone"
          id = {this.idSet.errorPopup}>
          {this.getErrorPopup()}
        </LinearLayout>
      </RelativeLayout>
    </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = Connector(QRActivity);
