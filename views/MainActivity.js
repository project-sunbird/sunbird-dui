var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ViewPager = require("@juspay/mystique-backend").androidViews.ViewPager;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var BottomNavBar = require("../components/Sunbird/core/BottomNavBar")
var HomeFragment = require('./Fragments/HomeFragment');
var CourseFragment = require('./Fragments/CourseFragment');
var ResourceFragment = require("./Fragments/ResourceFragment")
var CommunityFragment = require('./Fragments/CommunityFragment');
var ProfileFragment = require('./Fragments/ProfileFragment');
var ContentLoadingComponent = require('../components/Sunbird/ContentLoadingComponent');
var FeedParams = require('../FeedParams');
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');
var debounce = require("debounce");
var utils = require('../utils/GenericFunctions');

window.R = require("ramda");

const mockResponse = require('../mockResponse.js');

class MainActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    //Assigning feedback duration of BottomNavbar
    this.handleBottomNavBarAction = debounce(this.handleBottomNavBarAction, 50);
    //TODO : REVERT THIS LOGIC

    this.setIds([
      "viewPagerContainer",
      "tabLayoutContainer",
    ]);

    //CurrentIndexOfViewPager
    this.currentPageIndex = 0;
    console.log("CURRENT INDEX", this.currentPageIndex);

    //BackPressCount of MainActivity
    this.backPressCount = 0;

    //needed for FeedData for HomeFragment
    this.feedData = FeedParams.feedParams;

    this.deipalayName = "MainActivity"

    this.tabValues = [{
        name: window.__S.HOME_BNAV,
        select: "1",
        icon: "ic_home"
      }, {
        name: window.__S.COURSES_BNAV,
        select: "0",
        icon: "ic_courses"
      }, {
        name: window.__S.RESOURCES_BNAV,
        select: "0",
        icon: "ic_notebook"
      }, {
        name: window.__S.GROUPS_BNAV,
        select: "0",
        icon: "ic_chat"
      }, {
        name: window.__S.PROFILE_BNAV,
        select: "0",
        icon: "ic_profile"
      }

    ]
    this.apiToken = window.__apiToken;
    window.__BNavFlowRestart= this.setupDuiCallback;

  }

  onPop = () => {

    if(window.__pressedLoggedOut){
      this.currentPageIndex=0
      window.__pressedLoggedOut=false;
    }

    if(this.currentPageIndex==undefined){
      this.currentPageIndex=0;
    }
    console.log("on pop in main activity")


      Android.runInUI(
        this.animateView(),
        null
      );


    this.backPressCount = 0;

    // if(this.currentPageIndex==2 || this.currentPageIndex==0){
    //   var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
    //   var event ={ "tag": "API_UserEnrolledCourse", contents: whatToSend};
    //   window.__runDuiCallback(event);
    // }else if(this.currentPageIndex==2){
    //   window.__UpdateOfflineContent();
    // }

  }


  onBackPressed = () => {


    if(window.__PageFilterChooser.getVisibility()){
      window.__PageFilterChooser.hide();
      return;
    }
    if(window.__PageFilterPopup.getVisibility()){
      window.__PageFilterPopup.hide();
      return;
    }

    this.backPressCount++;
    if (this.backPressCount == 1) {
      JBridge.showSnackBar(window.__S.BACK_TO_EXIT)
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
      responseData = utils.decodeBase64(responseData)
    if(responseCode == 401){
      var callback  = callbackMapper.map(function(token){
        window.__apiToken = token;
        var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
        var event = { "tag": state.responseFor, contents: whatToSend };
        window.__runDuiCallback(event);
      });
      JBridge.getApiToken();
      return;
    }else if(responseCode == 501 || status === "failure" || status=="f") {
      JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION)
      responseData=tmp;
    } else {
     // responseData = utils.jsonifyData(responseData);
      responseData = JSON.parse(responseData);

    }



    if (responseData.params.err) {
      console.log("EROR MESSAGE :", response.params.errmsg)
      JBridge.showSnackBar("ERROR MESSAGE ->" + response.params.errmsg)
      return;
    }

    if (state.responseFor == "API_UserEnrolledCourse") {
      // var enrolled = [];
      // responseData.result.courses.map((item)=>{
      //   enrolled.push(item.courseId);
      // });
      // console.log("enrolled ids",enrolled)
      window.__enrolledCourses = responseData.result.courses;
      console.log("TOTAL ENROLLED COURSES",window.__enrolledCourses);
      window.setEnrolledCourses(responseData.result.courses);

      return;
    }

    switch (this.currentPageIndex) {
      case 0:
        window.__runDuiCallback({ "tag": "OPEN_HomeFragment", contents: [] });
        break;
      case 1:
        //shouldBeModified = (JBridge.getFromSharedPrefs("chooseCourse") != JSON.stringify(state.response.status[1].result.response))
        // if (shouldBeModified) {
        //   JBridge.setInSharedPrefs("chooseCourse", JSON.stringify(state.response.status[1]))
        // }
        // responseData = state.response.status[1];
        shouldBeModified = true;
        window.__runDuiCallback({ "tag": "OPEN_CourseFragment", contents: [] });

        break;
      case 2:
        shouldBeModified = true;
        // shouldBeModified = (JBridge.getFromSharedPrefs("userResource") != JSON.stringify(state.response.status[1].result.response))
        // if (shouldBeModified) {
        //   JBridge.setInSharedPrefs("userResource", JSON.stringify(state.response.status[1].result.response))
        // }
        window.__runDuiCallback({ "tag": "OPEN_ResourceFragment", contents: [] });

        //shouldBeModified = true;
        break;
      case 3:
        //shouldBeModified = true;
        window.__runDuiCallback({ "tag": "OPEN_CommunityFragment", contents: [] });

        break;

      case 4:
        shouldBeModified = true;
        window.__runDuiCallback({ "tag": "OPEN_ProfileFragment", contents: [] });

        break;


      default:
        console.log("[handleStateChange]\t\t MATCHED WITH default")

        break;
    }

    if (shouldBeModified) {
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
          <HomeFragment
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
          <CourseFragment
              height="match_parent"
              root="true"
              width="match_parent"
              response = {data} />
        )

        break;
      case 2:
        contentLayout = (<ResourceFragment
                  root="true"
                  response={data}
                  height="match_parent"
                  width="match_parent"/>)

        break;
      case 3:
        contentLayout = (
          <CommunityFragment
            height="match_parent"
            root="true"
            width="match_parent"
            response = {data} />
        )

        break;
      case 4:
        contentLayout = (
          <ProfileFragment
            height="match_parent"
            root="true"
            width="match_parent"
            response = {data}
            editable = "false" />
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
    window.__LoaderDialog.show();
    var event;
    var whatToSend;
    switch (this.currentPageIndex) {
      case 0:
        whatToSend= { "name": "Kiran" };
        event = { "tag": "OPEN_HomeFragment", contents: whatToSend };
        break;
      case 1:

        whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
        event = { "tag": "API_CourseFragment", contents: whatToSend};
        break;
      case 2:
        whatToSend =  {"user_token":window.__userToken,"api_token": window.__apiToken}
        event = { "tag": "API_ResourceFragment", contents:whatToSend};

        break;
      case 3:
        whatToSend = []
        event = { "tag": "OPEN_CommunityFragment", contents: whatToSend };
        break;
      case 4:
        whatToSend= {"user_token":window.__userToken,"api_token": window.__apiToken}
        event = { "tag": "API_ProfileFragment", contents:whatToSend };
        break;
      default:
        whatToSend ={ "name": "Kiran" }
        event = { "tag": "OPEN_HomeFragment",  contents: whatToSend };
        break;
    }
    window.__runDuiCallback(event);
  }




  handleBottomNavBarAction = (index) => {

        if(index==undefined){
            index=0;
        }

        if(JBridge.isNetworkAvailable()||(index!=1&&index!=4)){
              console.log("NETWORK AVAILABLE");
              this.currentPageIndex = index;
              this.switchContent(index);
        }
        else{
            JBridge.showSnackBar("NO INTERNET CONNECTION")
        }

        window.__BottomNavBar.handleNavigationChange(this.currentPageIndex);
        this.setupDuiCallback();



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
        clickable="true"
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

module.exports = Connector(MainActivity);
