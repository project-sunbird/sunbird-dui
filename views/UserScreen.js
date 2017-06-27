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

    JBridge.setInSharedPrefs("chooseCourse", "__failed");
    JBridge.setInSharedPrefs("userResource", "__failed");

    this.setIds([
      "userForumContainer",
      "tabLayoutContainer",
    ]);

    this.screenName = "UserScreen"

  }


  handleCourseInfoClick = (data) => {
    this.state = R.merge(this.state, { event: 'showCourseInfo' })
    window.__runDuiCallback({ action: "showCourseInfo" });
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
    this.setupDuiCallback();
  }


  handleStateChange = (state) => {
    console.log("NEW DATA--->", state)
    switch (state.responseFor) {
      case "LoginApiAction":
        var dummtData = {
          "userId": this.userName,
        }
        console.log("START LOGIN", state)

        // var eventAction = { tag: "LoginAction", contents: dummtData };
        // window.__runDuiCallback(eventAction);

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
    var dummtData = { "userName": this.userName, "userPass": this.userPass };
    console.log("START API CALL LOGIN", dummtData)

    var eventAction = { tag: 'LoginApiAction', contents: dummtData };
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
