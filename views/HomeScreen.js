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

var BottomNavBar = require("../components/Sunbird/BottomNavBar")

var ChooseCourseComponent = require("../components/Sunbird/ChooseCourseComponent")
var ClassRoomHomeComponent = require("../components/Sunbird/ClassRoomHomeComponent")
var ResourceComponent = require("../components/Sunbird/ResourceComponent")
var HomeComponent = require('../components/Sunbird/HomeComponent');
var CommunityViewallList = require('../components/Sunbird/CommunityViewallList');
var CommunityInfoComponent = require('../components/Sunbird/CommunityInfoComponent');
var CommunityComponent = require('../components/Sunbird/CommunityComponent');
var ProfileComponent = require('../components/Sunbird/ProfileComponent');
var SavedResources = require('../components/Sunbird/SavedResources');
var ProfileActivityComponent = require('../components/Sunbird/ProfileActivityComponent');
var ContentLoadingComponent = require('../components/Sunbird/ContentLoadingComponent');
var FilterComponent = require('../components/Sunbird/FilterComponent');
const FeedParams = require('../FeedParams');
var debounce = require("debounce");
window.R = require("ramda");

class HomeScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.handleBottomNavBarAction = debounce(this.handleBottomNavBarAction, 200);
    //TODO : REVERT THIS LOGIC
    JBridge.setInSharedPrefs("chooseCourse", "__failed");
    JBridge.setInSharedPrefs("userResource", "__failed");

    this.setIds([
      "viewPagerContainer",
      "tabLayoutContainer",
    ]);
    this.currentViewPagerIndex = 0;
    this.setupDuiCallback();
    this.feedData = FeedParams.feedParams;

    //tab data
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
    this.currentViewPagerIndex[0] = isNaN(this.currentViewPagerIndex[0]) ? 0 : this.currentViewPagerIndex[0];

    //console.log("RESULT RESPONSE FROM STATE :", state.response.status[1]);

    var shouldBeModified = false;
    var contentLayout;
    var jso = [];
    switch (parseInt(this.currentViewPagerIndex[0])) {
      case 0:
        contentLayout = (
          <HomeComponent
              recommendedData={this.recommendedData}
              recommendedimageUrls={this.recommendedimageUrls}
              menuData={this.menuData}
              todoData = {this.todoData}
              feedData = {this.feedData}/>
        )

        break;
      case 1:
        shouldBeModified = (JBridge.getFromSharedPrefs("chooseCourse") != JSON.stringify(state.response.status[1]))
        if (shouldBeModified) {
          JBridge.setInSharedPrefs("chooseCourse", JSON.stringify(state.response.status[1]))
        }
        contentLayout = (<ChooseCourseComponent
                  response = {state.response.status[1]}
                  height="match_parent"
                  width="match_parent" />)

        break;
      case 2:
        shouldBeModified = (JBridge.getFromSharedPrefs("userResource") != JSON.stringify(state.response.status[1]))
        if (shouldBeModified) {
          JBridge.setInSharedPrefs("userResource", JSON.stringify(state.response.status[1]))
        }
        contentLayout = (<ResourceComponent
                  response = {state.response.status[1]}
                  height="match_parent"
                  width="match_parent"/>)

        break;
      case 3:

        break;

      default:
        console.log("[handleStateChange]\t\t MATCHED WITH default")
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
    jso.push({ view: this.getView(contentLayout.render()), value: "", viewType: 0 });
    if (shouldBeModified) {
      console.log("[REPLACING ui at index ]\t\t", parseInt(this.currentViewPagerIndex[0]))
      JBridge.replaceViewPagerItem(parseInt(this.currentViewPagerIndex[0]), JSON.stringify(jso));
    } else {
      console.log("GOT SAME DATA, not modifying")
    }
  }

  afterRender = () => {

    var tabData = [];
    var jso = [];
    var tmp;
    this.color = "#123123"
    var contentLayout;
    var tabItems = this.data.map((item, index) => {
      switch (index) {
        case 0:
          contentLayout = (
            <HomeComponent
                recommendedData={this.recommendedData}
                recommendedimageUrls={this.recommendedimageUrls}
                menuData={this.menuData}
                todoData = {this.todoData}
                feedData = {this.feedData}/>
          )

          tmp = (
            <ContentLoadingComponent
              height="match_parent"
              width="match_parent"
              contentLayout={contentLayout}/>)
          break;
        case 1:
          contentLayout = (<ChooseCourseComponent
                  showScreen = {this.handleCourseInfoClick}
                  height="match_parent"
                  width="match_parent" />)
          tmp = (
            <ContentLoadingComponent
              height="match_parent"
              width="match_parent"
              contentLayout={contentLayout}/>)
          break;
        case 2:
          contentLayout = (<ResourceComponent
                  showScreen = {this.props.showScreen}
                  height="match_parent"
                  width="match_parent"/>)
          tmp = (
            <ContentLoadingComponent
              height="match_parent"
              width="match_parent"
              />)
          break;
        case 3:
        contentLayout = (
          <CommunityComponent/>
        )

        tmp = (
          <ContentLoadingComponent
            height="match_parent"
            width="match_parent"
            contentLayout={contentLayout}/>)
          break;
        case 4:
        contentLayout = (
          <ProfileComponent/>
        )

        tmp = (
          <ContentLoadingComponent
            height="match_parent"
            width="match_parent"
            contentLayout={contentLayout}/>)
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
          tmp = (
            <ContentLoadingComponent
              height="match_parent"
              width="match_parent"
              contentLayout={contentLayout}/>)
          break;
      }
      jso.push({ view: this.getView(tmp.render()), value: "", viewType: 0 });
      tabData.push({ value: item })
    });

    var callback = callbackMapper.map((params) => {
      this.handleViewPagerAction([params[0]])

    });

    JBridge.viewPagerAdapter(this.idSet.viewPagerContainer, JSON.stringify(jso), JSON.stringify(tabData), callback);


  }

  setupDuiCallback = () => {
    window.__changePureScriptFlow();
    var eventAction;

    switch (parseInt(this.currentViewPagerIndex[0])) {
      case 0:
        eventAction = { tag: "dummyFlow" };
        break;
      case 1:
        eventAction = { tag: "startCourseFlow" };
        break;
      case 2:
        eventAction = { action: "startClassRoomFlow" };
        break;
      case 3:
        eventAction = { tag: "dummyFlow" };
        break;
      case 4:
        eventAction = { tag: "dummyFlow" };
        break;
      default:
        eventAction = { tag: "dummyFlow" };
        break;
    }
    console.log("--------->VIEWPAGER TRIGGERS ", eventAction, "ON INDEX", parseInt(this.currentViewPagerIndex[0]));

    // this.state = window.__ObjectAssign({}, this.state, eventAction);

    window.__runDuiCallback(eventAction);
  }

  handleViewPagerAction = (index) => {
    this.currentViewPagerIndex = index;
    console.log("MODIFIED currentViewPagerIndex:\n\n\n\n\t\t ", index)
    this.setupDuiCallback();
    this.bNavBar.handleNavigationChange(index);
  }

  handleBottomNavBarAction = (index) => {
    this.currentViewPagerIndex = index;
    JBridge.switchToViewPagerIndex(index + "");
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
        <ViewPager
          height="0"
          weight="1"
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
//
// <HomeComponent
//     recommendedData={this.recommendedData}
//     recommendedimageUrls={this.recommendedimageUrls}
//     menuData={this.menuData}
//     todoData = {this.todoData}
//     feedData = {this.feedData}/>
