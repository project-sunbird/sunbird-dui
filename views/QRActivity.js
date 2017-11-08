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
var Button = require('../components/Sunbird/Button');
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");


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
      "goBackBtn",
      "pageOption",
      "openSettingsBtn",
      "permissionSettingsMsg",
      "permissionTextHolder",
      "footer"
    ]);

    this.shouldCacheScreen = false;
    this.menuData = { url: [] }

    window.BarcodeResult = this.barcodeResult;
    _this = this;
  }

  openFrame = () => {
    var callback = callbackMapper.map(function(data) {
      console.log("Permission callback", data);
      if (data == "android.permission.CAMERA") {
        JBridge.setKey("isPermissionSetCamera", "true");
        QRScanner.openQRScanner(_this.idSet.frameLayout);
      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_warning_grey", window.__S.CAMERA);
      }
      if(data == "ERROR"){
        console.log("DENIED");
        _this.showErrorPopup("PERMISSION");
      }
    });
    JBridge.setPermissions(callback,"android.permission.CAMERA");
  }

  onBackPressed = () => {
    QRScanner.closeQRScanner();
    var whatToSend = [];
    var event = { tag: "BACK_QRActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  barcodeResult = (barcode) => {
    window.__LoaderDialog.show()
    QRScanner.closeQRScanner();
    console.log("barcode data", atob(barcode));
    barcode = atob(barcode);
    if (!this.isValidBarcode(barcode)) {
      this.showErrorPopup("WRONGQR");
      return;
    }
    var identifier = barcode.substr(barcode.lastIndexOf("/")+1,barcode.length);
    var callback = callbackMapper.map(function(data){
      console.log("getContentDetails ", data);
      if (data[0]=="__failed"){
        window.__LoaderDialog.hide()
        _this.showErrorPopup("WRONGQR");
        return;
      }
      var item = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("Callback data in QRActivity",item);
      window.__LoaderDialog.hide();
      if(item.contentType.toLowerCase() == "course"){
            console.log("Content type is course",item.contentData);
            var whatToSend={course:JSON.stringify(item.contentData)};
            var event={tag:"OPEN_CourseInfoActivity_QR",contents:whatToSend}
            window.__runDuiCallback(event);

      } else if(item.mimeType.toLowerCase() == "application/vnd.ekstep.content-collection"){
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

              var whatToSend = {resourceDetails:JSON.stringify(resDetails)}
              var event = {tag:"OPEN_ResourceDetailActivity_QR",contents:whatToSend}
              window.__runDuiCallback(event);
            }
    });

    if (JBridge.isNetworkAvailable())
      JBridge.getContentDetails(identifier,callback);
    else
      this.showErrorPopup("NOINTERNET");
  }

  showErrorPopup = (type) => {
    window.__LoaderDialog.hide();
    console.log("showErrorPopup", type );
    var cmd;
    if (type == "PERMISSION"){
      cmd += this.set({
        id: this.idSet.permissionSettingsMsg,
        text: window.__S.CAMERA_PERMISSION_DENIED
      });
      cmd += this.set({
        id: this.idSet.permissionTextHolder,
        visibility: "visible",
        text: window.__S.CAMERA_PERMISSION_SETTINGS.format(JBridge.getAppName())
      });
    } else if (type == "WRONGQR"){
      cmd += this.set({
        id: this.idSet.permissionSettingsMsg,
        text: window.__S.UNKNOWN_QR
      });
      cmd += this.set({
        id: this.idSet.permissionTextHolder,
        visibility: "gone"
      });
    } else if (type == "NOINTERNET"){
      cmd += this.set({
        id: this.idSet.permissionSettingsMsg,
        text: window.__S.ERROR_NO_INTERNET_MESSAGE
      });
      cmd += this.set({
        id: this.idSet.permissionTextHolder,
        visibility: "gone"
      });
    }
    this.replaceChild(this.idSet.footer, this.getFooter(type).render(), 0)
    cmd += this.set({
      id: this.idSet.errorPopup,
      visibility: "visible"
    });
    Android.runInUI(cmd, null);
  }

  isValidBarcode = (data) => {
    var re = new RegExp(JBridge.getApiUrl());
    console.log("regex match - " + re.test(data));
    if (re.test(data)){
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

  openSettings = () => {
    JBridge.showPermissionScreen();
  }

  getFooter = (type) => {
    if (type == "PERMISSION"){
      return (
        <LinearLayout
          width = "match_parent"
          height = "wrap_content">
          <Button
            id={this.idSet.openSettingsBtn}
            type = {"BigButton_Primary_WB"}
            text={window.__S.OPEN_SETTINGS}
            margin="10,20,10,20"
            onClick={this.openSettings}/>
          </LinearLayout>
      )
    } else if (type == "WRONGQR" || type == "NOINTERNET") {
      this.goBackBtn = {
        text : window.__S.CANCEL,
        id : this.idSet.goBackBtn,
        isClickable : "true",
        onClick : this.onBackPressed
      };

      this.tryAgainBtn = {
        text : window.__S.TRY_AGAIN,
        id : this.idSet.tryAgainBtn,
        isClickable : "false",
        onClick : this.handleRetry
      }
      return (
        <LinearLayout
          width = "match_parent"
          height= "wrap_content"
          margin="0, 16, 0, 0">
          <PageOption
            id={this.idSet.pageOption}
            visibility="visible"
            width="match_parent"
            buttonItems={[this.goBackBtn, this.tryAgainBtn]}
            hideDivider={true}
            onButtonClick={this.handlePageOption}/>
        </LinearLayout>
      )
    }
  }

  getErrorPopup = () => {
    var popup = (
      <RelativeLayout
        width="match_parent"
        height="match_parent">
        <LinearLayout
          width="match_parent"
          height="match_parent"
          clickable="true"
          background="#000000"
          alpha="0.5"/>
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="vertical"
          background="#ffffff"
          gravity="center_horizontal"
          alignParentBottom="true, -1">
          <ImageView
            width="87"
            height="78"
            margin="0,100,0,0"
            gravity="center_horizontal"
            imageUrl={"ic_warning_grey"}/>
          <TextView
            width="260"
            height="wrap_content"
            margin="0,20,0,0"
            gravity="center_horizontal"
            style={window.__TextStyle.textStyle.HINT.DULL}
            id={this.idSet.permissionSettingsMsg}
            />
          <TextView
           width="wrap_content"
           height="wrap_content"
           id={this.idSet.permissionTextHolder}
           margin="16,80,16,16"
           gravity="center_horizontal"
           style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>
          <LinearLayout
            width="match_parent"
            orientation="vertical"
            id = {this.idSet.footer}/>
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
        <RelativeLayout
        width="match_parent"
        height="match_parent">
        <LinearLayout
          width="match_parent"
          height="match_parent"
          orientation="vertical">
          <SimpleToolbar
             title="Scan QR Code"
             width="match_parent"
             showMenu="true"
             invert="true"
             menuData={this.menuData}
             onBackPress={this.onBackPressed}/>
          <ImageView
            margin="0,0, 0,0"
            width="match_parent"
            background = "#123123"
            height = "wrap_content"
            adjustViewBounds="true"
            imageUrl="ic_scanqrdemo"/>
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
