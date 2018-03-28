var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var LineSpacer = require('../../components/Sunbird/core/LineSpacer');
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var objectAssign = require('object-assign');
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var CourseInProgressContainer = require('../../components/Sunbird/CourseInProgressContainer');
var HorizontalProgressBar = require('../../components/Sunbird/HorizontalProgressBar');
var utils = require('../../utils/GenericFunctions');
var Button = require('../../components/Sunbird/Button');
var HomeQuestionCardStyle = require('../../components/Sunbird/HomeQuestionCardStyle');
var AnnouncementCard = require('../../components/Sunbird/AnnouncementCard');
const CommunityParams = require('../../CommunityParams');



window.R = require("ramda");


var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');


var HomeRecommendedContainer = require('../../components/Sunbird/HomeRecommendedContainer');
var HomeTodoContainer = require('../../components/Sunbird/HomeTodoContainer');


class HomeFragment extends View {
  constructor(props, children) {
    super(props, children);
    this.screenName = "HomeFragment";
    this.menuData = {
      url: [
        { imageUrl: "ic_scanqr" },
        { imageUrl: "ic_action_search" }
      ]
    }
    JBridge.logTabScreenEvent("HOME");
    this.profileData = "";
    this.profileUpdateCardVisibility = "gone";
    this.announcementsDataTag = "savedAnnouncements";
    this.setIds([
      "announcementContainer",
      "scrollViewContainerHome",
      "parentId"
    ]);
    JBridge.clearMapId();
  }

  getAnnouncemetData = () => {
    if (JBridge.isNetworkAvailable() && window.__loggedInState != "GUEST") {
      var request = {
      };
      var whatToSend = {
        user_token: window.__user_accessToken,
        api_token: window.__apiToken,
        requestBody: JSON.stringify(request)
      };
      var event = { tag: "API_GetAnnouncementData", contents: whatToSend };
      window.__runDuiCallback(event);
    } else {
      console.log("__failed to getAnnouncementData");
    }
  }

  handleTodoClick = (index) => {
    console.log("Todo Clicked index is ", index);
  }

  handleViewAllTodoClick = () => {
    console.log("View All todos in home");
  }
  handleUserCoursesClick = (content, type) => {
    var whatToSend = { "course": JSON.stringify(content) }
    var event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    JBridge.logVisitEvent("HOME");
    window.__runDuiCallback(event);
  }

  handleStateChange = (state) => {
    var res = utils.processResponse(state);
    var status = res.status;
    var responseData = res.data;
    this.responseData = responseData;
    var responseCode = res.code;
    var responseUrl = res.url;
    var isErr = res.hasOwnProperty("err");
    switch (state.responseFor) {
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
      case "API_GetAnnouncementData":
        if (isErr) {
          console.log("Error fetching announcement data");
        } else {
          console.log("API_GetAnnouncementData :", responseData);
          try {
            var dataToBeSaved = utils.encodeBase64(JSON.stringify(responseData.result));
            console.log("dataToBeSaved ", responseData.result);
            JBridge.saveData(this.announcementsDataTag, dataToBeSaved);
            this.reRenderAnnoucements();
          } catch (err) {
            console.log("err: var dataToBeSaved = utils.encodeBase64(JSON.stringify(responseData.result));");
          }
        }
    }
  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {

    }
    if (url == "ic_action_search") {

      var searchDetails = { filterDetails: "", searchType: "Combined" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      JBridge.logVisitEvent("HOME");
      window.__runDuiCallback(event);
    } else if (url == "ic_scanqr") {
      JBridge.logQRIconClicked();
      var whatToSend = []
      var event = { tag: "OPEN_QRActivity", contents: whatToSend }
      JBridge.logVisitEvent("HOME");
      window.__runDuiCallback(event);
    }
  }


  handleResourceOpen = (data) => {
    console.log("resourceDetails");
    var whatToSend = { "resourceDetails": "nothing" }
    var event = { tag: "OPEN_ResourceDetailActivity", contents: whatToSend }
    JBridge.logVisitEvent("HOME");
    window.__runDuiCallback(event);
  }

  handleCourseOpen = (data) => {
    var whatToSend = { "course": "something" }
    var event = { tag: "OPEN_CourseInfoActivity", contents: whatToSend }
    JBridge.logVisitEvent("HOME");
    window.__runDuiCallback(event);
  }

  handleRecommendedClick = (content) => {
    console.log("Recommended clicked :", content.downloadUrl)

  }
  getLocalData = (data) => {
    console.log("data from android ", JSON.parse(data));
  }

  getTodoProfileCard = (index) => {
    try {
      this.profileData = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedProfile")));
      this.profileData = JSON.parse(utils.decodeBase64(this.profileData.response.status[1]));
    } catch (error) {
      return (<LinearLayout />);
    }
    var data = this.profileData.result.response;
    if (data.completeness == 100 || data.completeness == undefined) {
      this.profileUpdateCardVisibility = "gone";
      return (<LinearLayout
        height="match_parent" />);
    }
    this.profileUpdateCardVisibility = "visible";
    if (data.hasOwnProperty("missingFields") && (index < data.missingFields.length) && data.missingFields[index] != undefined) {
      var editButtonText = data.missingFields[index];
    } else {
      var editButtonText = "";
      this.profileUpdateCardVisibility = "gone";
    }
    switch (editButtonText) {
      case "address": editButtonText = window.__S.TITLE_ADDRESS;
        break;
      case "education": editButtonText = window.__S.TITLE_EDUCATION;
        break;
      case "jobProfile": editButtonText = window.__S.TITLE_EXPERIENCE;
        break;
      case "dob": editButtonText = window.__S.DATE_OF_BIRTH;
        break;
      case "grade": editButtonText = window.__S.GRADE;
        break;
      case "gender": editButtonText = window.__S.GENDER;
        break;
      case "profileSummary": editButtonText = window.__S.DESCRIPTION;
        break;
      case "lastName": editButtonText = window.__S.LAST_NAME;
        break;
      case "subject": editButtonText = window.__S.SUBJECTS;
        break;
      case "location": editButtonText = window.__S.CURRENT_LOCATION;
        break;
      case "language": editButtonText = window.__S.LANGUAGE;
        break;
      case "avatar": editButtonText = window.__S.AVATAR;
        break;
      default: this.profileUpdateCardVisibility = "gone";
    }
    this.avatarImageUrl = data.avatar ? data.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc";
    return (
      <LinearLayout
        width="200"
        height="match_parent"
        margin="16,0,0,0"
        orientation="vertical"
        onClick={() => this.handleEditProfileClick(data.missingFields[index])}>
        <LinearLayout
          widht="match_parent"
          height="110"
          cornerRadius="4"
          stroke={"2," + window.__Colors.PRIMARY_BLACK_66}
          orientation="vertical">
          <HorizontalProgressBar
            width="match_parent"
            height="4"
            progressBarColor={window.__Colors.PRIMARY_ACCENT}
            cornerRadius={"12,12,0,0"}
            currentProgress={data.completeness}
            totalProgress={100} />
          <LinearLayout
            width="match_parent"
            height="match_parent"
            orientation="horizontal">
            <ImageView
              width="74"
              height="74"
              margin="16,16,0,0"
              circularImageUrl={"0," + (this.avatarImageUrl)}
              stroke={"2," + "#d8d8d8"}
              cornerRadius="37" />
            <LinearLayout
              width="match_parent"
              height="match_parent"
              gravity="center"
              margin="8,20,16,20"
              orientation="vertical">
              <TextView
                widht="'wrap_content"
                height="wrap_content"
                gravity="left"
                text={window.__S.STRENGTHEN_YOUR_PROFILE}
                style={window.__TextStyle.textStyle.CARD.HEADING} />
              <TextView
                width="wrap_content"
                height="wrap_content"
                gravity="center"
                margin="0,10,0,0"
                text={utils.cropText(window.__S.ADD + " " + editButtonText, 14)}
                style={window.__TextStyle.textStyle.HINT.TINY} />
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout
          width="match_parent"
          height="match_parent"
          margin="0,8,0,0">
          <LinearLayout
            weight="1"
            padding="0,0,8,0"
            height="match_parent">
            <TextView
              width="match_parent"
              height="match_parent"
              text={window.__S.YOUR_PROFILE_IS.format(data.completeness)}
              style={window.__TextStyle.textStyle.HINT.TINY} />
          </LinearLayout>
          <Button
            type="SmallButton_Secondary_BT"
            width="wrap_content"
            height="wrap_content"
            text={window.__S.UPDATE}
            onClick={() => this.handleEditProfileClick(data.missingFields[index])} />
        </LinearLayout>
      </LinearLayout>
    )
  }

  handleAnnouncementClick = (id, index) => {
    console.log("handleAnnouncementClick", index);
    JBridge.logAnnouncementClicked("HOME", id, index + 1);
  }

  getAnnouncementCard = () => {
    var viewAllVisibility = "gone";
    var cards = <LinearLayout />
    var card1 = (<LinearLayout />), card2 = (<LinearLayout />);
    var announcementApiData = JBridge.getSavedData(this.announcementsDataTag);
    announcementApiData = announcementApiData == "__failed" ? "__failed" : JSON.parse(utils.decodeBase64(announcementApiData));
    if (announcementApiData == "__failed" || announcementApiData.count == 0) {
      cards = (<LinearLayout
        width="match_parent"
        height="wrap_content"
        background={window.__Colors.PRIMARY_LIGHT}>
        <TextView
          width="match_parent"
          height="70"
          gravity="center"
          text={window.__S.NO_ANNOUNCEMENTS} />
      </LinearLayout>
      );
    } else {
      viewAllVisibility = "visible";
      if (announcementApiData.count > 0) {
        card1 = (
          <AnnouncementCard
            tag="OPEN_AnnouncementDetailActivity"
            onClick={() => this.handleAnnouncementClick(announcementApiData.announcements[0].id, 0)}
            params={announcementApiData.announcements[0]} />
        );
      }
      if (announcementApiData.count > 1) {
        card2 = (
          <AnnouncementCard
            tag="OPEN_AnnouncementDetailActivity"
            onClick={() => this.handleAnnouncementClick(announcementApiData.announcements[1].id, 1)}
            params={announcementApiData.announcements[1]} />
        );
      }
      cards = (
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical">
          {card1}
          <LineSpacer />
          {card2}
        </LinearLayout>
      )
    }
    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        background={window.__Colors.LIGHT_GRAY}>
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="horizontal">
          <TextView
            height="wrap_content"
            width="wrap_content"
            padding="25,5,25,5"
            text={window.__S.ANNOUNCEMENT}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK} />
          <TextView
            height="wrap_content"
            weight="1"
            gravity="right"
            padding="5,0,15,0"
            visibility={viewAllVisibility}
            onClick={() => this.handleAnnouncementViewAllClick()}
            text={window.__S.VIEW_ALL}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED} />
        </LinearLayout>
        {cards}
      </LinearLayout>
    );
  }

  handleAnnouncementViewAllClick = () => {
    JBridge.logViewAllClickEvent("HOME", "Announcement");
    var data = {
      "details": ""
    }
    var whatToSend = { "announcementDetails": JSON.stringify(data) }
    var event = { tag: "OPEN_AnnouncementViewAllActivity", contents: whatToSend }
    JBridge.logVisitEvent("HOME");
    window.__runDuiCallback(event);
  }

  getCourseInProgressContainer = () => {
    this.courseInProgressContainer = (
      <CourseInProgressContainer
        parentContainer="Home"
        addCard={this.getTodoProfileCard(0)}
        addCardVisibility={this.profileUpdateCardVisibility}
        transparent="true"
        title={window.__S.TO_DO}
        onCourseClick={this.handleUserCoursesClick} />
    );
    return this.courseInProgressContainer;
  }

  getSignInOverlay = () => {
    if (window.__loggedInState && window.__loggedInState == "GUEST") {
      return (
        <LinearLayout
          height="match_parent"
          gravity="center_vertical"
          transparent="true"
          background={"#FFFFFF"}
          alpha="0.9"
          weight="1"
          clickable="true">
          <LinearLayout
            width="match_parent"
            weight="1" />
          <HomeQuestionCardStyle
            fromWhere={"HOME"}
            headerText={window.__S.OVERLAY_LABEL_HOME}
            infoText={window.__S.OVERLAY_INFO_TEXT_HOME} />
          <LinearLayout
            width="match_parent"
            weight="1" />
        </LinearLayout>
      )
    } else {
      return (<LinearLayout />)
    }
  }

  afterRender = () => {
    JBridge.getViews(this.idSet.scrollViewContainerHome + "");

    this.getAnnouncemetData();
  }

  render() {
    var imgUrl = "ic_launcher";
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed" && JBridge.getFromSharedPrefs("logo_url") != "undefined") {
      imgUrl = JBridge.getFromSharedPrefs("logo_url");
    }
    this.layout = (

      <LinearLayout
        id={this.idSet.parentId}
        orientation="vertical"
        width="match_parent"
        root="true"
        background={window.__Colors.PRIMARY_LIGHT}
        height="match_parent"
        afterRender={this.afterRender}>
        <SimpleToolbar
          title=""
          width="match_parent"
          showMenu="true"
          logo={imgUrl}
          hideBack="true"
          menuData={this.menuData}
          onMenuItemClick={this.handleMenuClick} />
        <RelativeLayout
          height="match_parent"
          width="match_parent">
          <ScrollView
            id={this.idSet.scrollViewContainerHome}
            weight="1"
            width="match_parent">
            <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">
              {this.getCourseInProgressContainer()}
              <LineSpacer />
              <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="vertical"
                id={this.idSet.announcementContainer}>
                {this.getAnnouncementCard()}
                <LineSpacer />
              </LinearLayout>
              <HomeRecommendedContainer
                title={window.__S.RECOMMENDED}
                onCourseOpenClick={this.handleCourseOpen}
                currComponentLocation={"HOME"}
                onResourceOpenClick={this.handleResourceOpen} />
            </LinearLayout>
          </ScrollView>
          {this.getSignInOverlay()}
        </RelativeLayout>
      </LinearLayout>
    )
    return this.layout.render();
  }

  reRenderAnnoucements = () => {
    var layout = (
      <LinearLayout
        height="match_parent"
        width="match_parent"
        orientation="vertical">
        {this.getAnnouncementCard()}
        <LineSpacer />
      </LinearLayout>
    );
    this.replaceChild(this.idSet.announcementContainer, layout.render(), 0);
  }

  handleEditProfileClick = (editButtonText) => {
    if (!JBridge.isNetworkAvailable()) {
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return;
    }
    var whatToSend = "";
    var event = ""
    switch (editButtonText) {
      case "address":
        whatToSend = { "profile": "" }
        event = { tag: 'OPEN_AddressActivity', contents: whatToSend }
        break;
      case "education":
        whatToSend = { "profile": "" }
        event = { tag: 'OPEN_EducationActivity', contents: whatToSend }
        break;
      case "jobProfile":
        whatToSend = { "profile": "" }
        event = { tag: 'OPEN_ExperienceActivity', contents: whatToSend }
        break;
      case "avatar": window.__ProfileImagePopUp.show();
        return;
      default:
        whatToSend = { "profile": JSON.stringify(this.profileData.result.response) }
        event = { tag: "OPEN_EditProfileActivity", contents: whatToSend }
    }
    JBridge.logVisitEvent("HOME");
    window.__runDuiCallback(event);
  }
}

module.exports = HomeFragment;
