var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');

var TextInputView = require('../components/Sunbird/core/TextInputView');



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
      "languageHolder",
      "alreadyHaveAccHolder",
      "needAccHolder"
    ]);

    this.screenName = "UserScreen"
    this.isLoginMode = true;



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

    if (response.params.err == "INVALID_CREDENTIAL") {
      console.log("EROR MESSAGE :", response.params.errmsg)
      JBridge.showSnackbar("E MSG ->" + response.params.errmsg)
      return;
    }

    switch (state.responseFor) {
      case "LoginApiAction":
        JBridge.setInSharedPrefs("user_id", JSON.stringify(result.response.userId));
        JBridge.setInSharedPrefs("user_name", JSON.stringify(result.response.firstName));
        JBridge.setInSharedPrefs("user_token", JSON.stringify(result.response.token));
        console.log("WELCOME -->>", result.response.firstName);
        JBridge.showSnackbar("WELCOME ", result.response.firstName)

        //"{"id":null,"ver":"v1","ts":"2017-06-28 02:09:30:032+0000","params":{"resmsgid":null,"msgid":null,"err":"INVALID_CREDENTIAL","status":"SERVER_ERROR","errmsg":"Invalid credential."},"responseCode":"CLIENT_ERROR","result":{}}"
        var eventAction = { tag: "LoginAction", contents: {} };
        window.__runDuiCallback(eventAction);

        break;
      case "SignupApiAction":
        JBridge.showSnackbar("Sign Up Completed")
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

  updateFirstName = (data) => {
    this.firstName = data;
  }

  updateLanguage = (data) => {
    this.language = data;
  }

  handleAlreadyHaveAccClick = () => {
    this.isLoginMode = true;
    var cmd = this.set({
      id: this.idSet.firstNameHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.languageHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.needAccHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.alreadyHaveAccHolder,
      visibility: "gone"
    });
    Android.runInUI(cmd, 0);

  }

  handleCreateAccountClick = () => {
    this.isLoginMode = false;
    var cmd = this.set({
      id: this.idSet.firstNameHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.languageHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.needAccHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.alreadyHaveAccHolder,
      visibility: "visible"
    });
    Android.runInUI(cmd, 0);
  }

  handleLoginClick = () => {

    var dummyBody = { "userName": this.userName, "userPass": this.userPass };
    console.log("START API CALL LOGIN", dummyBody)

    var eventAction = { tag: "LoginApiAction", contents: dummyBody };
    console.log("Triger---\tLoginApiAction\t>", eventAction)
    window.__runDuiCallback(eventAction);

  }

  getTopLayout = () => {
    return (<LinearLayout
      height="0"
      weight="1"
      width="match_parent"
      padding="12,12,12,12"
      gravity="center"
      orientation="vertical">

        <ImageView
        height="125"
        width="125"
        imageUrl={"ic_launcher"}/>

        <TextView
        width="match_parent"
          text="Welcome to Sunbird"
          textSize="20"
          gravity="center"
          fontStyle= {window.__Font.fontStyle.EXTRABOLD}
          />

          <TextView
          width="match_parent"
          gravity="center"
          text="Structured education for the educators"
          textSize="18"
          /> 

      </LinearLayout>)
  }

  getOptions = () => {
    return (
      <LinearLayout
            height="wrap_content"
            width="match_parent"
            gravity="center_vertical"
            >

            <TextView
              height="wrap_content"
              width="0"
              weight="1"
              text="FORGOT PASSWORD?"
              textSize="18"
              color={window.__Colors.THICK_BLUE}/>

              <LinearLayout
                height="wrap_content"
                width="wrap_content"
                background={window.__Colors.THICK_BLUE}
                stroke={"5,"+window.__Colors.THICK_BLUE}
                cornerRadiun="5">
                  <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  padding="10,5,10,5"
                  gravity="center"
                  
                  onClick={this.handleLoginClick}>

                    <TextView
                      textSize="14"
                      color={window.__Colors.WHITE}
                      text="SIGN IN"
                      fontStyle= {window.__Font.fontStyle.EXTRABOLD}
                      />
                  </LinearLayout>
               </LinearLayout>



           </LinearLayout>)
  }


  getForum = () => {
    return (
      <ScrollView
        height="match_parent"
        width="match_parent"
        fillViewPort="true">
        <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical"
          root="true">

            <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText="sample@test.com"
                labelText="E-MAIL ID"
                padding="12,0,12,0"
                color={window.__Colors.DARK_GRAY}
                _onChange={this.updateUserPassword}/>

            <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText="Enter a 8-digit password"
                labelText="PASSWORD"
                padding="12,0,12,0"
                color={window.__Colors.DARK_GRAY}
                _onChange={this.updateUserName}/>  
            <TextInputView
              height="wrap_content"
              width="match_parent"
              hintText="Enter you'r first name"
              labelText="FIRST NAME"
              padding="12,0,12,0"
              id={this.idSet.firstName}
              visibility={this.isLoginMode?"gone":"visible"}
              color={window.__Colors.DARK_GRAY}
              _onChange={this.updateUserName}/>  

            <TextInputView
              height="wrap_content"
              width="match_parent"
              hintText="Enter preffered language"
              labelText="LANGUAGE"
              padding="12,0,12,0"
              id={this.idSet.languageHolder}
              visibility={this.isLoginMode?"gone":"visible"}
              color={window.__Colors.DARK_GRAY}
              _onChange={this.updateUserName}/>  


            {this.getOptions()}

         </LinearLayout>

       </ScrollView>)
  }


  getSignUp = () => {
    return (<LinearLayout
        height="match_parent"
        width="wrap_content"
        orientation="vertical"
        gravity="center_horizontal"
        root="true">
          <ViewWidget
            height="0"
            width="0"
            weight="1"/>

           <TextView
            height="wrap_content"
            width="wrap_content"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.alreadyHaveAccHolder}
            onClick={this.handleAlreadyHaveAccClick}
            visibility={this.isLoginMode?"gone":"visible"}
            text="Already have an Account? Sign in now"
            color={window.__Colors.THICK_BLUE}/>

          <TextView
            height="wrap_content"
            width="wrap_content"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.needAccHolder}
            onClick={this.handleCreateAccountClick}
            visibility={this.isLoginMode?"visible":"gone"}
            text="No Account yet? Sign up now"
            color={window.__Colors.THICK_BLUE}/>
          <ViewWidget
            background={window.__Colors.THICK_BLUE}
            height="2"
            width="match_parent"/>   



        </LinearLayout>)
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


         {this.getTopLayout()}

        <LinearLayout
          height="0"
          weight="1"
          root="true"
          padding="12,12,12,12"
          id={this.idSet.userForumContainer}
          width="match_parent" 
          padding="10,10,10,10"
          gravity="center"
          orientation="vertical">

         {this.getForum()}
        
        </LinearLayout>

        <LinearLayout
          height="0"
          width="match_parent"
          weight="1"
          gravity="center_horizontal"
          padding="12,12,12,12"
          orientation="vertical">


          {this.getSignUp()}
         </LinearLayout> 



      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(UserScreen);
