var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ViewPager = require("@juspay/mystique-backend").androidViews.ViewPager;
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var BottomNavBar = require("../components/Sunbird/core/BottomNavBar");
var HomeFragment = require("./Fragments/HomeFragment");
var CourseFragment = require("./Fragments/CourseFragment");
var ResourceFragment = require("./Fragments/ResourceFragment");
var CommunityFragment = require("./Fragments/CommunityFragment");
var ProfileFragment = require("./Fragments/ProfileFragment");
var ContentLoadingComponent = require("../components/Sunbird/ContentLoadingComponent");
var FeedParams = require("../FeedParams");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var objectAssign = require("object-assign");
var debounce = require("debounce");
var utils = require("../utils/GenericFunctions");
const Str = require("../res/Strings");

window.R = require("ramda");

const mockResponse = require("../mockResponse.js");

var _this;

class MainActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.state = state;

    window.__renderBNavBar = this.renderBNavBar;

    //Assigning feedback duration of BottomNavbar
    this.handleBottomNavBarAction = debounce(this.handleBottomNavBarAction, 50);

    this.setIds([
      "viewPagerContainer",
      "tabLayoutContainer",
      "navBarContainer"
    ]);

    _this = this;

    //CurrentIndexOfViewPager
    this.currentPageIndex = 0;

    window.__AnnouncementApiCalled = false;
    //BackPressCount of MainActivity
    this.backPressCount = 0;

    //needed for FeedData for HomeFragment
    this.feedData = FeedParams.feedParams;

    this.deipalayName = "MainActivity";
    this.profileDataTag = "savedProfile";
    this.announcementsDataTag = "savedAnnouncements";

    window.__API_Profile_Called = false;
    this.apiToken = window.__apiToken;
    window.__PopulateSkillsList=[];
    window.__BNavFlowRestart = this.setupDuiCallback;
    this.profAPIerrCount = 0;

    // window.handleChangeLang = this.handleChangeLang; //added for testing
  }

  onPop = () => {
    Android.runInUI(this.animateView(), null);

    if (window.__pressedLoggedOut) {
      this.currentPageIndex = 0;
      window.__pressedLoggedOut = false;
      this.afterRender();
      return;
    }

    if (this.currentPageIndex == undefined) {
      this.currentPageIndex = 0;
    }

    this.backPressCount = 0;
    window.__BNavFlowRestart();
  }

  getUserProfileData = () => {
    if (JBridge.isNetworkAvailable() && this.profAPIerrCount <= 3) {
      console.log("this.profAPIerrCount", this.profAPIerrCount);
      var whatToSend = {
        user_token: window.__user_accessToken,
        api_token: window.__apiToken
      };
      var event = {tag: "API_ProfileFragment", contents: whatToSend};
      window.__runDuiCallback(event);
    } else if (JBridge.getSavedData(this.profileDataTag) != "__failed") {
      var data = JSON.parse(
        utils.decodeBase64(JBridge.getSavedData(this.profileDataTag))
      );
      data.local = true;
      this.handleStateChange(data);
    } else {
      console.log("__failed in getUserProfileData");
      window.__LoaderDialog.hide();
    }
    window.__LoaderDialog.hide();
  }

  getAnnouncemetData = () => {
    window.__AnnouncementApiCalled = true;
    if (JBridge.isNetworkAvailable()) {
      var request = {
      };
      var whatToSend = {
        user_token: window.__user_accessToken,
        api_token: window.__apiToken,
        requestBody: JSON.stringify(request)
      };
      var event = {tag: "API_GetAnnouncementData", contents: whatToSend};
      window.__runDuiCallback(event);
    } else {
      console.log("__failed to getAnnouncementData");
    }
  }

  onBackPressed = () => {
    if (window.__PageFilterChooser.getVisibility()) {
      window.__PageFilterChooser.hide();
      return;
    }
    if (window.__PageFilterPopup.getVisibility()) {
      window.__PageFilterPopup.hide();
      return;
    }

    this.backPressCount++;
    if (this.backPressCount == 1) {
      window.__Snackbar.show(window.__S.BACK_TO_EXIT);
    }
    if (this.backPressCount > 1) {
      JBridge.closeApp();
    }
    setTimeout(() => {
      this.backPressCount = 0;
    }, 1500);
  }

  handleStateChange = state => {
    var res = utils.processResponse(state);
    console.log("res in MainActivity", res);
    if (res == undefined) return;
    if (!state.local && !res.hasOwnProperty("err") && state.responseFor == "API_ProfileFragment") {
      console.log("Saving state");
      var data = utils.encodeBase64(JSON.stringify(state));
      JBridge.saveData(this.profileDataTag, data);
    }

    this.currentPageIndex = isNaN(this.currentPageIndex) ? 0 : this.currentPageIndex;
    var shouldBeModified = false;
    var status = res.status;
    var responseData = res.data;
    this.responseData = responseData;
    var responseCode = res.code;
    var responseUrl = res.url;
    var tmp = {
      params: {},
      result: {
        response: {
          sections: [],
          courses: []
        }
      }
    };
    ///////////////////////////////////////////////////////////////////////////
    var isErr = res.hasOwnProperty("err");
    console.log("response data in MainActivity", responseData);
    if (state.sendBack) {
      responseData.sendBack = state.sendBack;
    }

    switch (state.responseFor) {
      case "API_ProfileFragment":
        if (isErr) {
          this.handleProfileFragAPIResErr();
          responseData = tmp;
        } else {
          this.profAPIerrCount = 0;
          console.log("profileData", responseData);
          window.__userName = responseData.result.response.userName;

          //check for rootOrg details
          console.log("JBridge.getFromSharedPrefs('logo_url')", JBridge.getFromSharedPrefs("logo_url"));
          if (responseData.result.response && responseData.result.response.rootOrg && !window.__API_Profile_Called
              && (JBridge.getFromSharedPrefs("logo_url") == "__failed"
                  || JBridge.getFromSharedPrefs("orgName") == "__failed"
                  || JBridge.getFromSharedPrefs("channelId") == "__failed")
              ) {
            console.log("slug", responseData.result.response.rootOrg.slug);
            window.__orgName = responseData.result.response.rootOrg.orgName;
            if (responseData.result.response.rootOrg.hashTagId) {
              JBridge.setInSharedPrefs("channelId", responseData.result.response.rootOrg.hashTagId);
              console.log("channelId", JBridge.getFromSharedPrefs("channelId"));
              JBridge.setParams();
            }
            if (responseData.result.response.rootOrg.hasOwnProperty("preferredLanguage") && responseData.result.response.rootOrg.preferredLanguage != null) {
              this.handleChangeLang(responseData.result.response.rootOrg.preferredLanguage);
            }
            if (responseData.result.response.topics && responseData.result.response.topics.length != 0) {
              console.log("setting topics", responseData.result.response.topics);
              JBridge.setInSharedPrefs("topics", JSON.stringify(responseData.result.response.topics));
              JBridge.registerFCM(responseData.result.response.topics);
            }
            window.__API_Profile_Called = true;
            if (window.__userName != undefined)
              window.__Snackbar.show(window.__S.WELCOME_BACK.format(window.__userName));
            var whatToSend = {
              user_token: window.__user_accessToken,
              api_token: window.__apiToken,
              slug: responseData.result.response.rootOrg.slug
            };
            var event = {tag: "API_Tenant", contents: whatToSend};
            window.__runDuiCallback(event);
          }
        }
        break;
      case "API_Tenant":
        if (isErr) {
        } else {
          console.log("responseFor API_Tenant", responseData);
          JBridge.setInSharedPrefs("logo_url", responseData.result.appLogo);
          JBridge.setInSharedPrefs("orgName", window.__orgName);
        }
        break;
      case "API_UserEnrolledCourse":
        if (isErr) {
          var tmpData = JBridge.getSavedData("savedCourse");
          if (tmpData && tmpData != "__failed") {
            console.log("fetched enrolledCourses");
            window.__enrolledCourses = JSON.parse(utils.decodeBase64(tmpData));
            window.setEnrolledCourses(JSON.parse(utils.decodeBase64(tmpData)));
            return;
          }
        } else {
          JBridge.saveData("savedCourse", utils.encodeBase64(JSON.stringify(responseData.result.courses)));
          window.__enrolledCourses = responseData.result.courses;
          window.setEnrolledCourses(responseData.result.courses);
          return;
        }
        break;
      case "API_GetAnnouncementData":
        if (isErr) {
          if (JBridge.getSavedData(this.announcementsDataTag) != "__failed") {
            var data = JSON.parse(utils.decodeBase64(JBridge.getSavedData(this.announcementsDataTag)));
            // data = JSON.parse(utils.decodeBase64(state.response.status[1]));
          //  window.__AnnouncementApiData = data.result.announcements;
          }
        } else {
          console.log("API_GetAnnouncementData :", responseData);
          var dataToBeSaved = utils.encodeBase64(JSON.stringify(responseData.result));
          console.log("dataToBeSaved ", responseData.result);
          JBridge.saveData(this.announcementsDataTag, dataToBeSaved);
        }
        break;
      case "API_EndorseSkill":
        if (isErr) {
          window.__Snackbar.show(window.__S.SKILL_NOT_ADDED);
        } else {
          window.__Snackbar.show(window.__S.SKILLS_ADDED_SUCCESSFULLY);
        }
        window.__BNavFlowRestart();
        return;
      case "API_GetSkillsList":
        window.__PopulateSkillsList = [];
        if (isErr) {
        } else {
          try {
            console.log("skills ", responseData.data.result.skills);
            window.__PopulateSkillsList = responseData.data.result.skills;
          } catch (e) {
            console.log("Exception : ", e);
          }
        }
        window.__CustomPopUp.show();
        return;
      case "API_SetProfileVisibility":
        if (isErr) {
          if (responseCode == 504) {
            window.__LoaderDialog.hide();
            window.__Snackbar.show(window.__S.TIME_OUT);
          } else {
            window.__LoaderDialog.hide();
            window.__Snackbar.show("failed");
          }
        } else {
          window.__BNavFlowRestart();
        }
      default:
        break;
    }
    //////////////////////////////////////////////////////////////////////////////

    switch (this.currentPageIndex) {
      case 0:
        shouldBeModified = true;
        // JBridge.logCorrelationPageEvent("HOME",responseData.params.msgid,responseData.id)
        this.logCorrelationPageEvent("HOME");
        window.__runDuiCallback({tag: "OPEN_HomeFragment", contents: []});
        break;
      case 1:
        shouldBeModified = true;
        this.logCorrelationPageEvent("COURSES");
        // JBridge.logCorrelationPageEvent("COURSES",responseData.params.msgid,responseData.id)
        window.__runDuiCallback({tag: "OPEN_CourseFragment", contents: []});
        break;
      case 2:
        shouldBeModified = true;
        this.logCorrelationPageEvent("RESOURCES");
        // JBridge.logCorrelationPageEvent("RESOURCES",responseData.params.msgid,responseData.id)
        window.__runDuiCallback({tag: "OPEN_ResourceFragment", contents: []});
        break;
      case 3:
        //shouldBeModified = true;
        window.__runDuiCallback({tag: "OPEN_CommunityFragment", contents: []});
        break;
      case 4:
        shouldBeModified = true;
        window.__runDuiCallback({tag: "OPEN_ProfileFragment", contents: []});
        break;
      default:
        break;
    }

    if (shouldBeModified) {
      if (state.hasOwnProperty("filter_to_send"))
        responseData.filter_to_send = state.filter_to_send;
      else responseData.filter_to_send = null;

      this.switchContent(this.currentPageIndex, responseData);
    } else {
      console.log("GOT SAME DATA, not modifying");
    }
  };

  handleProfileFragAPIResErr = () => {
    this.profAPIerrCount++;
    console.log("handleProfileFragAPIResErr this.profAPIerrCount", this.profAPIerrCount);
    if (JBridge.getSavedData(this.profileDataTag) != "__failed"){
      var data = JSON.parse(utils.decodeBase64(JBridge.getSavedData(this.profileDataTag)));
      data.local = true;
      this.handleStateChange(data)
    } else {
      window.__LoaderDialog.hide();
    }
  }

  logCorrelationPageEvent = page => {
    if (this.responseData.hasOwnProperty("params") && this.responseData.hasOwnProperty("id"))
      JBridge.logCorrelationPageEvent(page, this.responseData.params.msgid, this.responseData.id);
  };

  switchContent = (index, data) => {
    var tmp;
    var contentLayout;
    this.color = "#123123";
    switch (index) {
      case 0:
        JBridge.logTabClickEvent("HOME");
        contentLayout = (
          <HomeFragment
            response={data}
            recommendedData={this.recommendedData}
            recommendedimageUrls={this.recommendedimageUrls}
            menuData={this.menuData}
            todoData={this.todoData}
            feedData={this.feedData}
            height="match_parent"
            root="true"
            width="match_parent"
          />
        );

        break;
      case 1:
        JBridge.logTabClickEvent("COURSES");
        contentLayout = (
          <CourseFragment
            height="match_parent"
            root="true"
            width="match_parent"
            response={data}
          />
        );

        break;
      case 2:
        JBridge.logTabClickEvent("LIBRARY");
        contentLayout = (
          <ResourceFragment
            root="true"
            response={data}
            height="match_parent"
            width="match_parent"
          />
        );

        break;
      case 3:
        JBridge.logTabClickEvent("GROUPS");
        contentLayout = (
          <CommunityFragment
            height="match_parent"
            root="true"
            width="match_parent"
            response={data}
          />
        );

        break;
      case 4:
        if (!data.sendBack) JBridge.logTabClickEvent("PROFILE");
        contentLayout = (
          <ProfileFragment
            height="match_parent"
            root="true"
            width="match_parent"
            response={data}
            editable="true"
          />
        );
        break;

      default:
        contentLayout = (
          <LinearLayout height="match_parent" root="true" width="match_parent">
            <TextView
              text=""
              background={this.color}
              color="#ffffff"
              height="match_parent"
              width="match_parent"
              gravity="center"
            />
          </LinearLayout>
        );
        break;
    }
    tmp = (
      <ContentLoadingComponent
        height="match_parent"
        width="match_parent"
        root="true"
        contentLayout={contentLayout}
      />
    );

    this.replaceChild(this.idSet.viewPagerContainer, tmp.render(), 0);
  };

  afterRender = () => {
    this.currentPageIndex = 0;
    this.renderBNavBar(this.currentPageIndex);
    this.getUserProfileData();
  };

  renderBNavBar = index => {
    console.log("IN RENDER BNAV BAR", window.__S.FILTER_BY);

    var layout = (
      <LinearLayout
        background={window.__Colors.WHITE}
        width="match_parent"
        orientation="vertical"
        height="56">
        <ViewWidget
          height="2"
          alpha="0.2"
          width="match_parent"
          background={window.__Colors.DARK_GRAY}
        />

        {this.getBottomNavBar()}
      </LinearLayout>
    );

    this.replaceChild(this.idSet.tabLayoutContainer, layout.render(), 0);
    this.handleBottomNavBarAction(index);
  };

  setupDuiCallback = () => {
    window.__changePureScriptFlow();
    window.__LoaderDialog.show();
    var event;
    var whatToSend;
    if (this.currentPageIndex != 0) {
      window.__Check = 0;
      window.__AnnouncementApiCalled = false;
    }
    switch (this.currentPageIndex) {
      case 0:
        if((!window.__AnnouncementApiCalled) && JBridge.isNetworkAvailable()){
          this.getAnnouncemetData();
        }
      if (window.__Check == 0) {
        if(!JBridge.isNetworkAvailable()){
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
        }else{
          this.getUserProfileData();
        }
      }
        whatToSend = [];
        event = {tag: "OPEN_HomeFragment", contents: whatToSend};
        window.__Check = 1;
        window.__LoaderDialog.hide();
        break;
      case 1:
        if (!JBridge.isNetworkAvailable()) {
          window.__runDuiCallback({tag: "OPEN_CourseFragment", contents: []});
          this.switchContent(this.currentPageIndex);
        } else {
          whatToSend = {
            user_token: window.__user_accessToken,
            api_token: window.__apiToken
          };
          event = {tag: "API_CourseFragment", contents: whatToSend};
        }
        break;
      case 2:
        if (!JBridge.isNetworkAvailable()) {
          window.__runDuiCallback({tag: "OPEN_ResourceFragment", contents: []});
          this.switchContent(this.currentPageIndex);
        } else {
          whatToSend = {
            user_token: window.__user_accessToken,
            api_token: window.__apiToken
          };
          event = {tag: "API_ResourceFragment", contents: whatToSend};
        }
        break;
      case 3:
        whatToSend = [];
        event = {tag: "OPEN_CommunityFragment", contents: whatToSend};
        break;
      case 4:
        this.getUserProfileData();
        break;
      default:
        whatToSend = [];
        event = {tag: "OPEN_HomeFragment", contents: whatToSend};
        break;
    }
    if (event) window.__runDuiCallback(event);
  };

  handleBottomNavBarAction = index => {
    if (index == undefined) index = 0;

    this.currentPageIndex = index;

    if (index != 1 && index != 2 && index != 4) {
      this.switchContent(index);
    }
    window.__BottomNavBar.handleNavigationChange(this.currentPageIndex);
    this.setupDuiCallback();
  };

  getBottomNavBar = () => {
    var tabValues = [
      {
        name: window.__S.HOME_BNAV,
        select: "1",
        icon: "ic_home"
      },
      {
        name: window.__S.COURSES_BNAV,
        select: "0",
        icon: "ic_courses"
      },
      {
        name: window.__S.LIBRARY_BNAV,
        select: "0",
        icon: "ic_notebook"
      },
      {
        name: window.__S.GROUPS_BNAV,
        select: "0",
        icon: "ic_chat"
      },
      {
        name: window.__S.PROFILE_BNAV,
        select: "0",
        icon: "ic_profile"
      }
    ];
    this.bNavBar = (
      <BottomNavBar
        tabItems={tabValues}
        defaultIndex="3"
        _onClick={this.handleBottomNavBarAction}
      />
    );

    return this.bNavBar;
  };

  onStop = () => {
    window.__PermissionDeniedDialog.hide();
  };

  handleChangeLang = lang => {
    console.log("handleChangeLang ", lang);
    console.log("handleChangeLang converted string ", lang + "_IN");
    window.__LoaderDialog.show();
    window.setLanguage(lang + "_IN");
    window.__S = Str.strings();
    window.__renderBNavBar(0); //rerendering navbar along with fragment
    window.__LanguagePopup.hide();
    window.__reRender(); //rerendering 'Please wait' loader
    // window.__BNavFlowRestart();
  };

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        clickable="true"
        background={window.__Colors.WHITE}
        height="match_parent">
        <LinearLayout
          height="0"
          weight="1"
          root="true"
          id={this.idSet.viewPagerContainer}
          width="match_parent"
        />
        <LinearLayout width="match_parent">
          <LinearLayout
            background={window.__Colors.WHITE}
            width="match_parent"
            orientation="vertical"
            id={this.idSet.tabLayoutContainer}
            height="56"
          />
        </LinearLayout>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(MainActivity);
