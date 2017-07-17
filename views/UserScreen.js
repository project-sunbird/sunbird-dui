var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
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
      "userNameHolder",
      "passwordHolder",
      "needAccHolder",
      "forgotPasswordHolder",
      "signInHolder",
      "signUpHolder",
      "mobileNumberHolder",
      "emailHolder",

    ]);
    this.backPressCount = 0;
    this.screenName = "UserScreen"
    this.isLoginMode = true;
    this.language = "English";
    this.userName = this.userPass = this.firstName = ""

    window.__loginCallback=this.getLoginCallback;


  }

  onPop = () => {
    this.backPressCount = 0;
    Android.runInUI(
      this.animateView(),
      null
    );

  }

  getLoginCallback = (response) => {
    window.__LoaderDialog.hide()
    try{
    var arr=response.split('.');
    var contentBody=atob(arr[1]);
    
    contentBody=JSON.parse(contentBody);

    console.log("USER TOKEN  ->",contentBody.sub)
    JBridge.setInSharedPrefs("user_id", contentBody.sub);
    JBridge.setInSharedPrefs("user_name", contentBody.given_name);
    JBridge.setInSharedPrefs("user_token", contentBody.sub);
    window.__userToken=contentBody.sub;    
    JBridge.showSnackBar("Welcome Back "+ contentBody.given_name)

    var eventAction = { tag: "LoginAction", contents: {} };
    window.__runDuiCallback(eventAction);
    }catch(e){
     console.log(e.message)
     JBridge.showSnackBar("Invalid credential")
   }





  }


  onBackPressed = () => {
    this.backPressCount++;
    if (this.backPressCount == 1) {
      JBridge.showSnackBar("Press back again to exit app")
    }
    if (this.backPressCount > 1) {
      JBridge.closeApp();
    }
    console.log("BACK COUNT ", this.backPressCount)
    setTimeout(() => {
      console.log("RESET BACK COUNT ", this.backPressCount)
      this.backPressCount = 0
    }, 1500)
  }


  handleStateChange = (state) => {
    window.__LoaderDialog.hide();
    var status = state.response.status[0];
    var response = JSON.parse(state.response.status[1]);
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];
    if (status === "failure" || status=="f") {
      JBridge.showSnackBar("INTERNET CONNECTION ISSUE")
      return;
    }
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
      JBridge.showSnackBar("E MSG ->" + response.params.errmsg)
      return;
    }

    console.log("BEFOR SWITCH", state.responseFor)
    switch (state.responseFor + "") {
      case "SignUpApiAction":
        console.log("--->", result.response)
        console.log("--->", result.userId)
        if (result.response == "SUCCESS") {
          JBridge.showSnackBar("Welcome On Board "+this.userName)
          JBridge.setInSharedPrefs("user_name", this.userFirstName);
          JBridge.setInSharedPrefs("user_token", result.userId);
          window.__userToken=result.userId;
          var eventAction = { tag: "LoginAction", contents: {} };
          window.__runDuiCallback(eventAction);
        } else {
          JBridge.showSnackBar("Please retry")
        }


        break;
      default:
        console.log("default SWITCH")
        break;


    }

    console.log("AFTER SWITCH")


  }


  updateFirstName = (data) => {
    this.firstName = data;
    console.log("--->", data);
  }

  updateLanguage = (data) => {
    this.language = data;
    console.log("--->", data);
  }

  updateMobileNumber = (data) => {
    this.mobileNumber = data;
    console.log("--->", data);
  }

  updateEmail = (data) => {
    this.email = data;
    console.log("--->", data);
  }

  updateUserPassword = (data) => {
    this.userPass = data;
    console.log("--->", data);
  }
  updateUserName = (data) => {
    this.userName = data;
    console.log("USER NAME :", this.userName);
  }

  updateLanguage = (data) => {
    this.language = data;
    console.log("--->", data);
  }

  handleAlreadyHaveAccClick = () => {
    console.log("handleAlreadyHaveAccClick");
    this.isLoginMode = true;
    var cmd = this.set({
      id: this.idSet.firstNameHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.emailHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.mobileNumberHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.languageHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.forgotPasswordHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.signUpHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.signInHolder,
      visibility: "visible"
    });
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
    console.log("handleCreateAccountClick");
    this.isLoginMode = false;
    var cmd = this.set({
      id: this.idSet.firstNameHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.emailHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.mobileNumberHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.languageHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.forgotPasswordHolder,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.signUpHolder,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.signInHolder,
      visibility: "gone"
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

  handleSignUpClick = () => {
     if (!JBridge.isNetworkAvailable()) {
        JBridge.showSnackBar("NO INTERNET CONNECTION")
        return;
      }

    if (this.firstName.length <= 0) {
      JBridge.showSnackBar("Firsr Name can't be empty");
      return;
    } else if (this.userName.length <= 0) {
      JBridge.showSnackBar("User Name can't be empty");
      return;
    } else if (this.email.length <= 0) {
      JBridge.showSnackBar("Email can't be empty");
      return;
    } else if (this.userPass.length <= 0) {
      JBridge.showSnackBar("Password can't be empty");
      return;
    } else if (this.userPass.length < 8) {
      JBridge.showSnackBar("Short password");
      return;
    } else if (this.mobileNumber.length <= 0) {
      JBridge.showSnackBar("Mobile Number can't be empty");
      return;
    } else if (this.mobileNumber.length < 10) {
      JBridge.showSnackBar("Mobile number should contain 10 digits");
      return;
    } else if (this.language.length <= 0) {
      JBridge.showSnackBar("Language can't be empty");
      return;
    }

    if (this.userName.length > 0 && this.userPass.length > 0 && this.firstName.length > 0 && this.language.length > 0 && this.email.length > 0 && this.mobileNumber.length > 0) {
      var dummyBody = {
        "userName": this.userName,
        "firstName": this.firstName,
        "password": this.userPass,
        "language": this.language,
        "mobileNumber": this.mobileNumber,
        "email": this.email
      };
      console.log("START SignUpApiAction ", dummyBody)
      window.__LoaderDialog.show()
      var eventAction = { tag: "SignUpApiAction", contents: dummyBody };
      console.log("Triger---\SignUpApiAction\t>", eventAction)
      window.__runDuiCallback(eventAction);

    } else {
      JBridge.showSnackBar("Please Fill ALl Details");
    }

  }

  handleLoginClick = () => {
    if (!JBridge.isNetworkAvailable()) {
        JBridge.showSnackBar("NO INTERNET CONNECTION")
        return;
      }
    if (this.userName.length <= 0) {
      JBridge.showSnackBar("User Name can't be empty");
      return;
    } else if (this.userPass.length <= 0) {
      JBridge.showSnackBar("Password can't be empty");
      return;
    }
    window.__LoaderDialog.show()
    JBridge.keyCloakLogin("android","sunbird",this.userName,this.userPass);
  

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
          text="Welcome to Sunbird"
          gravity="center"
          margin="0,12,0,6"
          style={window.__TextStyle.textStyle.HEADING.DARK}/>

        <TextView
          width="match_parent"
          gravity="center"
          text="Structured education for the educators"
          style={window.__TextStyle.textStyle.HINT.REGULAR}/> 

      </LinearLayout>)
  }

  getOptions = () => {
    return (
      <LinearLayout
            height="wrap_content"
            width="match_parent"
            gravity="center_vertical"
            margin="24,0,24,0"
            >
            <LinearLayout
              height="wrap_content"
              width="0"
              weight="1">
                <TextView
                  height="wrap_content"
                  width="0"
                  weight="1"
                  text="FORGOT PASSWORD?"
                  id={this.idSet.forgotPasswordHolder}
                  style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>
            </LinearLayout>  
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
                      text="SIGN IN"/>
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
                      text="SIGN UP"
                      style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
                  </LinearLayout>

               </LinearLayout>



           </LinearLayout>)
  }


  getForum = () => {
    //TextInputView be carefull with the margin, internal EditText position might break

    return (
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
          layoutTransition="true"
          padding="0,40,0,50"
          gravity="center"
          root="true">

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.firstNameHolder}
              visibility={this.isLoginMode?"gone":"visible"}>

                <TextInputView
                  height="wrap_content"
                  width="match_parent"
                  hintText="Enter you'r first name"
                  labelText="FIRST NAME"
                  margin="20,0,24,12"
                  _onChange={this.updateFirstName}/>  
            
            </LinearLayout> 

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.emailHolder}
              visibility={this.isLoginMode?"gone":"visible"}>

              <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText="sample@test.com"
                labelText="E-MAIL ID"
                margin="20,0,24,12"
                _onChange={this.updateEmail}/>  
           
            </LinearLayout>  

            <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText="Enter user name"
                labelText="User Name"
                margin="20,0,24,12"
                _onChange={this.updateUserName}/>

            <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText="Enter a 8-digit password"
                labelText="PASSWORD"
                inputType="password"
                margin="20,0,24,12"
                _onChange={this.updateUserPassword}/>  
            
            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.mobileNumberHolder}
              visibility={this.isLoginMode?"gone":"visible"}>

              <TextInputView
                hintText="Enter mobile number"
                labelText="Mobile Number"
                margin="20,0,24,12"
                _onChange={this.updateMobileNumber}/>  
           
            </LinearLayout> 
            
            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.languageHolder}
              visibility={this.isLoginMode?"gone":"visible"}>

              <TextInputView
                hintText="Enter preffered language"
                labelText="LANGUAGE"
                margin="20,0,24,12"
                text="English"
                _onChange={this.updateLanguage}/>  
           
            </LinearLayout>

            {this.getOptions()}

         </LinearLayout>

       </ScrollView>)
  }


  getSignUpSection = () => {
    return (<LinearLayout
        height="wrap_content"
        width="wrap_content"
        orientation="vertical"
        gravity="center_horizontal"
        root="true">
           <TextView
            height="wrap_content"
            width="wrap_content"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.alreadyHaveAccHolder}
            onClick={this.handleAlreadyHaveAccClick}
            visibility={this.isLoginMode?"gone":"visible"}
            textFromHtml= {"<font color='#007AFF'><a href=''>"+"Already have an Account? Sign in now"+"</a></font>"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

          <TextView
            height="wrap_content"
            width="wrap_content"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.needAccHolder}
            onClick={this.handleCreateAccountClick}
            visibility={this.isLoginMode?"visible":"gone"}
            textFromHtml= {"<font color='#007AFF'><a href=''>"+"No Account yet? Sign up now"+"</a></font>"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>
         
        </LinearLayout>)
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        padding="0,12,0,0"
        background={window.__Colors.WHITE}
        afterRender = {this.afterRender}
        height="match_parent">


         {this.getTopLayout()}

        <LinearLayout
          height="0"
          weight="1"
          root="true"
          id={this.idSet.userForumContainer}
          width="match_parent" 
          gravity="center"
          orientation="vertical">

         {this.getForum()}
        
        </LinearLayout>

        <LinearLayout
          height="wrap_content"
          width="match_parent"
          gravity="center_horizontal"
          padding="12,12,12,12"
          orientation="vertical">


          {this.getSignUpSection()}
         </LinearLayout> 



      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(UserScreen);
