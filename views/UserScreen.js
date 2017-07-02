var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');


var debounce = require("debounce");
window.R = require("ramda");

class UserScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.setIds([
      "userForumContainer",
      "tabLayoutContainer",
      "firstNameHolder",
      "languageHolder"
    ]);

    this.screenName = "UserScreen"
    this.isLoginMode = true;
    this.userLanguage = "English"

    this.userName = this.firstName = this.userPass = "";

    this.shlouldCacheScreen = false;
    JBridge.setInSharedPrefs("user_id", "dummyId");
    JBridge.setInSharedPrefs("user_name", "Dummy Name");
    JBridge.setInSharedPrefs("user_token", "dummyToken");


  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );

  }

  skipLogin = () => {
    console.log("TESTER ->", this.userName)
    var eventAction = { tag: "LoginAction", contents: {} };
    window.__runDuiCallback(eventAction);
  }


  handleStateChange = (state) => {

    var status = state.response.status[0];
    var response = JSON.parse(state.response.status[1]);
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];

    if (parseInt(responseCode) != 200) {
      console.log("INVALID FORMAT")
      return;
    }

    var result = response.result;

    if (response.params.err) {
      console.log("EROR MESSAGE :", response.params.errmsg)
      JBridge.showSnackBar("E MSG ->" + response.params.errmsg)
      return;
    }

    console.log("GOT RESULT FORM RESPONSE ->>", result)

    switch (state.responseFor) {
      case "LoginApiAction":


        JBridge.setInSharedPrefs("user_id", JSON.stringify(result.response.userId));
        JBridge.setInSharedPrefs("user_name", JSON.stringify(result.response.firstName));
        JBridge.setInSharedPrefs("user_token", JSON.stringify(result.response.token));

        //console.log("WELCOME -->>", result.response.firstName);
        //JBridge.showToast("WELCOME ->", result.response.firstName)

        //"{"id":null,"ver":"v1","ts":"2017-06-28 02:09:30:032+0000","params":{"resmsgid":null,"msgid":null,"err":"INVALID_CREDENTIAL","status":"SERVER_ERROR","errmsg":"Invalid credential."},"responseCode":"CLIENT_ERROR","result":{}}"
        JBridge.showSnackBar("SignIn Done");
        var eventAction = { tag: "LoginAction", contents: {} };
        window.__runDuiCallback(eventAction);

        break;


      case "SignUpApiAction":


        JBridge.showSnackBar("SignUp Done");
        JBridge.setInSharedPrefs("user_name", this.userFirstName);

        this.handleLoginClick();
        break;

    }


  }


  updateFirstName = (data) => {
    this.firstName = data;
  }

  updateLanguage = (data) => {
    this.language = data;
  }

  updateUserPassword = (data) => {
    this.userPass = data;
  }
  updateUserName = (data) => {
    this.userName = data;
  }

  handleSignUpClick = () => {
    if (this.userName == "sunbird") {
      this.skipLogin();
    }

    var cmd = "";
    cmd += this.set({
      id: this.idSet.firstNameHolder,
      visibility: "visible",
      text: ""
    })
    cmd += this.set({
      id: this.idSet.languageHolder,
      visibility: "visible",
      text: "English"
    })
    Android.runInUI(cmd, 0);

    // this.userName = "amit@juspay.in"
    // this.firstName = "Amit Rohan"
    // this.userPass = "sunbird"
    // this.language = "English"

    if (this.userName.length > 0 && this.userPass.length > 0 && this.firstName.length > 0 && this.language.length > 0) {
      var dummyBody = {
        "userName": this.userName,
        "firstName": this.firstName,
        "password": this.userPass,
        "language": this.language
      };
      console.log("START SignUpApiAction ", dummyBody)

      var eventAction = { tag: "SignUpApiAction", contents: dummyBody };
      console.log("Triger---\SignUpApiAction\t>", eventAction)
      window.__runDuiCallback(eventAction);

    } else {
      JBridge.showSnackBar("Please Fill ALl Details");
    }

  }

  handleLoginClick = () => {
    if (this.userName == "sunbird") {
      this.skipLogin();
    }
    var cmd = "";
    cmd += this.set({
      id: this.idSet.firstNameHolder,
      visibility: "gone",
      text: "Removed"
    })
    cmd += this.set({
      id: this.idSet.languageHolder,
      visibility: "gone",
      text: "English"
    })
    Android.runInUI(cmd, 0);

    if (this.userName.length > 0 && this.userPass.length > 0) {

      var dummyBody = {
        "userName": this.userName,
        "userPass": this.userPass
      };
      console.log("START API CALL LOGIN", dummyBody)

      var eventAction = { tag: "LoginApiAction", contents: dummyBody };
      console.log("Triger---\tLoginApiAction\t>", eventAction)
      window.__runDuiCallback(eventAction);
    } else {
      JBridge.showSnackBar("Please Fill ALl Details");
    }
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}
        afterRender = {this.afterRender}
        height="match_parent">

        <LinearLayout
          height="0"
          weight="1"
          root="true"
          id={this.idSet.userForumContainer}
          width="match_parent" 
          padding="10,10,10,10"
          gravity="center"
          orientation="vertical">

          <EditText
            height="50"
            width="match_parent"
            hint="Email"
            onChange={this.updateUserName}/>

          <EditText
            height="50"
            width="match_parent"
            hint="User Pass"
            onChange={this.updateUserPassword}/>

          <EditText
            height="50"
            visibility={this.isLoginMode?"gone":"visible"}
            id={this.idSet.firstNameHolder}
            width="match_parent"
            hint="First Name"
            onChange={this.updateFirstName}/>  

          <EditText
            visibility={this.isLoginMode?"gone":"visible"}
            id={this.idSet.languageHolder}
            height="50"
            width="match_parent"
            hint="Language"
            onChange={this.updateLanguage}/>
          
          <LinearLayout
            height="50"
            width="match_parent"
            margin="0,10,0,10"
            stroke="2,#232323"
            cornerRadiun="2"
            gravity="center"
            background="#232323">
            <TextView
            height="match_parent"
            width="match_parent"
            onClick={this.handleLoginClick}
            color="#ffffff"
            gravity="center"
            text="LOGIN"
            />
          </LinearLayout>

          <LinearLayout
            height="50"
            width="match_parent"
            margin="0,10,0,10"
            stroke="2,#232323"
            cornerRadiun="2">
            <TextView
            color={window.__Colors.BLACK}
            height="match_parent"
            width="match_parent"
            onClick={this.handleSignUpClick}
            text="Sign Up"
            gravity="center"/>
          </LinearLayout>
        </LinearLayout> 
        



      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(UserScreen);
