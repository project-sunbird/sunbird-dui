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
    this.currentPageIndex = 0;

    this.setupDuiCallback();

    this.feedData = FeedParams.feedParams;

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
        name: "COMMUNITY",
        select: "0",
        icon: "ic_chat"
      }, {
        name: "PROFILE",
        select: "0",
        icon: "ic_profile"
      }

    ]
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
    console.log("HANDLE STATE CHANGE HOME SCREEN", state)
      //console.log("GOT RESPONSE\n\n\n\n", state.response.status[1])
    var responseData = {};

    this.currentPageIndex = isNaN(this.currentPageIndex) ? 0 : this.currentPageIndex;
    var shouldBeModified = false;
    var contentLayout;
    var jso = [];
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
        console.log("using mockResponse :", mockResponse.mockResponse)
        responseData = mockResponse.mockResponse;

        break;
      case 2:
        shouldBeModified = true;
        // shouldBeModified = (JBridge.getFromSharedPrefs("userResource") != JSON.stringify(state.response.status[1].result.response))
        // if (shouldBeModified) {
        //   JBridge.setInSharedPrefs("userResource", JSON.stringify(state.response.status[1].result.response))
        // }

        responseData = JSON.parse(state.response.status[1]);
        //shouldBeModified = true;
        break;
      case 3:

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
        eventAction = { "tag": "StartCoursePageApi", contents: [] };
        break;
      case 2:
        eventAction = { "tag": "StartResourcePageApi", contents: [] };
        //eventAction = { "tag": "StartResourceFlow", contents: [] };
        break;
      case 3:
        eventAction = { "tag": "StartCommunityFlow", contents: [] };
        break;
      case 4:
        eventAction = { "tag": "StartProfileFlow", contents: [] };
        break;
      default:
        eventAction = { "tag": "DummyFlow", contents: [] };
        break;
    }
    console.log("--------->VIEWPAGER TRIGGERS ", JSON.stringify(eventAction), "ON INDEX", this.currentPageIndex);

    // this.state = window.__ObjectAssign({}, this.state, eventAction);


    window.__runDuiCallback(eventAction);
  }

  // eventAction = { "tag": "ShowHome" ,contents:{"name":"Kiran"}};


  handleBottomNavBarAction = (index) => {
    this.currentPageIndex = index;
    this.setupDuiCallback();
    this.bNavBar.handleNavigationChange(index);
    this.switchContent(index)
  }


  getBottomNavBar = () => {
    this.bNavBar = (<BottomNavBar
                      tabItems = {this.tabValues}
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
