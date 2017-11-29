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
      "parentContainer"

    ]);
    this.backPressCount = 0;
    this.shouldCacheScreen=false;

    this.isLoginMode = true;
    this.language = "English";
    this.userName = this.userPass = this.firstName = "";
    _this = this;

    this.deepLinkCollectionDetails="";


    window.__loginCallback=this.getLoginCallback;


    if(JBridge.getFromSharedPrefs("whereFromInUserActivity") != "Deeplink"){
      JBridge.setInSharedPrefs("whereFromInUserActivity", this.state.data.value0.whereFrom);
    }


    window.__onContentImportResponse = this.getImportStatus;
    window.__LoaderDialog.hide();
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
    }else{
        JBridge.showToast(window.__S.MSG_ALREADY_IMPORTED,"short");
        console.log("Successfully IMPORTED CONTENT")
        var whatToSend = []
        var event = { tag: "OPEN_MainActivity", contents: whatToSend };
        window.__runDuiCallback(event);
    }

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
     "params": { },
        "request":{
                "userId":window.__userToken
        }
    }
    window.__patchCallback = (data) => {
      console.log("login patch call", data);
    }
    JBridge.patchApi(window.__loginUrl + "/api/user/v1/update/logintime", JSON.stringify(body), window.__user_accessToken, window.__apiToken);
    this.setLoginPreferences();
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
    window.__LoaderDialog.hide();
    var res = utils.processResponse(state);
    var status = res.status;
    var response = res.data;
    var responseCode = res.code;
    var responseUrl = res.url;

    //
    // if(responseCode == 401){
    //   var callback  = callbackMapper.map(function(token){
    //     window.__apiToken = token;
    //     if(state.responseFor == "API_SignUp"){
    //       _this.handleSignUpClick();
    //     }
    //
    //   });
    //   JBridge.getApiToken(callback);
    //   return;
    //     }


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
      case "API_SignUp":
        if (result.response == "SUCCESS") {
          console.log(window.__S.WELCOME_ON_BOARD.format(JBridge.getAppName(), this.userName))
          window.__Snackbar.show(window.__S.WELCOME_ON_BOARD.format(JBridge.getAppName(), this.userName))
          JBridge.setInSharedPrefs("user_name", this.firstName);
          JBridge.setInSharedPrefs("user_token", result.userId);
          JBridge.logSignUpSuccess();
          window.__pressedLoggedOut=true;
          this.userToken=result.userId;
          this.setDataInStorage();
          JBridge.setProfile(this.userToken);
          this.performLogin()



        } else {
          window.__Snackbar.show(window.__S.RETRY_ACTION)
        }


        break;
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


  updateFirstName = (data) => {
    this.firstName = data;
  }

  updateLanguage = (data) => {
    this.language = data;
  }

  updateMobileNumber = (data) => {
    this.mobileNumber = data;
  }

  updateEmail = (data) => {
    this.email = data;
  }

  updateUserPassword = (data) => {
    this.userPass = data;
  }
  updateUserName = (data) => {
    this.userName = data;
  }

  updateLanguage = (data) => {
    this.language = data;
  }

  toggleSignUpForm = () => {
    this.isLoginMode = !this.isLoginMode;
    var visibilityVal= this.isLoginMode?"gone":"visible"
    var oppVisibilityValue = !this.isLoginMode?"gone":"visible"
    var cmd = this.set({
      id: this.idSet.userForumContainer,
      visibility: visibilityVal
    });

    cmd += this.set({
      id: this.idSet.signUpHolder,
      visibility: visibilityVal
    });
    cmd += this.set({
      id: this.idSet.signInHolder,
      visibility: oppVisibilityValue
    });
    cmd += this.set({
      id: this.idSet.needAccHolder,
      visibility: oppVisibilityValue
    });
    cmd += this.set({
      id: this.idSet.alreadyHaveAccHolder,
      visibility: visibilityVal
    });
    Android.runInUI(cmd, 0);

  }

  handleNotificationAction = () => {
    var notifData = JBridge.getFromSharedPrefs("intentNotification");
    if (notifData != "__failed") {
      notifData = JSON.parse(utils.decodeBase64(notifData));
      console.log("notifData ", notifData);
      JBridge.setInSharedPrefs("intentNotification", "__failed");
      switch (JBridge.getFromSharedPrefs("screenToOpen")) {
        case "ANNOUNCEMENT_DETAIL":
          var data = {
            announcementID: notifData.actiondata.announcementId
          }
          var whatToSend = { announcementID: JSON.stringify(data) }
          var event = { tag: "OPEN_Notif_AnnouncementDetail", contents: whatToSend };
          break;
        case "ANNOUNCEMENT_LIST":
          var event = { tag: "OPEN_Notif_AnnouncementList", contents: [] };
          break;
        case "DO_NOTHING":
        default:
          var whatToSend = []
          var event = { tag: "OPEN_MainActivity", contents: whatToSend };
          break;
      }
    } else {
      var event = { tag: "OPEN_MainActivity", contents: [] };
    }
    window.__runDuiCallback(event);
  }

  handleSignUpClick = () => {
     if (!JBridge.isNetworkAvailable()) {
        window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
        return;
      }
    JBridge.logSignUpInitiation();
    this.firstName=this.firstName.trim();
    this.userName=this.userName.trim();
    this.email=this.email.trim();
    this.userPass=this.userPass.trim();
    this.userPass=this.userPass.trim();
    this.mobileNumber=this.mobileNumber.trim();


    if (this.firstName.length <= 0 && this.userName.length <= 0 && this.email.length <= 0 && this.userPass.length <= 0 && this.mobileNumber.length <= 0){
      window.__Snackbar.show(window.__S.ERROR_EMPTY_FIELDS);
      return;
    } else if (this.firstName.length <= 0) {
      window.__Snackbar.show(window.__S.ERROR_EMPTY_FIRSTNAME);
      return;
    }  else if (this.userName.length <= 0) {
      window.__Snackbar.show(window.__S.ERROR_EMPTY_USERNAME);
      return;
    } else if (this.email.length <= 0) {
      window.__Snackbar.show(window.__S.ERROR_EMPTY_EMAIL);
      return;
    } else if (!(this.email.indexOf("@") !== -1) || !(this.email.indexOf(".") !== -1)) {
      window.__Snackbar.show(window.__S.ERROR_EMAIL_FORMAT);
      return;
    }else if (this.userPass.length <= 0) {
      window.__Snackbar.show(window.__S.ERROR_EMPTY_PASSWORD);
      return;
    } else if (this.userPass.length < 8) {
      window.__Snackbar.show(window.__S.ERROR_SHORT_PASSWORD);
      return;
    } else if (this.mobileNumber.length <= 0) {
      window.__Snackbar.show(window.__S.ERROR_EMPTY_MOBILE);
      return;
    } else if (this.mobileNumber.length < 10 || this.mobileNumber.length > 10) {
      window.__Snackbar.show(window.__S.ERROR_SHORT_MOBILE);
      return;
    } else if (this.language.length <= 0) {
      window.__Snackbar.show(window.__S.ERROR_EMPTY_LANGUAGE);
      return;
    }

    if (this.userName.length > 0 && this.userPass.length > 0 && this.firstName.length > 0 && this.language.length > 0 && this.email.length > 0 && this.mobileNumber.length > 0) {
      window.__LoaderDialog.show()
      var requestBody = {
        "userName": this.userName,
        "firstName": this.firstName,
        "password": this.userPass,
        "language": ["English"],
        "phone": this.mobileNumber,
        "email": this.email

      };
      requestBody=JSON.stringify(requestBody);
      var whatToSend = {
        "request" : requestBody,
        "api_token": window.__apiToken
      }
      var event = { "tag": "API_SignUp", "contents": whatToSend };
      window.__runDuiCallback(event);

    } else {
      window.__Snackbar.show(window.__S.ERROR_INPUT_FORM);
    }

  }

  handleLoginClick = () => {

    console.log(window.__loginUrl , "/auth/realms/sunbird/protocol/openid-connect/auth","\nandroid");

    JBridge.keyCloakLogin(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/auth","android");
   }

  handleForgotPasscode = ()=>{
      window.__Snackbar.show(window.__S.COMING_SOON);
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
            margin="24,0,24,0"
            >


              <LinearLayout
                height="wrap_content"
                width="wrap_content"
                background={window.__Colors.THICK_BLUE}
                stroke={"5,"+window.__Colors.THICK_BLUE}
                cornerRadius="5">
                  <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  padding="15,8,15,8"
                  gravity="center"
                  id={this.idSet.signInHolder}
                  visibility={this.isLoginMode?"visible":"gone"}
                  onClick={this.handleLoginClick}>

                    <TextView
                      style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                      text={window.__S.SIGN_IN}/>
                  </LinearLayout>
                  <LinearLayout
                      height="match_parent"
                      width="match_parent"
                      padding="15,8,15,8"
                      gravity="center"
                      id={this.idSet.signUpHolder}
                      visibility={this.isLoginMode?"gone":"visible"}
                      onClick={this.handleSignUpClick}>

                    <TextView
                      text={window.__S.SIGN_UP}
                      style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
                  </LinearLayout>

               </LinearLayout>



           </LinearLayout>)
  }


  getForum = () => {
    //TextInputView be carefull with the margin, internal EditText position might break

    return (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical"
          id={this.idSet.userForumContainer}
          gravity="center"
          visibility={this.isLoginMode?"gone":"visible"}
          root="true">
      <ScrollView
        height="match_parent"
        width="match_parent"
        fillViewPort="true"

        gravity="center"
        >
        <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical"
          padding="0,40,0,50"
          gravity="center"
          root="true">

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.firstNameHolder}>

                <TextInputView
                  height="wrap_content"
                  width="match_parent"
                  hintText={window.__S.FIRST_NAME_HINT}
                  labelText={window.__S.FIRST_NAME}
                  margin="20,0,24,12"
                  _onChange={this.updateFirstName}/>

            </LinearLayout>

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.userNameHolder}>

              <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText={window.__S.HINT_USER_NAME}
                labelText={window.__S.USER_NAME}
                margin="20,0,24,12"
                _onChange={this.updateUserName}/>

            </LinearLayout>

             <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.emailHolder}
              >


                <TextInputView
                  height="wrap_content"
                  width="match_parent"
                  hintText={window.__S.HINT_EMAIL_ID}
                  labelText={window.__S.EMAIL_ID}
                  margin="20,0,24,12"
                  _onChange={this.updateEmail}/>

            </LinearLayout>

             <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.passwordHolder}>


                <TextInputView
                    height="wrap_content"
                    width="match_parent"
                    hintText={window.__S.HINT_PASSWORD}
                    labelText={window.__S.PASSWORD}
                    inputType="password"
                    margin="20,0,24,12"
                    _onChange={this.updateUserPassword}/>

              </LinearLayout>

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.mobileNumberHolder}>

              <TextInputView
                hintText={window.__S.HINT_MOBILE_NUMBER}
                labelText={window.__S.MOBILE_NUMBER}
                margin="20,0,24,12"
                inputType="numeric"
                _onChange={this.updateMobileNumber}/>

            </LinearLayout>

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.languageHolder}>

            </LinearLayout>



         </LinearLayout>

       </ScrollView>
       </LinearLayout>)
  }


  getSignUpSection = () => {
    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        clickable="true"
        gravity="center_horizontal"
        root="true">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.alreadyHaveAccHolder}
            onClick={this.toggleSignUpForm}
            visibility={this.isLoginMode?"gone":"visible"}
            textFromHtml= {"<font color='#007AFF'><a href=''>"+window.__S.ALREADY_HAVE_ACC+"</a></font>"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

          <TextView
            height="wrap_content"
            width="match_parent"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.needAccHolder}
            onClick={this.toggleSignUpForm}
            visibility={JBridge.getApplicationId() == "org.sunbird.app" ? "visible" : "gone"}
            textFromHtml= {"<font color='#007AFF'><a href=''>"+window.__S.NO_ACC_YET+"</a></font>"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

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



         {this.getForum()}


        </LinearLayout>

        {this.getOptions()}

        <LinearLayout
          height="wrap_content"
          width="match_parent"
          gravity="center_horizontal"
          padding="12,12,12,12"
          orientation="vertical">


          {/*this.getSignUpSection()*/}
         </LinearLayout>



      </LinearLayout>);
  }


  setLoginPreferences = () =>{
    JBridge.setInSharedPrefs("logged_in","YES");
    window.__userToken=JBridge.getFromSharedPrefs("user_token");
    window.__refreshToken = JBridge.getFromSharedPrefs("refresh_token");
    window.__user_accessToken = JBridge.getFromSharedPrefs("user_access_token");
    JBridge.setProfile(window.__userToken);
    JBridge.registerFCM();
  }

  clearDeeplinkPreferences = () =>{
    JBridge.setInSharedPrefs("intentLinkPath", "__failed");
    JBridge.setInSharedPrefs("intentFilePath", "__failed");
    JBridge.setInSharedPrefs("deeplinkMode","__failed");
    JBridge.setInSharedPrefs("whereFromInUserActivity","__failed");
  }

  performDeeplinkAction = () =>{
    if("__failed" != JBridge.getFromSharedPrefs("intentFilePath")){

                console.log("INSIDE FILE PATH INTENT");

                var filePath = JBridge.getFromSharedPrefs("intentFilePath");
                JBridge.importEcar(filePath);


    }else if("__failed" != JBridge.getFromSharedPrefs("intentLinkPath")){

                console.log("INSIDE LINK INTENT");

                var output = JBridge.getFromSharedPrefs("intentLinkPath");

                console.log("FILE PATH GOT",output);

                var identifier = output.substr(output.lastIndexOf("/")+1,output.length);
                console.log("IDENTIFIER GOT",identifier);
                _this.handleDeepLinkAction(identifier);

    }
  }




  afterRender = () =>{

    console.log("AFTER RENDER IN USER ACTIVITY");

    var whereFrom = JBridge.getFromSharedPrefs("whereFromInUserActivity");
    console.log("WHERE FROM IN AFTER RENDER",whereFrom)

    console.log("SHARED PREFERENCES FOR link",JBridge.getFromSharedPrefs("intentLinkPath"));
    console.log("SHARED PREFERENCES FOR file",JBridge.getFromSharedPrefs("intentFilePath"));

    if ("__failed" != JBridge.getFromSharedPrefs("intentNotification")){
      console.log("Assuming user has logged in, notification data: ", JBridge.getFromSharedPrefs("intentNotification"));
      this.handleNotificationAction();
    } else
//from link
      if(("__failed" != JBridge.getFromSharedPrefs("intentFilePath"))||("__failed" != JBridge.getFromSharedPrefs("intentLinkPath"))){

        console.log("SHARED PREFERENCES ARE THERE STILL");
        if(whereFrom == "SplashScreenActivity"){

          console.log("FROM SPLASH SCREEN ACTIVITY");

          if(("YES"==JBridge.getFromSharedPrefs("logged_in"))){

            console.log("LOGGED IN");
            JBridge.setInSharedPrefs("deeplinkMode", "actual");
            this.performDeeplinkAction();
            this.setLoginPreferences();

          }else{

            console.log("NOT LOGGED IN")
            JBridge.setInSharedPrefs("deeplinkMode", "preview");
            this.performDeeplinkAction();
          }

        }else if(whereFrom == "Deeplink") {

          console.log("FROM DEEPLINK ");

          if(("YES"==JBridge.getFromSharedPrefs("logged_in"))){
            console.log("LOGGED IN AND FROM DEEPLINK","ACTUAL");

            JBridge.setInSharedPrefs("deeplinkMode", "actual");
            this.performDeeplinkAction();
            this.setLoginPreferences();
          }else{

            console.log("NOT LOGGED IN");
            this.replaceChild(this.idSet.parentContainer,this.getBody().render(),0);
          }
        }

  //from app
      }else{

          if(("YES"==JBridge.getFromSharedPrefs("logged_in"))){
              this.performLogin();
          }else{
              this.replaceChild(this.idSet.parentContainer,this.getBody().render(),0);
          }

      }
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
        height="match_parent">
          <LinearLayout
            height="match_parent"
            width="match_parent"
            gravity="center"
            orientation="vertical">
              <ImageView
                height="250"
                width="250"
                layout_gravity="center"
                circularImageUrl = {"1," + imgUrl}/>
              <TextView
                text={textToDisplay}
                margin="20,120,20,20"
                layout_gravity="center"
                height="wrap_content"/>

           </LinearLayout>
      </LinearLayout>

    );

    return this.layout.render();
  }
}

              // <TextInputView
              //   hintText={window.__S.HINT_LANGUAGE}
              //   labelText={window.__S.LANGUAGE}
              //   margin="20,0,24,12"
              //   text="English"
              //   _onChange={this.updateLanguage}/>


module.exports = Connector(UserActivity);
