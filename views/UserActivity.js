var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var debounce = require("debounce");
var objectAssign = require('object-assign');


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
var utils = require('../utils/GenericFunctions');

var _this;

window.R = require("ramda");

class UserActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.screenName = "UserActivity"

    this.setIds([
      "userForumContainer",
      "tabLayoutContainer",
      "firstNameHolder",
      "languageHolder",
      "alreadyHaveAccHolder",
      "userNameHolder",
      "passwordHolder",
      "needAccHolder",
      "forgotPasswordHolder",
      "signInHolder",
      "signUpHolder",
      "mobileNumberHolder",
      "emailHolder",
      "parentContainer",
      "importEcarLayout",
      "importEcarText"
    ]);
    this.backPressCount = 0;
    this.shouldCacheScreen=false;

    this.language = "English";
    this.userName = this.userPass = this.firstName = "";
    _this = this;

    this.deepLinkCollectionDetails="";


    window.__loginCallback=this.getLoginCallback;


    if(JBridge.getFromSharedPrefs("whereFromInUserActivity") != "Deeplink"){
      JBridge.setInSharedPrefs("whereFromInUserActivity", this.state.data.value0.whereFrom);
    }


    window.__onContentImportResponse = this.getImportStatus;
    window.__onContentImportProgress = this.setImportProgress;
    window.__LoaderDialog.hide();
    window.__loggedInState = JBridge.getFromSharedPrefs("logged_in")
  }

  getImportStatus = (response) => {

    console.log("response for import",response);

    if(response != "ALREADY_EXIST"){
      var jsonResponse = JSON.parse(response);
      var identifier;
      if(jsonResponse.identifier != undefined){
         identifier = jsonResponse.identifier;
         _this.handleDeepLinkAction(identifier);
      }
      else{
        JBridge.showToast(window.__S.MSG_IMPORTED_SUCCESSFULLY,"short");
        var whatToSend = []
        var event = { tag: "OPEN_MainActivity", contents: whatToSend };
        window.__runDuiCallback(event);
      }
    }else{
        JBridge.showToast(window.__S.MSG_ALREADY_IMPORTED,"short");
        console.log("Successfully IMPORTED CONTENT")
        var whatToSend = []
        var event = { tag: "OPEN_MainActivity", contents: whatToSend };
        window.__runDuiCallback(event);
    }

  }

  setImportProgress = (progress) => {
    console.log("import ecar progress", progress);
    var cmd  = this.set({
      id: this.idSet.importEcarLayout,
      visibility: "visible"
    });

    cmd += this.set({
      id: this.idSet.importEcarText,
      text : progress
    });

    Android.runInUI(cmd,0);
  }

  handleDeepLinkAction = (identifier) =>{
      console.log("IDENTIFIER IN HANDLE DEEPLINK ACTION",identifier);

    var callback = callbackMapper.map(function(data) {
        var item = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
        console.log("Callback data in userActivity",item);
        var deeplinkMode = JBridge.getFromSharedPrefs("deeplinkMode");

        if(item.contentType.toLowerCase() == "course"){
              console.log("Content type is course",item.contentData);
              console.log("DEEPLINK MODE COURSE",deeplinkMode);
              if(deeplinkMode=="preview"){
                var whatToSend={details:JSON.stringify(item)};
                var event={tag:"OPEN_DeepLink_ContentPreview",contents:whatToSend}
                window.__runDuiCallback(event);

              }else if(deeplinkMode=="actual"){
                _this.clearDeeplinkPreferences();

                var whatToSend={course:JSON.stringify(item.contentData)};
                var event={tag:"OPEN_DeepLink_CourseInfo",contents:whatToSend}
                window.__runDuiCallback(event);
              }
        }
        else if(item.mimeType.toLowerCase() == "application/vnd.ekstep.content-collection"){

              if(deeplinkMode=="preview"){
                var whatToSend={details:JSON.stringify(item)};
                var event={tag:"OPEN_DeepLink_ContentPreview",contents:whatToSend}
                window.__runDuiCallback(event);

              }else if(deeplinkMode=="actual"){
                console.log("ACTUAL MODE RESOURCE")
                _this.clearDeeplinkPreferences();

                var itemDetails = JSON.stringify(item.contentData);
                _this.deepLinkCollectionDetails = itemDetails;

                console.log("Content type is collecion or TextBook",_this.deepLinkCollectionDetails);

                // var whatToSend={course:_this.deepLinkCollectionDetails};
                // var event={tag:"OPEN_Deeplink_CourseEnrolled",contents:whatToSend}
                // window.__runDuiCallback(event);

              var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
              var event ={ "tag": "API_EnrolledCourses", contents: whatToSend};
              window.__runDuiCallback(event);
            }

        }
        else{

              console.log("DEEPLINK MODE RESOURCE",deeplinkMode);

              if(deeplinkMode=="preview"){

                console.log("PREVIEW MODE RESOURCE")

                var whatToSend={details:JSON.stringify(item)};
                var event={tag:"OPEN_DeepLink_ContentPreview",contents:whatToSend}
                window.__runDuiCallback(event);

              }else if(deeplinkMode=="actual"){


                _this.clearDeeplinkPreferences();

                console.log("ACTUAL MODE RESOURCE")

                var resDetails ={};
                var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");

                resDetails['imageUrl'] = item.hasOwnProperty("contentData") ?"file://"+item.basePath+"/"+item.contentData.appIcon : item.appIcon;
                resDetails['title'] = item.contentData.name;
                resDetails['description'] = item.description;
                resDetails['headFooterTitle'] = headFooterTitle;
                resDetails['identifier'] = item.identifier;
                resDetails['content'] = item;

                console.log("resourceDetails IN UserActivity",resDetails);

                var whatToSend = {resource:JSON.stringify(resDetails)}
                var event = {tag:"OPEN_Deeplink_ResourceDetail",contents:whatToSend}
                window.__runDuiCallback(event);


              }

        }


    });

    if(identifier!=""){
      JBridge.getContentDetails(identifier,callback)
    }else{
      // JBridge.showToast("Can't open empty content","short");
      this.performLogin();
    }
  }

  onPop = () => {
    this.backPressCount = 0;
    this.language = "English";
    this.userName = this.userPass = this.firstName = "";
    Android.runInUI(
      this.animateView(),
      null
    );

  }

  getLoginCallback = (response) => {
    console.log("GOT LOGIN RESPONSE ",response)

    window.__LoaderDialog.hide()

    if(!this.enableLoginCallback){
      return;
    }

    try{
    var arr=response.split('.');
    var contentBody=atob(arr[1]);

    contentBody=JSON.parse(contentBody);

    this.userToken=contentBody.sub;
    this.userName=contentBody.given_name;

    window.__userToken=contentBody.sub;
    window.__Snackbar.show(window.__S.WELCOME_ON_BOARD.format(JBridge.getAppName(), contentBody.given_name))
    JBridge.setProfile(this.userToken);
    this.setDataInStorage();

    // this.setLoginPreferences();


    this.performLogin();
    }catch(e){
     //console.log(e.message)
     window.__Snackbar.show(window.__S.ERROR_INVALID_EMAIL)
   }

  }

  setDataInStorage = () => {
    JBridge.setInSharedPrefs("user_id", this.userToken);
    JBridge.setInSharedPrefs("user_name", this.userName);
    JBridge.setInSharedPrefs("user_token", this.userToken);
  }

  performLogin = () => {
    var body = {
     "params": {},
     "request":{}
    }
    window.__patchCallback = (data) => {
      console.log("login patch call", data);
    }
    this.setLoginPreferences();
    JBridge.patchApi(window.__loginUrl + "/api/user/v1/update/logintime", JSON.stringify(body), window.__user_accessToken, window.__apiToken);
    var whatToSend = []
    var event = { tag: "OPEN_MainActivity", contents: whatToSend };
    window.__runDuiCallback(event);
  }

  onBackPressed = () => {
    this.backPressCount++;
    if (this.backPressCount == 1) {
      window.__Snackbar.show(window.__S.BACK_TO_EXIT)
    }
    if (this.backPressCount > 1) {
      JBridge.closeApp();
    }
    setTimeout(() => {
      this.backPressCount = 0
    }, 1500)
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


    if (status === "failure" || status=="f") {
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

        console.log("DEEPLINK COURSE DETAILS",this.deepLinkCollectionDetails);

        if(this.deepLinkCollectionDetails != undefined){
          var whatToSend={course:this.deepLinkCollectionDetails};
          var event={tag:"OPEN_Deeplink_CourseEnrolled",contents:whatToSend}
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
      this.setLoginPreferences();
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
    console.log(window.__loginUrl , "/auth/realms/sunbird/protocol/openid-connect/auth","\nandroid");
    JBridge.keyCloakLogin(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/auth","android");
  }

  handleBrowseAsGuest = () => {
    console.log("handleBrowseAsGuest");
    window.__loggedInState = "GUEST";
    window.__enrolledCourses = [];
    JBridge.setInSharedPrefs("logged_in", "GUEST");
    this.setLoginPreferences();
    this.performRedirection();
  }

  getTopLayout = () => {
    return (<LinearLayout
      height="wrap_content"
      width="match_parent"
      padding="12,20,12,20"
      gravity="center"
      orientation="vertical">

        <ImageView
        height="60"
        width="60"
        imageUrl={"ic_launcher"}/>

        <TextView
          width="match_parent"
          text={window.__S.WELCOME_M1.format(JBridge.getAppName())}
          gravity="center"
          margin="0,12,0,6"
          style={window.__TextStyle.textStyle.HEADING.DARK}/>

        <TextView
          width="match_parent"
          gravity="center"
          text={window.__S.WELCOME_M2}
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

      </LinearLayout>)
  }

  getOptions = () => {
    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        gravity="center"
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

  getBody = () =>{
    return (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        clickable="true"
        padding="0,12,0,0"
        background={window.__Colors.WHITE}
        height="match_parent">

        <LinearLayout
          height="0"
          weight="1"
          root="true"
          layoutTransition="true"
          width="match_parent"
          gravity="center"
          orientation="vertical">

          {this.getTopLayout()}
        </LinearLayout>

        {this.getOptions()}
      </LinearLayout>);
  }


  setLoginPreferences = () =>{
    if (window.__loggedInState == "GUEST") {
      JBridge.setInSharedPrefs("logged_in", "GUEST");
    } else {
      JBridge.setInSharedPrefs("logged_in", "YES");      
    }
    window.__userToken=JBridge.getFromSharedPrefs("user_token");
    window.__refreshToken = JBridge.getFromSharedPrefs("refresh_token");
    window.__user_accessToken = JBridge.getFromSharedPrefs("user_access_token");
    JBridge.setProfile(window.__userToken);
  }

  clearDeeplinkPreferences = () =>{
    this.clearIntentFilePath();
    this.clearIntentLinkPath();
    JBridge.setInSharedPrefs("deeplinkMode","__failed");
    JBridge.setInSharedPrefs("whereFromInUserActivity","__failed");
  }

  clearIntentLinkPath = () => {
    JBridge.setInSharedPrefs("intentLinkPath", "__failed");
  }

  clearIntentFilePath = () => {
    JBridge.setInSharedPrefs("intentFilePath", "__failed");
  }

  performDeeplinkAction = () =>{
    if("__failed" != JBridge.getFromSharedPrefs("intentFilePath")){
      var filePath = JBridge.getFromSharedPrefs("intentFilePath");
      JBridge.setInSharedPrefs("intentFilePath", "__failed");
      JBridge.importEcar(filePath);
    }else if("__failed" != JBridge.getFromSharedPrefs("intentLinkPath")){
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
    
    // //if there is Notification intent
    // if ("__failed" != JBridge.getFromSharedPrefs("intentNotification")) {
      
    // } else if () {
    //   //File path or Link intents
    //   console.log("SHARED PREFERENCES ARE THERE STILL");
    //   if (whereFrom == "SplashScreenActivity") {
    //     console.log("FROM SPLASH SCREEN ACTIVITY");

    //     if (("YES" == window.__loggedInState)) {
    //       console.log("LOGGED IN");
    //       JBridge.setInSharedPrefs("deeplinkMode", "actual");
    //       this.performDeeplinkAction();
    //       this.setLoginPreferences();
    //     } else {
    //       console.log("NOT LOGGED IN")
    //       JBridge.setInSharedPrefs("deeplinkMode", "preview");
    //       this.performDeeplinkAction();
    //     }

    //   } else if (whereFrom == "Deeplink") {
    //     console.log("FROM DEEPLINK ");

    //     if (("YES" == window.__loggedInState)) {
    //       console.log("LOGGED IN AND FROM DEEPLINK", "ACTUAL");
    //       JBridge.setInSharedPrefs("deeplinkMode", "actual");
    //       this.performDeeplinkAction();
    //       this.setLoginPreferences();
    //     } else {
    //       console.log("NOT LOGGED IN");
    //       this.showLoginOptions();
    //     }
    //   }
    // } else {
    //   //from normal app start
    //   if (("YES" == window.__loggedInState)) {
    //     this.performLogin();
    //   } else {
    //     this.showLoginOptions();
    //   }
    // }

    if (window.__loggedInState == "YES" || window.__loggedInState == "GUEST") {
      if ("__failed" != JBridge.getFromSharedPrefs("intentNotification")) {
        console.log("Assuming user has logged in, notification data: ", JBridge.getFromSharedPrefs("intentNotification"));
        this.handleNotificationAction();
      } else if (("__failed" != JBridge.getFromSharedPrefs("intentFilePath")) || ("__failed" != JBridge.getFromSharedPrefs("intentLinkPath"))) {
        this.performDeeplinkAction();
        if (window.__loggedInState == "YES") {
          this.setLoginPreferences();
        }
      } else {
        this.setLoginPreferences();
        var event = { tag: "OPEN_MainActivity", contents: [] };
        window.__runDuiCallback(event);
      }
    } else {
      this.showLoginOptions();
    }
  }

  afterRender = () =>{
    var whereFrom = JBridge.getFromSharedPrefs("whereFromInUserActivity");
    console.log("AFTER RENDER IN USER ACTIVITY");
    console.log("WHERE FROM IN AFTER RENDER",whereFrom)
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
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed"  && JBridge.getFromSharedPrefs("logo_url") != "undefined"){
      imgUrl = JBridge.getFromSharedPrefs("logo_url");
    }
    if (JBridge.getFromSharedPrefs("orgName") != "__failed"){
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
                circularImageUrl = {"1," + imgUrl}/>
              <TextView
                text={textToDisplay}
                margin="20,120,20,20"
                layout_gravity="center"
                height="wrap_content"
                textSize = "18"/>

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
               layout_gravity="center"
               />
               <TextView
               id={this.idSet.importEcarText}
               height="wrap_content"
               width="wrap_content"
               text="(1/2)"
               layout_gravity="center"
               />
            </LinearLayout>
      </LinearLayout>

    );

    return this.layout.render();
  }
}


module.exports = Connector(UserActivity);
