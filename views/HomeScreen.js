var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ViewPager = require("@juspay/mystique-backend").androidViews.ViewPager;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');

var BottomNavBar = require("../components/Sunbird/core/BottomNavBar")

var ResourceComponent = require("../components/Sunbird/ResourceComponent")
var HomeComponent = require('../components/Sunbird/HomeComponent');
var CommunityViewallList = require('../components/Sunbird/CommunityViewallList');
var CommunityInfoComponent = require('../components/Sunbird/CommunityInfoComponent');
var CommunityComponent = require('../components/Sunbird/CommunityComponent');
var ProfileComponent = require('../components/Sunbird/ProfileComponent');

var ContentLoadingComponent = require('../components/Sunbird/ContentLoadingComponent');
var FilterComponent = require('../components/Sunbird/FilterComponent');
var CourseComponent = require('../components/Sunbird/CourseComponent');
var FeedParams = require('../FeedParams');
var debounce = require("debounce");
var utils = require('../utils/GenericFunctions');

window.R = require("ramda");


const mockResponse = require('../mockResponse.js');

class HomeScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.handleBottomNavBarAction = debounce(this.handleBottomNavBarAction, 200);
    //TODO : REVERT THIS LOGIC

    this.setIds([
      "viewPagerContainer",
      "tabLayoutContainer",
    ]);

    window.__userToken=JBridge.getFromSharedPrefs("user_token");
    this.userToken=window.__userToken;


    this.currentPageIndex = 0;
    console.log("CURRENT INDEX", this.currentPageIndex);

    this.backPressCount = 0;

    this.feedData = FeedParams.feedParams;
    this.s = "";
    this.screenName = "HOME_SCREEN"
    this.data = ["HOME", "COURSES", "RESOURCES", "COMMUNITY", "PROFILE"];
    this.tabValues = [{
        name: "HOME",
        select: "1",
        icon: "ic_home"
      }, {
        name: "COURSES",
        select: "0",
        icon: "ic_courses"
      }, {
        name: "RESOURCES",
        select: "0",
        icon: "ic_notebook"
      }, {
        name: "GROUPS",
        select: "0",
        icon: "ic_chat"
      }, {
        name: "PROFILE",
        select: "0",
        icon: "ic_profile"
      }

    ]
  }

  onPop = () => {

    if(this.currentPageIndex==undefined){
      this.currentPageIndex=0;
    }

    Android.runInUI(
      this.animateView(),
      null
    );
    this.backPressCount = 0;

    this.setupDuiCallback();
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
    console.log("HANDLE STATE CHANGE HOME SCREEN", state)
    
    window.__LoaderDialog.hide();

    this.currentPageIndex = isNaN(this.currentPageIndex) ? 0 : this.currentPageIndex;
    var shouldBeModified = false;
    var status = state.response.status[0];
    var responseData = state.response.status[1];
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];
    var tmp = {
        params: {},
        result: {
          response: {
            sections: [],
            courses: [],

          }
        }
      }
    if ((status + "") == "failure") {
      JBridge.showSnackBar("INTERNET CONNECTION ISSUE")
      
      responseData = tmp;
    } else {

      responseData = utils.jsonifyData(responseData);
      responseData = JSON.parse(responseData);

    }

    console.log("RESPONSE :", responseData)

    if (parseInt(responseCode) != 200) {
      JBridge.showSnackBar("Connection error")
      console.log("DIDN't GOT 200")
        //return;
    }




    if (responseData.params.err) {
      console.log("EROR MESSAGE :", response.params.errmsg)
      JBridge.showSnackBar("ERROR MESSAGE ->" + response.params.errmsg)
      return;
    }


    if (state.responseFor == "GetEnrolledCourseApi") {
      //CourseInProgressContainer of CourseScreen gets upated
      console.log("GOT USER COURSES ->", responseData.result.courses)
      window.setEnrolledCourses(responseData.result.courses);
      return;
    }


    switch (this.currentPageIndex) {
      case 0:

        break;
      case 1:
        //shouldBeModified = (JBridge.getFromSharedPrefs("chooseCourse") != JSON.stringify(state.response.status[1].result.response))
        // if (shouldBeModified) {
        //   JBridge.setInSharedPrefs("chooseCourse", JSON.stringify(state.response.status[1]))
        // }
        // responseData = state.response.status[1];
        shouldBeModified = true;
        window.__runDuiCallback({ "tag": "StartCourseFlow", contents: [] });

        break;
      case 2:
        shouldBeModified = true;
        // shouldBeModified = (JBridge.getFromSharedPrefs("userResource") != JSON.stringify(state.response.status[1].result.response))
        // if (shouldBeModified) {
        //   JBridge.setInSharedPrefs("userResource", JSON.stringify(state.response.status[1].result.response))
        // }
        window.__runDuiCallback({ "tag": "StartResourceFlow", contents: [] });

        //shouldBeModified = true;
        break;
      case 3:
        //shouldBeModified = true;
        //window.__runDuiCallback({ "tag": "StartProfileFlow", contents: [] });

        break;

      case 4:
        shouldBeModified = true;
        window.__runDuiCallback({ "tag": "StartProfileFlow", contents: [] });

        break;


      default:
        console.log("[handleStateChange]\t\t MATCHED WITH default")

        break;
    }
    if (shouldBeModified) {

      console.log("[REPLACING ui at index ]\t\t", this.currentPageIndex)
      this.switchContent(this.currentPageIndex, responseData);

    } else {
      console.log("GOT SAME DATA, not modifying")
    }
  }


  switchContent = (index, data) => {
    var tmp;
    var contentLayout;
    this.color = "#123123"

    console.log("SWITCHING CONTENT OF", index)
    switch (index) {
      case 0:
        contentLayout = (
          <HomeComponent
                response = {data} 
                recommendedData={this.recommendedData}
                recommendedimageUrls={this.recommendedimageUrls}
                menuData={this.menuData}
                todoData = {this.todoData}
                feedData = {this.feedData}
                height="match_parent"
                root="true"
                width="match_parent"/>
        )


        break;
      case 1:
        contentLayout = (
          <CourseComponent
              height="match_parent"
              root="true"
              width="match_parent"
              response = {data} />
        )

        break;
      case 2:
        contentLayout = (<ResourceComponent
                  root="true"
                  response={data}
                  height="match_parent"
                  width="match_parent"/>)

        break;
      case 3:
        contentLayout = (
          <CommunityComponent
            height="match_parent"
            root="true"
            width="match_parent"
            response = {data} />
        )

        break;
      case 4:
        contentLayout = (
          <ProfileComponent
            height="match_parent"
            root="true"
            width="match_parent"
            response = {data} />
        )
        break;

      default:
        contentLayout = (<LinearLayout
                  height="match_parent"
                  root="true"
                  width="match_parent">
                    <TextView
                      text=""
                      background={this.color}
                      color="#ffffff"
                      height="match_parent"
                      width="match_parent"
                      gravity="center" />
                </LinearLayout>)

        break;
    }
    tmp = (
      <ContentLoadingComponent
              height="match_parent"
              width="match_parent"
              root="true"
              contentLayout={contentLayout}/>)


    this.replaceChild(this.idSet.viewPagerContainer, tmp.render(), 0);


  }

  afterRender = () => {
    this.currentPageIndex = 0;
    this.handleBottomNavBarAction(0);


  }

  setupDuiCallback = () => {
    window.__changePureScriptFlow();
    var eventAction;


    switch (this.currentPageIndex) {
      case 0:
        eventAction = { "tag": "ShowHome", contents: { "name": "Kiran" } };
        break;
      case 1:
        window.__LoaderDialog.show();
        eventAction = { "tag": "StartCoursePageApi", contents: {"user_token":this.userToken} };
        break;
      case 2:
        window.__LoaderDialog.show();
        eventAction = { "tag": "StartResourcePageApi", contents: {"user_token":this.userToken} };
       
        break;
      case 3:
        eventAction = { "tag": "StartCommunityFlow", contents: [] };
        break;
      case 4:
        window.__LoaderDialog.show();
        eventAction = { "tag": "StartProfileApi", contents: {"user_token":this.userToken} };
        break;
      default:
        eventAction = { "tag": "ShowHome", contents: { "name": "Kiran" } };
        break;
    }



    console.log("--------->VIEWPAGER TRIGGERS ", JSON.stringify(eventAction), "ON INDEX", this.currentPageIndex);
    window.__runDuiCallback(eventAction);
  }



  handleBottomNavBarAction = (index) => {
    if(index==undefined)
      index=0;
    this.currentPageIndex = index;
    if (index == 1) {
      if (!JBridge.isNetworkAvailable()) {
        JBridge.showSnackBar("NO INTERNET CONNECTION")
        this.handleBottomNavBarAction(2);
      }
    }
   
    console.log("\n\nSwitching B Nav Bar ")
    this.setupDuiCallback();
    window.__BottomNavBar.handleNavigationChange(index);
    this.switchContent(index)

  }


  getBottomNavBar = () => {
    this.bNavBar = (<BottomNavBar
                      tabItems = {this.tabValues}
                      defaultIndex= "3"
                      _onClick = {this.handleBottomNavBarAction} />);

    return this.bNavBar;
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
          id={this.idSet.viewPagerContainer}
          width="match_parent" />



          <LinearLayout
            background={window.__Colors.WHITE}
            width="match_parent"
            orientation="vertical"
            id={this.idSet.tabLayoutContainer}
            height="56">
              <ViewWidget
                height="2"
                alpha="0.2"
                width="match_parent"
                background={window.__Colors.DARK_GRAY} />

              {this.getBottomNavBar()}
          </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(HomeScreen);

// <HomeComponent
// response = {data} 
// recommendedData={this.recommendedData}
// recommendedimageUrls={this.recommendedimageUrls}
// menuData={this.menuData}
// todoData = {this.todoData}
// feedData = {this.feedData}
// height="match_parent"
// root="true"
// width="match_parent"/>
