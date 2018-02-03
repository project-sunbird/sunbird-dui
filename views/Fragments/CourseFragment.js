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
    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer",
      "fetchingHolder",
      "scrollViewContainerCourse",
      "courseContentContainer"
    ]);
    _this = this;

    this.props = props;
    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    console.log("course constructor", props);
    if (this.props.response != undefined && this.props.response.hasOwnProperty("filter_to_send") && this.props.response.filter_to_send != null) {
      console.log(props.response.filter_to_send, "fiter applied");
      console.log([].concat.apply([], Object.values(JSON.parse(props.response.filter_to_send))).length, "lenth");

      if (([].concat.apply([], Object.values(JSON.parse(props.response.filter_to_send)))).length > 0) {
        this.menuData = {
          url: [
            { imageUrl: "ic_action_search" },
            { imageUrl: "ic_action_filter_applied" }
          ]
        }
      }
      else {

        this.menuData = {
          url: [
            { imageUrl: "ic_action_search" },
            { imageUrl: "ic_action_filter" }
          ]
        }
      }

    }
    else {
      console.log("no filter applied");
      this.menuData = {
        url: [
          { imageUrl: "ic_action_search" },
          { imageUrl: "ic_action_filter" }
        ]
      }
    }
    JBridge.logTabScreenEvent("COURSES");
    this.enrolledCourses = []
    window.setEnrolledCourses = this.setEnrolledCourses;
  }

  setEnrolledCourses = (list) => {
    this.enrolledCourses = list;

    window.__UpdateUserCourses(this.enrolledCourses);
  }

  checkIfEnrolled = (identifier) => {
    var enrolled = false;

    this.enrolledCourses.map((item) => {

      if (item.identifier === identifier || item.contentId === identifier || item.courseId === identifier) {
        enrolled = true;
      }
    })
    return enrolled;
  }

  networkCheck = () => {
    if (JBridge.isNetworkAvailable()) {
      window.__BNavFlowRestart();
      return;
    }
    window.__timer = setTimeout(this.dumyfunction, 5000);
  }

  handlePageApi = (isErr) => {
    if (isErr) {
      //Error in response
      window.__Snackbar.show(window.__S.ERROR_EMPTY_RESULT)
      this.replaceChild(this.idSet.courseContentContainer, this.getErrorLayout().render(), 0);
    } else {
      //successful response
      this.details = this.responseData.result.response;
      if ((!this.details.hasOwnProperty("name"))
        || (this.details.sections == undefined || this.details.sections.length == 0)) {
        //error in fetched data
        window.__ContentLoadingComponent.hideLoader();
        window.__LoaderDialog.hide();
        window.__Snackbar.show(window.__S.ERROR_FETCHING_DATA);
        this.replaceChild(this.idSet.courseContentContainer, this.getErrorLayout().render(), 0);
      } else {
        var rows = this.details.sections.map((item, index) => {
          return this.getCourseCardLayout(item);
        })

        var layout = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
          {rows}
          {this.getSignInOverlay()}
        </LinearLayout>)

        this.replaceChild(this.idSet.courseContentContainer, layout.render(), 0);
      }
    }
    utils.addSwipeFunction(this.idSet.scrollViewContainerCourse);
  }

  getSignInOverlay = () => {
    if (window.__loggedInState && window.__loggedInState=="GUEST"){
      return (
        <LinearLayout
          background={window.__Colors.WHITE_F2}
          clickable="true"
          width="match_parent"
          padding="16,16,16,16">
          <HomeQuestionCardStyle
            headerText={window.__S.OVERLAY_LABEL_COMMON}
            infoText={window.__S.OVERLAY_INFO_TEXT_COMMON}
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
    this.responseData = responseData;
    var responseCode = res.code;
    var responseUrl = res.url;
    var isErr = res.hasOwnProperty("err");

    console.log("responseData -> ", this.responseData);
    switch(state.responseFor) {
      case "API_CourseFragment":
        this.handlePageApi(isErr);
        break; 
      case "API_UserEnrolledCourse":
        if (isErr) {
          var tmpData = JBridge.getSavedData("savedCourse");
          if (tmpData && tmpData != "__failed") {
            console.log("fetched enrolledCourses");
            window.__enrolledCourses = JSON.parse(utils.decodeBase64(tmpData));
            // window.setEnrolledCourses(JSON.parse(utils.decodeBase64(tmpData)));
            this.courseInProgressContainer.renderContent(JSON.parse(utils.decodeBase64(tmpData)));
            return;
          }
        } else {
          JBridge.saveData("savedCourse", utils.encodeBase64(JSON.stringify(responseData.result.courses)));       
          window.__enrolledCourses = responseData.result.courses;
          // window.setEnrolledCourses(responseData.result.courses);
          this.courseInProgressContainer.renderContent(responseData.result.courses);
          return;
        }
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
          margin="0,58,0,0"
          gravity="center_horizontal"
          imageUrl="ic_no_internet" />

        <TextView
          width="wrap_content"
          height="wrap_content"
          gravity="center_horizontal"
          padding="0,16,0,0"
          style={window.__TextStyle.textStyle.CARD.HEADING}
          text={window.__S.ERROR_FETCHING_DATA} />


      </LinearLayout>
    )
    return layout;
  }

  getCourseCardLayout = (item) => {

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
    window.__runDuiCallback(event);


  }

  handleUserCoursesClick = (content, type, index) => {
    console.log("handleUserCourseClick ", content);
    JBridge.logCardClickEvent("COURSES", index + 1, "COURSES_IN_PROGRESS", content.identifier, null);
    var whatToSend = { "course": JSON.stringify(content) }
    var event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    window.__runDuiCallback(event);
  }

  getCourseData = () => {
    console.log("getCourseData");
    if (!JBridge.isNetworkAvailable()) {
      window.__ContentLoadingComponent.hideLoader();
      window.__LoaderDialog.hide();
      window.timer = setTimeout(this.networkCheck, 5000);
      this.replaceChild(this.idSet.courseContentContainer, (<NoInternetCard/>).render(), 0);
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
    this.getCourseData();
    utils.addSwipeFunction(this.idSet.scrollViewContainerCourse);
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
          </LinearLayout>
        </ScrollView>
      </LinearLayout>
    )
  }

  handleMenuClick = (url) => {

    if (url == "ic_notification_red") {
      window.__Snackbar.show(window.__S.COMING_SOON)
    }
    else if (url == "ic_action_search") {

      var searchDetails = { filterDetails: "", searchType: "Course" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      window.__runDuiCallback(event);

    } else if (url == "ic_action_filter" || url == "ic_action_filter_applied") {
      JBridge.explicitSearch("COURSE", "FILTER");
      window.__PageFilterPopup.resetPopup("Cource", this.props.response);
      window.__PageFilterPopup.show();
    }
  }

  render() {
    this.layout = (
      <LinearLayout
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
