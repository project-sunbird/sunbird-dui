var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var debounce = require("debounce");
var objectAssign = require('object-assign');
var FeatureCards = require('../components/Sunbird/FeatureCards');
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextInputView = require('../components/Sunbird/core/TextInputView');
var ProgressBar = require("@juspay/mystique-backend/src/android_views/ProgressBar");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var utils = require('../utils/GenericFunctions');

var _this;

window.R = require("ramda");

class UserActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    console.log("UA in state -> ", this.state);

    this.screenName = "UserActivity"

    this.setIds([
      "parentContainer",
      "importEcarLayout",
      "importEcarText"
    ]);
    this.backPressCount = 0;
    this.shouldCacheScreen = false;

    this.userName = this.userPass = this.firstName = "";
    _this = this;

    this.deepLinkCollectionDetails = "";
    this.whereFrom = this.state.data.value0.whereFrom;
    
    window.__LoaderDialog.hide();
    window.__loggedInState = JBridge.getFromSharedPrefs("logged_in")
  }

  getImportStatus = (response) => {
    var cb = response[0];
    var id = response[1];
    var data = JSON.parse(response[2]);

    console.log("response for import", data);

    if (data.status == "IMPORT_COMPLETED") {
      console.log("content doesnot ALREADY_EXIST");
      var identifier;
      if (data.identifier != undefined && data.identifier != "") {
        console.log("identifier fetched >>" + data.identifier + "<<");
        identifier = data.identifier;
        _this.handleDeepLinkAction(identifier);
        return;
      } else {
        console.log("no identifier fetched ", data.identifier);
        JBridge.showToast(window.__S.MSG_IMPORTED_SUCCESSFULLY, "short");
        if (window.__loggedInState != "GUEST" && window.__loggedInState != "YES") {
          this.showLoginOptions();
        } else {
          utils.setLoginPreferences();
          var event = { tag: "OPEN_MainActivity", contents: [] };
          window.__runDuiCallback(event);
        }
      }
    } else if (response.status == "ALREADY_EXIST") {
      console.log("content ALREADY_EXIST");
      JBridge.showToast(window.__S.MSG_ALREADY_IMPORTED, "short");
      if (window.__loggedInState != "GUEST" && window.__loggedInState != "YES") {
        this.showLoginOptions();
      } else {
        utils.setLoginPreferences();
        var event = { tag: "OPEN_MainActivity", contents: [] };
        window.__runDuiCallback(event);
      }
    }
  }

  setImportProgress = (res) => {
    console.log("import ecar progress", res);
    var cb = res[0];
    var id = res[1];
    var data = JSON.parse(res[2]);

    var progress = "(" + data.currentCount + "/" + data.totalCount + ")";
    var cmd = this.set({
      id: this.idSet.importEcarLayout,
      visibility: "visible"
    });

    cmd += this.set({
      id: this.idSet.importEcarText,
      text: progress
    });

    Android.runInUI(cmd, 0);
  }

  handleDeepLinkAction = (identifier) => {
    console.log("IDENTIFIER IN HANDLE DEEPLINK ACTION", identifier);

    var callback = callbackMapper.map(function (data) {
      var item = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("Callback data in userActivity", item);

      if (item.contentType.toLowerCase() == "course") {

        console.log("Content type is course", item.contentData);
        var whatToSend = { course: JSON.stringify(item.contentData) };
        var event = { tag: "OPEN_DeepLink_CourseInfo", contents: whatToSend }
        window.__runDuiCallback(event);

      } else if (item.mimeType.toLowerCase() == "application/vnd.ekstep.content-collection") {

        utils.clearDeeplinkPreferences();
        var itemDetails = JSON.stringify(item.contentData);
        _this.deepLinkCollectionDetails = itemDetails;

        if (window.__loggedInState == "YES") {
          console.log("Content type is collecion or TextBook", _this.deepLinkCollectionDetails);
          if (JBridge.isNetworkAvailable()) {
            var whatToSend = { "user_token": window.__userToken, "api_token": window.__apiToken }
            var event = { "tag": "API_EnrolledCourses", contents: whatToSend };
            window.__runDuiCallback(event);
          } else {
            var res = JBridge.getSavedData("savedCourse");
            if (res && res != "__failed") {
              var parsed = JSON.parse(utils.decodeBase64(res));
              window.__enrolledCourses = parsed;
            }
            var whatToSend = { course: _this.deepLinkCollectionDetails };
            var event = { tag: "OPEN_Deeplink_CourseEnrolled", contents: whatToSend }
            window.__runDuiCallback(event);
          }
        } else if (window.__loggedInState == "GUEST") {
          var whatToSend = { course: _this.deepLinkCollectionDetails };
          var event = { tag: "OPEN_Deeplink_CourseEnrolled", contents: whatToSend }
          window.__runDuiCallback(event);
        } else {
          console.log("Collection cannot open without logging in or as Guest");
        }
      } else {

        utils.clearDeeplinkPreferences();
        var resDetails = {};
        var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " [" + utils.formatBytes(item.size) + "]" : "");
        resDetails['imageUrl'] = item.hasOwnProperty("contentData") ? "file://" + item.basePath + "/" + item.contentData.appIcon : item.appIcon;
        resDetails['title'] = item.contentData.name;
        resDetails['description'] = item.description;
        resDetails['headFooterTitle'] = headFooterTitle;
        resDetails['identifier'] = item.identifier;
        resDetails['content'] = item;
        console.log("resourceDetails IN UserActivity", resDetails);
        var whatToSend = { resource: JSON.stringify(resDetails) }
        var event = { tag: "OPEN_Deeplink_ResourceDetail", contents: whatToSend }
        window.__runDuiCallback(event);
      }
    });
    //end of callback

    if (identifier != "") {
      JBridge.getContentDetails(identifier, callback, false)
    } else {
      this.performLogin();
    }
  }

  performLogin = () => {
    var body = {
      "params": {},
      "request": {}
    }
    window.__patchCallback = (data) => {
      console.log("login patch call", data);
    }
    utils.setLoginPreferences();
    JBridge.patchApi(window.__loginUrl + "/api/user/v1/update/logintime", JSON.stringify(body), window.__user_accessToken, window.__apiToken);
    var whatToSend = []
    var event = { tag: "OPEN_MainActivity", contents: whatToSend };
    window.__runDuiCallback(event);
  }

  onBackPressed = () => {
    var event = { tag: "BACK_UserActivity", contents: [] };
    window.__runDuiCallback(event);
    // this.backPressCount++;
    // if (this.backPressCount == 1) {
    //   window.__Snackbar.show(window.__S.BACK_TO_EXIT)
    // }
    // if (this.backPressCount > 1) {
    //   JBridge.closeApp();
    // }
    // setTimeout(() => {
    //   this.backPressCount = 0
    // }, 1500);
  }


  handleStateChange = (state) => {
    console.log("handleStateChange in UserActivity -> ", state);

    window.__LoaderDialog.hide();
    var res = utils.processResponse(state);
    var status = res.status;
    var response = res.data;
    var responseCode = res.code;
    var responseUrl = res.url;

    if (responseCode == 501) {
      window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION)
      return;
    }


    if (status === "failure" || status == "f") {
      if (res.err) {
        console.log("\n\nEROR  :", res.err)
        window.__Snackbar.show(res.err)
        return;
      }
      window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION)
      return;
    }

    var result = response.result;

    switch (state.responseFor + "") {
      case "API_EnrolledCourses":
        console.log("API_EnrolledCourses in userActivity")
        window.__enrolledCourses = response.result.courses;

        console.log("DEEPLINK COURSE DETAILS", this.deepLinkCollectionDetails);

        if (this.deepLinkCollectionDetails != undefined) {
          var whatToSend = { course: this.deepLinkCollectionDetails };
          var event = { tag: "OPEN_Deeplink_CourseEnrolled", contents: whatToSend }
          window.__runDuiCallback(event);
        }
        break;
      default:
        console.log("default SWITCH")
        break;
    }
  }

  handleNotificationAction = () => {
    var notifData = JBridge.getFromSharedPrefs("intentNotification");
    //Handle notification redirection only if the user is logged in, else just open HomeFragment
    if (notifData != "__failed" && window.__loggedInState == "YES") {
      utils.setLoginPreferences();
      notifData = JSON.parse(utils.decodeBase64(notifData));
      console.log("notifData ", notifData);
      switch (JBridge.getFromSharedPrefs("screenToOpen")) {
        case "ANNOUNCEMENT_DETAIL":
          var data = {
            announcementId: notifData.actiondata.announcementId,
            whereFrom: "",
            details: {}
          }
          var whatToSend = { announcementData: JSON.stringify(data) }
          var event = { tag: "OPEN_Notif_AnnouncementDetail", contents: whatToSend };
          break;
        case "ANNOUNCEMENT_LIST":
          var event = { tag: "OPEN_Notif_AnnouncementList", contents: [] };
          break;
        case "DO_NOTHING":
        default:
          var event = { tag: "OPEN_MainActivity", contents: [] };
          break;
      }
    } else {
      var event = { tag: "OPEN_MainActivity", contents: [] };
    }
    JBridge.setInSharedPrefs("intentNotification", "__failed");
    window.__runDuiCallback(event);
  }

  handleLoginClick = () => {
    console.log(window.__loginUrl, "/auth/realms/sunbird/protocol/openid-connect/auth ", "android");
    JBridge.keyCloakLogin(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/auth", "android");
  }

  handleBrowseAsGuest = () => {
    console.log("handleBrowseAsGuest");
    window.__enrolledCourses = [];
    JBridge.logGuestEvent("LOGIN");
    var event = { tag: "OPEN_RoleSelectionActivity", contents: [] };
    window.__runDuiCallback(event);
  }

  getTopLayout = () => {
    //Logo and welcome message
    return (<LinearLayout
      height="wrap_content"
      width="match_parent"
      margin="0,0,0,8"
      gravity="center"
      orientation="vertical">

      <FeatureCards
        height = "match_parent" />
    </LinearLayout>)
  }

  getOptions = () => {
    //Signin and Browse_as_guest buttons
    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        gravity="center"
        alignParentBottom = "true, -1"
        orientation="vertical"
        margin="24,0,24,0">

        <LinearLayout
          height="38"
          width="match_parent"
          onClick={this.handleLoginClick}>

          <TextView
            background={window.__Colors.THICK_BLUE}
            stroke={"5," + window.__Colors.THICK_BLUE}
            cornerRadius="5"
            height="match_parent"
            width="match_parent"
            gravity="center"
            textAllCaps="true"
            style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
            text={window.__S.SIGN_IN} />
        </LinearLayout>

        <LinearLayout
          width="match_parent"
          height="38"
          margin="0,16,0,16"
          layoutTransition="true"
          onClick={this.handleBrowseAsGuest}>

          <TextView
            width="match_parent"
            height="match_parent"
            gravity="center"
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
            text={window.__S.BROWSE_AS_GUEST}
            textAllCaps="true"
            cornerRadius="5"
            background={window.__Colors.WHITE}
            stroke={"2," + window.__Colors.THICK_BLUE} />
        </LinearLayout>
      </LinearLayout>)
  }

  getBody = () => {
    return (
      <RelativeLayout
        root="true"
        width="match_parent"
        clickable="true"
        height="match_parent">
        <LinearLayout
          root="true"
          orientation="vertical"
          width="match_parent"
          clickable="true"
          margin = "0,0,0,100"
          background={window.__Colors.WHITE}
          height="match_parent">

          <SimpleToolbar
            title=""
            width="match_parent"
            height="wrap_content"
            onBackPress={this.onBackPressed} />
          
          {this.getTopLayout()}

        </LinearLayout>
        {this.getOptions()}
      </RelativeLayout>);
  }

  clearIntentLinkPath = () => {
    JBridge.setInSharedPrefs("intentLinkPath", "__failed");
  }

  clearIntentFilePath = () => {
    JBridge.setInSharedPrefs("intentFilePath", "__failed");
  }

  performDeeplinkAction = () => {
    if ("__failed" != JBridge.getFromSharedPrefs("intentFilePath")) {
      var filePath = JBridge.getFromSharedPrefs("intentFilePath");
      JBridge.setInSharedPrefs("intentFilePath", "__failed");
      JBridge.importEcar(filePath, utils.getCallbacks("", this.setImportProgress, this.getImportStatus));
    } else if ("__failed" != JBridge.getFromSharedPrefs("intentLinkPath")) {
      console.log("INSIDE LINK INTENT");
      var output = JBridge.getFromSharedPrefs("intentLinkPath");
      console.log("FILE PATH GOT", output);
      var identifier = output.substr(output.lastIndexOf("/") + 1, output.length);
      console.log("IDENTIFIER GOT", identifier);
      _this.handleDeepLinkAction(identifier);
    }
  }

  performRedirection = () => {
    console.log("performRedirection");
    utils.setLoginPreferences();
    if (window.__loggedInState == "YES" || window.__loggedInState == "GUEST") {
      if ("__failed" != JBridge.getFromSharedPrefs("intentNotification")) {
        console.log("Assuming user has logged in, notification data: ", JBridge.getFromSharedPrefs("intentNotification"));
        this.handleNotificationAction();
      } else if (("__failed" != JBridge.getFromSharedPrefs("intentFilePath")) || ("__failed" != JBridge.getFromSharedPrefs("intentLinkPath"))) {
        this.performDeeplinkAction();
      } else {
        var event = { tag: "OPEN_MainActivity", contents: [] };
        window.__runDuiCallback(event);
      }
    } else {
      this.showLoginOptions();
    }
  }

  afterRender = () => {
    console.log("AFTER RENDER IN USER ACTIVITY");
    console.log("SHARED PREFERENCES FOR logged_in", JBridge.getFromSharedPrefs("logged_in"));
    console.log("SHARED PREFERENCES FOR link", JBridge.getFromSharedPrefs("intentLinkPath"));
    console.log("SHARED PREFERENCES FOR file", JBridge.getFromSharedPrefs("intentFilePath"));
    this.performRedirection();
  }

  showLoginOptions = () => {
    console.log("showLoginOptions");
    this.replaceChild(this.idSet.parentContainer, this.getBody().render(), 0);
  }

  render() {
    var imgUrl = "ic_launcher";
    var textToDisplay = JBridge.getAppName();//window.__S.SPLASH_MESSAGE;
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed" && JBridge.getFromSharedPrefs("logo_url") != "undefined") {
      imgUrl = JBridge.getFromSharedPrefs("logo_url");
    }
    if (JBridge.getFromSharedPrefs("orgName") != "__failed") {
      textToDisplay = JBridge.getFromSharedPrefs("orgName");
    }
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        id={this.idSet.parentContainer}
        width="match_parent"
        height="match_parent"
        orientation="vertical">

        <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical"
          gravity="center"
          weight="1">

          <ImageView
            height="250"
            width="250"
            layout_gravity="center"
            circularImageUrl={"1," + imgUrl} />

          <TextView
            text={textToDisplay}
            margin="20,120,20,20"
            layout_gravity="center"
            height="wrap_content"
            textSize="18" />
        </LinearLayout>

        <LinearLayout
          height="match_parent"
          width="match_parent"
          weight="5"
          orientation="horizontal"
          gravity="center"
          id={this.idSet.importEcarLayout}
          visibility="gone">

          <ProgressBar
            height="40"
            width="40"
            margin="0,0,15,0"
            layout_gravity="center" />

          <TextView
            id={this.idSet.importEcarText}
            height="wrap_content"
            width="wrap_content"
            layout_gravity="center" />
        </LinearLayout>
      </LinearLayout>
    );
    return this.layout.render();
  }
}


module.exports = Connector(UserActivity);
