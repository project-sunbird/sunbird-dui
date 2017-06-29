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
    ]);

    this.screenName = "UserScreen"

  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
    this.setupDuiCallback();
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

    console.log("GOT RESULT FORM RESPONSE ->>", result)

    switch (state.responseFor) {
      case "LoginApiAction":

        if (response.params.err == "INVALID_CREDENTIAL") {
          console.log("EROR MESSAGE :", response.params.errmsg)
            //JBridge.showToast("E MSG ->", response.params.errmsg)
          return;
        }
        // JBridge.setInSharedPrefs("user_id", JSON.stringify(result.response.userId));
        // JBridge.setInSharedPrefs("user_name", JSON.stringify(result.response.firstName));
        // JBridge.setInSharedPrefs("user_token", JSON.stringify(result.response.token));

        console.log("WELCOME -->>", result.response.firstName);
        //JBridge.showToast("WELCOME ->", result.response.firstName)

        //"{"id":null,"ver":"v1","ts":"2017-06-28 02:09:30:032+0000","params":{"resmsgid":null,"msgid":null,"err":"INVALID_CREDENTIAL","status":"SERVER_ERROR","errmsg":"Invalid credential."},"responseCode":"CLIENT_ERROR","result":{}}"
        var eventAction = { tag: "LoginAction", contents: {} };
        window.__runDuiCallback(eventAction);

        break;


    }


  }




  updateUserPassword = (data) => {
    this.userPass = data;
  }
  updateUserName = (data) => {
    this.userName = data;
  }

  handleLoginClick = () => {

    this.userName = "test@test.com";
    this.userPass = "test"
    var dummtData = { "userName": this.userName, "userPass": this.userPass };
    console.log("START API CALL LOGIN", dummtData)

    var eventAction = { tag: "LoginApiAction", contents: { "userName": "test@test.com", "userPass": "test" } };
    console.log("Triger---\tLoginApiAction\t>", eventAction)
    window.__runDuiCallback(eventAction);
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
          gravity="center"
          orientation="vertical">

          <EditText
            height="50"
            width="match_parent"
            hint="User Name"
            onChange={this.updateUserName}/>

          <EditText
            height="50"
            width="match_parent"
            hint="User Pass"
            onChange={this.updateUserPassword}/>


          <LinearLayout
            height="50"
            width="match_parent"
            margin="10,10,10,10"
            onClick={this.handleLoginClick}
            >

            <LinearLayout
            height="50"
            width="match_parent"
            margin="10,10,10,10"
            stroke="2,#232323"
            cornerRadiun="2"
            gravity="center"
            background="#232323"
            >
            <TextView
              color="#ffffff"
              text="LOGIN"
              />
            </LinearLayout>
           </LinearLayout> 
        
        </LinearLayout>


      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(UserScreen);
