var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");
var SharePopup = require('../components/Sunbird/core/SharePopup');
var FlagPopup = require('../components/Sunbird/FlagPopup');
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var utils = require('../utils/GenericFunctions');
var RatingsPopup = require('../components/Sunbird/RatingsPopup');

window.R = require("ramda");

var _this;
class ResourceDetailActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'ratingBar',
      "progressButtonContainer",
      "simpleToolBarOverFlow",
      "sharePopupContainer"
    ]);
    this.state = state;
    this.screenName = "ResourceDetailActivity"
    this.menuData = {
      url: [
        {imageUrl: "ic_action_share_black" },
      ]
    }
    this.menuData1 = {
      url: [
        {imageUrl: "ic_action_share_black" },
        {imageUrl:'ic_action_overflow'}
      ]
    }
    this.popupMenu = window.__loggedInState == "GUEST" ? window.__S.DELETE : (window.__S.DELETE + "," + window.__S.FLAG);
    _this = this;

    this.shouldCacheScreen = false;

    this.details = state.data.value0.resourceDetails;
    this.details = JSON.parse(this.details);
    console.log("RDA",this.details);
    JBridge.logResourceDetailScreenEvent(_this.details.content.identifier, _this.details.content.pkgVersion, _this.details.isAvailableLocally);
    JBridge.startEventLog(_this.details.content.contentType, _this.details.content.identifier, _this.details.content.pkgVersion);
    this.localStatus = false;
  }

  checkLocalStatus = (data) => {
    var callback = callbackMapper.map(function(data) {
      console.log("cb data -> ", data);
      if (data == "__failed") {
        //TODO implemented hack, actual implementation - get error from SDK
        if (JBridge.isNetworkAvailable()) {
          window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        } else {
          window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
        }
        _this.onBackPressed();
        return;
      }
      _this.contentData = JSON.parse(utils.decodeBase64(data[0]));
      console.log("this.contentData: ", _this.contentData);
      if (_this.contentData.hasOwnProperty("contentFeedback") && _this.contentData.contentFeedback.length !=0) {
        window.__RatingsPopup.initData(_this.contentData.identifier, "content-detail", _this.contentData.contentData.pkgVersion, _this.contentData.contentFeedback[0].rating, _this.contentData.contentFeedback[0].comments);
      } else {
        window.__RatingsPopup.initData(_this.contentData.identifier, "content-detail", _this.contentData.contentData.pkgVersion);        
      }
      if (_this.contentData.isAvailableLocally == true) {
        _this.localStatus = true;
        var pButonLayout = (
        <ProgressButton
          width="match_parent"
          isCourse = "false"
          playContent = {_this.contentData}
          contentDetail = {_this.contentData.contentData}
          buttonText={window.__S.PLAY}
          localStatus = {_this.localStatus}
          identifier = {_this.contentData.identifier}
          changeOverFlowMenu = {_this.changeOverFlow}/>)
        _this.replaceChild(_this.idSet.progressButtonContainer, pButonLayout.render(), 0);
        _this.changeOverFlow();
      } else {
        var pButonLayout = (
        <ProgressButton
          width="match_parent"
          isCourse = "false"
          contentDetail = {_this.contentData.contentData}
          buttonText={window.__S.DOWNLOAD}
          playContent = {null}
          localStatus = {_this.localStatus}
          identifier = {_this.contentData.identifier}
          changeOverFlowMenu = {_this.changeOverFlow} />);
        _this.replaceChild(_this.idSet.progressButtonContainer, pButonLayout.render(), 0);
      }
    });
    JBridge.getContentDetails(data.content.identifier, callback, true);
  }

  onStop = () =>{
    window.__PermissionDeniedDialog.hide();
    window.__SharePopup.hide();
    console.log("ON STOP IN ResourceDetailActivity")
  }

  onPause = () =>{
    console.log("ON PAUSE IN ResourceDetailActivity")
  }

  shareContent = (isContentLocallyAvailable) =>{
    var shareCallback = callbackMapper.map(function(data) {
      if(data[0]!="failure"){
        var input;
        console.log("SHARE CALLBACK DATA", data[0]);
        if(isContentLocallyAvailable){
          input = [{
            type : "text",
            data : window.__deepLinkUrl+"/public/#!/content/"+_this.details.identifier
          },{
            type : "file",
            data : "file://"+data[0]
          }];
        }else{
          input = [{
            type : "text",
            data : window.__deepLinkUrl+"/public/#!/content/"+_this.details.identifier
          }];
        }
      } else {
        input = [{
          type : "text",
          data : window.__deepLinkUrl+"/public/#!/content/"+_this.details.identifier
        }];
      }
      var sharePopUp = (
      <SharePopup
        data = {input}
        identifier = {_this.details.identifier}
        type = "LIBRARY"/>
      );
      _this.replaceChild(_this.idSet.sharePopupContainer,sharePopUp.render(),0);
      window.__SharePopup.show();
    });
    JBridge.exportEcar(this.details.identifier, shareCallback);
  }

  afterRender = () => {
     this.checkLocalStatus(this.details);
    if(this.details && this.details.content && this.details.content.me_averageRating){
      JBridge.setRating(this.idSet.ratingBar, this.details.content.me_averageRating);
    }else if(this.details.content.hasOwnProperty("contentData") && this.details.content.contentData.hasOwnProperty("me_averageRating")){
      JBridge.setRating(this.idSet.ratingBar, this.details.content.contentData.me_averageRating);
    }else{
      JBridge.setRating(this.idSet.ratingBar, 0);
    }
  }

  flagContent = (comment,selectedList) =>{
    window.__LoaderDialog.show();
    console.log("flag request",this.details)
    console.log(comment,selectedList)
    var versionKey;
    if(this.details.content.hasOwnProperty("versionKey")){
      versionKey = this.details.content.versionKey;
    }
    else if(this.details.content.hasOwnProperty("contentData") && this.details.content.contentData.hasOwnProperty("versionKey")){
      versionKey = this.details.content.contentData.versionKey
    }
    JBridge.logFlagClickInitiateEvent("LIBRARY", selectedList.toString(), comment, this.details.content.identifier, "content", this.details.content.pkgVersion);

    var request = {
      "flagReasons":selectedList,
      "flaggedBy":window.__userName,
      "versionKey": versionKey,
      "flags": [comment]
    }
    var whatToSend = {
      "user_token" : window.__user_accessToken,
      "api_token" : window.__apiToken,
      "requestBody" : JSON.stringify(request),
      "identifier" : this.details.content.identifier
    }
    var event= { "tag": "API_FlagContent", contents: whatToSend };
    window.__runDuiCallback(event);
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }
  
  getBody = () => {
    var description = "Not Available";
    if(this.details.description)
        description = this.details.description
    else if(this.details.hasOwnProperty("content")){
      if(this.details.content.hasOwnProperty("description"))
          description  = this.details.content.description
      else if(this.details.content.hasOwnProperty("contentData") && this.details.content.contentData.description)
          description = this.details.content.contentData.description
    }
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical">
        <TextView
          margin="0,13,0,0"
          width="wrap_content"
          height="wrap_content"
          text={window.__S.ABOUT_MODULE}
          style={window.__TextStyle.textStyle.HINT.BOLD}/>
         <TextView
          margin="0,4,0,0"
          width="wrap_content"
          height="wrap_content"
          textFromHtml={description}
          style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}/>
          <TextView
            margin="0,16,0,0"
            width="wrap_content"
            height="wrap_content"
            text={window.__S.CREATED_BY}
            style={window.__TextStyle.textStyle.HINT.BOLD}/>
          <LinearLayout
            width="match_parent"
            height="wrap_content">
            <TextView
              margin="0,4,0,10"
              width="wrap_content"
              height="wrap_content"
              text={this.details.content.creator || window.__S.CREATOR_NAME_NOT_AVAILABLE}
              style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}/>
            <LinearLayout
              weight="1"/>
            <ImageView
              width="20"
              height="12"
              imageUrl="ic_chat"/>
          </LinearLayout>
      </LinearLayout>
    );
  }

  getHeader = () => {
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,16,0,0"
        orientation="vertical">
        <LinearLayout
          width="80"
          height="50"
          cornerRadius="4"
          background={window.__Colors.PRIMARY_BLACK_66}>
          <ImageView
            width="80"
            height="50"
            circularImageUrl={"4,"+ (this.details.imageUrl?this.details.imageUrl:"ic_launcher")}/>
        </LinearLayout>
        <TextView
          width="wrap_content"
          height="wrap_content"
          padding="8,0,0,0"
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
          text={this.details.title}/>
        <LinearLayout
          margin="0,12,0,0"
          width="match_parent"
          height="wrap_content">
          <TextView
            width="wrap_content"
            height="wrap_content"
            text={this.details.headFooterTitle}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>
          <LinearLayout
            weight="1"/>
          <TextView
            width="wrap_content"
            height="wrap_content"
            visibility = {this.details.hasOwnProperty("content")&& this.details.content.hasOwnProperty("me_totalDownloads") ? "visible" : "gone"}
            text={this.details.hasOwnProperty("content")&& this.details.content.hasOwnProperty("me_totalDownloads") ? parseInt(this.details.content.me_totalDownloads) : "0"}
            style={window.__TextStyle.textStyle.HINT.DULL}/>
        </LinearLayout>
        <LinearLayout
          margin="0,2,0,0"
          width="match_parent"
          height="wrap_content">
          <LinearLayout
            width="wrap_content"
            height="wrap_content"
            onClick={() => { window.__RatingsPopup.show() }}>
            <RatingBar
              id = {this.idSet.ratingBar}
              width="wrap_content"
              height="wrap_content"/>
          </LinearLayout>
          <LinearLayout
            weight="1"/>
          <TextView
            width="wrap_content"
            height="wrap_content"
            text={window.__S.DOWNLOADS}
            visibility = {this.details.hasOwnProperty("content")&& this.details.content.hasOwnProperty("me_totalDownloads") ? "visible" : "gone"}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>
        </LinearLayout>
      </LinearLayout>
    );
  }

  handleStateChange = (state) =>{
    var res = utils.processResponse(state);
    if(res.code!=504){
        var response = res.data;
        var responseCode = res.code;
        if(responseCode == "200"){

          var callback = callbackMapper.map(function(response){
            if(state.responseFor == "API_FlagContent" && response[0] == "successful"){
              JBridge.logFlagStatusEvent(_this.details.identifier, "LIBRARY", true, _this.details.content.pkgVersion);
              setTimeout(function(){
                window.__Snackbar.show(window.__S.CONTENT_FLAGGED_MSG)
                window.__BNavFlowRestart();
                _this.onBackPressed();
                window.__LoaderDialog.hide();
              }, 2000)
            }
          });
          JBridge.deleteContent(this.details.identifier,callback);

        } else {
          JBridge.logFlagStatusEvent(_this.details.content.identifier, "LIBRARY", false, _this.details.content.pkgVersion);
          window.__LoaderDialog.hide();
          window.__Snackbar.show(window.__S.CONTENT_FLAG_FAIL);
          _this.onBackPressed();
        }
        console.log(response)
    }else{
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.TIME_OUT)
      _this.onBackPressed();
    }
  }

  overFlowCallback = (params) => {
    window.__LoaderDialog.show();
     if(params == 0){
      var callback = callbackMapper.map(function(response){
        window.__LoaderDialog.hide();
        if(response[0] == "successful"){
          window.__Snackbar.show(window.__S.MSG_RESOURCE_DELETED);
          _this.onBackPressed();
        }
      });
      JBridge.deleteContent(this.details.identifier,callback);                
    }
    else if(params == 1){
      JBridge.logFlagScreenEvent("LIBRARY", this.details.content.identifier, this.details.content.pkgVersion);
      window.__LoaderDialog.hide();
      window.__FlagPopup.show();
    }
  }

  onBackPressed = () => {
    if(window.__PermissionDeniedDialog.getVisibility() == "visible"){
      window.__PermissionDeniedDialog.hide();
    }else if(window.__PreviewImagePopup.getVisibility()){
      window.__PreviewImagePopup.hide();
    }else{
      JBridge.endEventLog(_this.details.content.contentType, _this.details.content.identifier, _this.details.content.pkgVersion);
      var event= { "tag": "BACK_ResourceDetailActivity", contents: [] };
      window.__runDuiCallback(event);
    }
  }

  changeOverFlow = () =>{
    var toolbar =  (<SimpleToolbar
          width="match_parent"
          menuData={this.menuData1}
          popupMenu={this.popupMenu}
          onBackPress={onBackPressed}
          onMenuItemClick={this.handleMenuClick}
          overFlowCallback = {this.overFlowCallback}
          showMenu="true"/>);

    this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
    this.localStatus=true;
  }

  handleMenuClick = (url) =>{
    if(url == "ic_action_share_black"){
     if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
       this.shareContent(this.localStatus);
       JBridge.logShareContentInitiateEvent("LIBRARY", "content", this.details.content.identifier, this.details.content.pkgVersion);
     }else{
        this.setPermissions();
      }
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

  // getRatingsPopup = () => {
  //   this.RatingsPopup = (
  //     <RatingsPopup />
  //   );
  //   return this.RatingsPopup;
  // }

  render() {
    this.layout = (
      <RelativeLayout
        width="match_parent"
        height="match_parent"
        clickable="true"
        root="true">
        <LinearLayout
          background={window.__Colors.WHITE}
          orientation="vertical"
          width="match_parent"
          height="match_parent">
          <LinearLayout
            root = "true"
            width="match_parent"
            height="wrap_content"
            id = {this.idSet.simpleToolBarOverFlow}>
            <SimpleToolbar
              width="match_parent"
              menuData={this.menuData}
              popupMenu={this.popupMenu}
              onMenuItemClick={this.handleMenuClick}
              onBackPress={onBackPressed}
              overFlowCallback = {this.overFlowCallback}
              showMenu="true"/>
          </LinearLayout>
          <ScrollView
            weight="1"
            width="match_parent"
            fillViewport="true">
            <LinearLayout
              height="match_parent"
              width="match_parent"
              padding="16,0,16,0"
              orientation="vertical">
              {this.getHeader()}
              {this.getLineSeperator()}
              {this.getBody()}
            </LinearLayout>
          </ScrollView>
          <LinearLayout
            height="wrap_content"
            width="match_parent"
            id={this.idSet.progressButtonContainer}
            root="true"/>
        </LinearLayout>
      <FlagPopup
        onConfirm  = {this.flagContent}/>
      <LinearLayout
       width="match_parent"
       height="match_parent"
       id={this.idSet.sharePopupContainer}/>
    </RelativeLayout>
    );
    return this.layout.render();
  }
}

module.exports = Connector(ResourceDetailActivity);
