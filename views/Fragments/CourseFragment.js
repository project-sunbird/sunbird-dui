var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var QuestionsComponent = require('../../components/Sunbird/QuestionsComponent');
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var LineSpacer = require('../../components/Sunbird/core/LineSpacer');
var NoInternetCard = require('../../components/Sunbird/NoInternetCard');
var CircularLoader = require('../../components/Sunbird/core/CircularLoader');
var utils = require('../../utils/GenericFunctions');

var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');

var CourseInProgressContainer = require('../../components/Sunbird/CourseInProgressContainer');
var CourseContainer = require('../../components/Sunbird/CourseContainer');
var HomeQuestionCardStyle = require('../../components/Sunbird/HomeQuestionCardStyle');

var _this;
class CourseFragment extends View {
  constructor(props, children) {
    super(props, children);
    this.screenName = "CourseFragment";
    this.setIds([
      "parentId",
      "parentContainer",
      "infoContainer",
      "viewallContainer",
      "fetchingHolder",
      "scrollViewContainerCourse",
      "courseContentContainer"
    ]);
    _this = this;

    if (window.__CourseFilter) {
      this.menuData = {
        url: [
          { imageUrl: "ic_scanqr" },
          { imageUrl: "ic_action_search" },
          { imageUrl: "ic_action_filter_applied" }
        ]
      }
    } else {
      this.menuData = {
        url: [
          { imageUrl: "ic_scanqr" },
          { imageUrl: "ic_action_search" },
          { imageUrl: "ic_action_filter" }
        ]
      }
    }
    JBridge.logTabScreenEvent("COURSES");
    JBridge.clearMapId();
  }

  checkIfEnrolled = (identifier) => {
    var enrolled = false;
    if (window.__enrolledCourses) {
      window.__enrolledCourses.map((item) => {
        if (item.identifier === identifier || item.contentId === identifier || item.courseId === identifier) {
          enrolled = true;
        }
      });
    }
    return enrolled;
  }

  handlePageApi = (isErr, data) => {
    console.log("data in handlePageApi -> ", data);

    if (isErr) {
      //Error in response
      window.__Snackbar.show(window.__S.ERROR_EMPTY_RESULT)
      this.replaceChild(this.idSet.courseContentContainer, this.getErrorLayout().render(), 0);
    } else {
      //successful response
      this.details = data.result.response;
      window.__PageFilterPopup.resetPopup("Course", data);
      if ((!this.details.hasOwnProperty("name"))
        || (this.details.sections == undefined || this.details.sections.length == 0)) {
        //error in fetched data
        window.__Snackbar.show(window.__S.ERROR_FETCHING_DATA);
        this.replaceChild(this.idSet.courseContentContainer, this.getErrorLayout().render(), 0);
      } else {
        console.log("this.details in handlePageApi -> ", this.details);

        var rows = this.details.sections.map((item, index) => {
          return this.getCourseCardLayout(item, index);
        })

        var layout = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
          {rows}
        </LinearLayout>)

        this.replaceChild(this.idSet.courseContentContainer, layout.render(), 0);
      }
    }
    window.__LoaderDialog.hide();
    utils.addSwipeFunction(this.idSet.scrollViewContainerCourse);
  }

  getSignInOverlay = () => {
    if (window.__loggedInState && window.__loggedInState == "GUEST") {
      return (
        <LinearLayout
          background={window.__Colors.WHITE_F2}
          clickable="true"
          width="match_parent"
          padding="16,16,16,16">
          <HomeQuestionCardStyle
            currComponentLocation={"COURSE"}
            fromWhere={"COURSE"}
            headerText={window.__S.OVERLAY_LABEL_COMMON.format(JBridge.getAppName())}
            infoText={window.__S.OVERLAY_INFO_TEXT_COMMON.format(JBridge.getAppName())}
            textSize="16"
            gravity="left" />
        </LinearLayout>)
    } else {
      return (<LinearLayout />)
    }
  }

  handleStateChange = (state) => {
    var res = utils.processResponse(state);
    var status = res.status;
    var responseData = res.data;
    var responseCode = res.code;
    var responseUrl = res.url;
    if (state.hasOwnProperty("filter_to_send")) {
      responseData.filter_to_send = state.filter_to_send;
    }
    var isErr = res.hasOwnProperty("err");

    console.log("responseData -> ", responseData);
    switch (state.responseFor) {
      case "API_CourseFragment":
        this.handlePageApi(isErr, responseData);
        break;
      case "API_UserEnrolledCourse":
        if (isErr) {
          var tmpData = JBridge.getSavedData("savedCourse");
          if (tmpData && tmpData != "__failed") {
            console.log("fetched enrolledCourses");
            window.__enrolledCourses = JSON.parse(utils.decodeBase64(tmpData));
            this.courseInProgressContainer.renderContent(JSON.parse(utils.decodeBase64(tmpData)));
            return;
          }
        } else {
          JBridge.saveData("savedCourse", utils.encodeBase64(JSON.stringify(responseData.result.courses)));
          window.__enrolledCourses = responseData.result.courses;
          this.courseInProgressContainer.renderContent(responseData.result.courses);
          return;
        }
        break;
      case "API_FilterPage":
        window.__CourseFilter = responseData;
        window.__BNavFlowRestart();
        break;
    }
  }

  getErrorLayout = () => {

    var layout = (

      <LinearLayout
        background={window.__Colors.WHITE}
        height="400"
        width="match_parent"
        alpha="0.55"
        weight="1"
        orientation="vertical"
        gravity="center_horizontal"
        clickable="true">

        <ImageView
          width="100"
          height="100"
          alpha="0.55"
          margin="0,58,0,0"
          gravity="center_horizontal"
          imageUrl="ic_no_internet" />

        <TextView
          width="wrap_content"
          height="wrap_content"
          gravity="center_horizontal"
          alpha="0.55"
          padding="0,16,0,0"
          style={window.__TextStyle.textStyle.CARD.HEADING}
          text={window.__S.ERROR_FETCHING_DATA} />


      </LinearLayout>
    )
    return layout;
  }

  getCourseCardLayout = (item, index) => {

    var langCode = window.__CurrentLanguage.substr(0, 2);
    if (langCode != "hi")
      langCode = "en"
    var LanguageTitle = JSON.parse(item.display).name[langCode];

    return (<LinearLayout
      height="wrap_content"
      width="match_parent"
      root="true"
      visibility={item.contents == undefined ? "gone" : "visible"}
      orientation="vertical">
      <LineSpacer />

      <CourseContainer
        sectionId={item.id}
        sectionIndex={index + 1}
        title={item.name}
        languageTitle={LanguageTitle}
        data={item.contents}
        searchQuery={item.searchQuery}
        showViewMore="visible"
        onCourseClick={this.handleCourseClick} />


    </LinearLayout>)
  }

  handleCourseClick = (content, type, index) => {
    console.log("handleCourseClick ", content);

    JBridge.logCardClickEvent("COURSES", index + 1, "COURSES", content.identifier, content.pkgVersion)
    var tmp = JSON.stringify(content)
    var whatToSend = []
    var event = {};

    if (this.checkIfEnrolled(content.identifier)) {
      whatToSend = { "course": tmp }
      event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    } else {
      whatToSend = { "course": tmp }
      event = { tag: 'OPEN_CourseInfoActivity', contents: whatToSend }
    }
    JBridge.logVisitEvent("COURSES");
    window.__runDuiCallback(event);
  }

  handleUserCoursesClick = (content, type, index) => {
    console.log("handleUserCourseClick ", content);
    JBridge.logCardClickEvent("COURSES", index + 1, "COURSES_IN_PROGRESS", content.identifier, null);
    var whatToSend = { "course": JSON.stringify(content) }
    var event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    JBridge.logVisitEvent("COURSES");
    window.__runDuiCallback(event);
  }

  getCourseData = () => {
    console.log("getCourseData");
    if (!JBridge.isNetworkAvailable()) {
      window.__ContentLoadingComponent.hideLoader();
      window.__LoaderDialog.hide();
      this.replaceChild(this.idSet.courseContentContainer, (<NoInternetCard />).render(), 0);
    } else {
      var whatToSend = {
        user_token: window.__user_accessToken,
        api_token: window.__apiToken
      };
      var event = { tag: "API_CourseFragment", contents: whatToSend };
      window.__runDuiCallback(event);
    }
  }

  getCourseInProgressContainer = () => {
    this.courseInProgressContainer = (
      <CourseInProgressContainer
        parentContainer="Course"
        transparent="true"
        title={window.__S.COURSES_IN_PROGRESS}
        showViewMore="gone"
        onCourseClick={this.handleUserCoursesClick} />
    );
    return this.courseInProgressContainer;
  }

  afterRender = () => {
    JBridge.getViews(this.idSet.scrollViewContainerCourse + "");
    if (!window.__CourseFilter) {
      console.log("CF afterRender -> no window.__CourseFilter");

      this.getCourseData();
    } else {
      console.log("CF afterRender -> window.__CourseFilter");
      var responseData = window.__CourseFilter;
      var isErr = responseData.hasOwnProperty("err");
      this.handlePageApi(isErr, responseData);
      window.__CourseFilter = undefined;
    }
    utils.addSwipeFunction(this.idSet.scrollViewContainerCourse);
  }

  getQuestionsComponent = () => {
    if (window.__questionStore && !window.__questionStore.isAllQsAnsweredAtInit() && window.__loggedInState == "GUEST") {
      return (
        <QuestionsComponent
          visibility="visible" />
      );
    } else {
      return (
        <LinearLayout />
      );
    }
  }

  getBody = () => {
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title={window.__S.COURSES_LW}
          width="match_parent"
          showMenu="true"
          hideBack="true"
          menuData={this.menuData}
          onMenuItemClick={this.handleMenuClick} />

        <ScrollView
          height="0"
          weight="1"
          id={this.idSet.scrollViewContainerCourse}
          width="match_parent">

          <LinearLayout
            height="match_parent"
            width="match_parent"
            background={window.__Colors.WHITE}
            orientation="vertical">

            {this.getQuestionsComponent()}

            {this.getCourseInProgressContainer()}

            <LinearLayout
              width="match_parent"
              weight="1"
              orientation="vertical"
              layoutTransition="true"
              id={this.idSet.courseContentContainer}>

              <CircularLoader
                margin="0,16,0,0" />
            </LinearLayout>
            {this.getSignInOverlay()}
          </LinearLayout>
        </ScrollView>
      </LinearLayout>
    )
  }

  handleMenuClick = (url) => {
    if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Course" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      JBridge.logVisitEvent("COURSES");
      window.__runDuiCallback(event);

    } else if (url == "ic_scanqr") {
      var whatToSend = []
      var event = { tag: "OPEN_QRActivity", contents: whatToSend }
      JBridge.logVisitEvent(window.__S.COURSES_BNAV);
      window.__runDuiCallback(event);
    } else if (url == "ic_action_filter" || url == "ic_action_filter_applied") {
      JBridge.explicitSearch("COURSE", "FILTER");
      window.__PageFilterPopup.show();
    }
  }

  render() {
    this.layout = (
      <LinearLayout
        id={this.idSet.parentId}
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        afterRender={this.afterRender}>

        {this.getBody()}

      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseFragment;
