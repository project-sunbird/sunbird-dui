var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ProgressBar = require("@juspay/mystique-backend/src/android_views/ProgressBar");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");;
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ProgressBar = require("@juspay/mystique-backend/src/android_views/ProgressBar");
var utils = require('../utils/GenericFunctions');

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');
var PageOption = require('../components/Sunbird/core/PageOption');
var CourseProgress = require('../components/Sunbird/CourseProgress');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var SharePopup = require('../components/Sunbird/core/SharePopup');

var _this;
class CourseInfoActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
      "descriptionContainer",
      "downloadProgressText",
      "totalContainer",
      "sharePopupContainer",
      "enrollButtonId",
      "readMore"
    ]);
    this.state = state;
    this.screenName = "CourseInfoActivity"

    this.menuData = {
      url: [
        { imageUrl: "ic_action_share_black" },
      ]
    }

    this.shouldCacheScreen = false;

    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;
    this.cour = "";

    _this = this;


    this.details = JSON.parse(state.data.value0.courseDetails);
    console.log("data in CIA", this.details);

    this.localContent = null;
    this.data = {
      courseName: this.details ? this.details.name : "",
      courseDesc: this.details ? this.details.description : "",
      competedCount: this.details && this.details.footerTitle ? this.details.footerTitle.split('%')[0] : "10",
    };
  }

  getSpineStatus = (res) => {
    console.log("inside getSpineStatus", res);

    var cb = res[0];
    var id = res[1];
    var data = JSON.parse(res[2]);
    if (id != this.details.identifier) return;

    if (cb == "onDownloadProgress") {
      var textToShow = ""

      data.downloadProgress = data.downloadProgress == undefined ? 0 : data.downloadProgress;
      var downloadedPercent = parseInt(data.downloadProgress);
      downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        text: window.__S.FETCHING_CONTENTS.format(downloadedPercent)
      })
      Android.runInUI(cmd, 0);
    } else if (cb == "onContentImportResponse" && data.status == "IMPORT_COMPLETED") {
      if (data.status == "NOT_FOUND") {
        window.__ContentLoaderDialog.hide();
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        this.onBackPressed();
        return;
      } else if (data.status == "IMPORT_COMPLETED") {
        this.renderChildren(this.details.identifier);
      }
    }
  }

  renderChildren = (identifier) => {
    var callback1 = callbackMapper.map(function (data) {
      console.log("JBridge.getChildContent data -> ", data);

      if (data == "__failed") {
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        _this.onBackPressed();
        return;
      }
      data[0] = utils.jsonifyData(utils.decodeBase64(data[0]))
      _this.courseContent = JSON.parse(data[0]);
      _this.renderCourseChildren(identifier)
    });
    JBridge.getChildContent(identifier, callback1);
  }

  checkContentLocalStatus = (identifier) => {
    console.log("contentType: ", this.details.contentType);
    JBridge.startEventLog(this.details.contentType, identifier, this.details.pkgVersion);
    var callback = callbackMapper.map(function (data) {
      if (data == "__failed") {
        //TODO implemented hack, actual implementation - get error from SDK
        if (JBridge.isNetworkAvailable()) {
          window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        } else {
          window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
        }
        _this.onBackPressed();
        return;
      }
      _this.localContent = JSON.parse(utils.decodeBase64(data[0]));
      if (_this.localContent.isAvailableLocally == true) {
        JBridge.logCourseDetailScreenEvent(_this.details.identifier, _this.details.pkgVersion, true);
        _this.renderChildren(identifier);
      } else {
        JBridge.logCourseDetailScreenEvent(_this.details.identifier, _this.details.pkgVersion, false);
        var callback22 = callbackMapper.map(function (data) {
          data = JSON.parse(data)
          if (data.status === "NOT_FOUND") {
            if (JBridge.isNetworkAvailable())
              JBridge.importCourse(identifier, "false", utils.getCallbacks(_this.getSpineStatus, "", _this.getSpineStatus));
            else
              window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
          }
        })

        JBridge.getContentImportStatus(identifier, callback22)
      }
      _this.contentDetails(JSON.parse(utils.decodeBase64(data[0])));

    });
    JBridge.getContentDetails(identifier, callback, false);
  }



  onStop = () => {
    window.__SharePopup.hide();
    console.log("ON STOP IN ResourceDetailActivity")
  }

  checkWhetherEnrolledCourse = () => {
    var enrolledIds = window.__enrolledCourses;
    var courseEnrollCheckCount = 0;
    enrolledIds.map((item) => {
      if (item.courseId == this.details.identifier) {
        var whatToSend = { "course": JSON.stringify(this.details) }
        var event = { tag: 'OPEN_EnrolledActivity', contents: whatToSend }
        window.__runDuiCallback(event);
        courseEnrollCheckCount = courseEnrollCheckCount + 1;
        return;
      }
    });
    if (courseEnrollCheckCount == 0) {
      this.replaceChild(this.idSet.totalContainer, this.getBody().render(), 0);
      this.checkContentLocalStatus(this.details.identifier);
    }
  }


  renderCourseChildren = () => {
    console.log("RENDRING BREKAUP", this.courseContent)
    var child;
    if (this.courseContent.children == undefined) {
      child = (<TextView
        height="300"
        width="match_parent"
        gravity="center"
        root="true"
        text={window.__S.ERROR_CONTENT_NOT_FOUND} />);
    }
    else {
      child = (<CourseCurriculum
        height="match_parent"
        width="match_parent"
        root="true"
        margin="0,0,0,12"
        brief={true}
        shouldGoForward={"gone"}
        content={this.courseContent.children} />);
      var isVisible = "gone";
      if (!this.details.isCreator)
        isVisible = "visible";
      Android.runInUI(this.set({
        id: this.idSet.enrollButtonId,
        visibility: isVisible
      }), 0);
    }

    var layout = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical">

        {child}

      </LinearLayout>
    )
    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }


  onPop = () => {

    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {

    if (window.__enrolledCourses == undefined) {
      if (window.__loggedInState == "GUEST") {
        window.__enrolledCourses = [];
        this.checkWhetherEnrolledCourse();
      } else {
        window.__LoaderDialog.show();
        var whatToSend = { "user_token": window.__user_accessToken, "api_token": window.__apiToken }
        var event = { "tag": "API_EnrolledCoursesList", contents: whatToSend };
        window.__runDuiCallback(event);
      }
    } else {
      this.checkWhetherEnrolledCourse();
    }

    if (this.details.isCreator) {
      console.log("from creation", this.details.isCreator)
      Android.runInUI(this.set({
        id: this.idSet.enrollButtonId,
        visibility: "gone"
      }), 0);
    }

  }


  handleStateChange = (state) => {

    var res = utils.processResponse(state);


    window.__LoaderDialog.hide();
    var status, response, responseCode, responseUrl;

    // if(state.response != ""){
    status = res.status;
    response = res.data; //JSON.parse(utils.decodeBase64(state.response.status[1]));
    responseCode = res.code;
    responseUrl = res.url;
    // }



    if (parseInt(responseCode) != 200) {
      return;
    }

    var result = response.result;

    if (res.err) {
      window.__Snackbar.show(res.err)
      return;
    }

    console.log("RESPONSE FOR IN COURSE INFO", state.responseFor)

    switch (state.responseFor + "") {
      case "API_EnrolledCoursesList":
        window.__enrolledCourses = response.result.courses;
        console.log("ENROLLED COURSES", window.__enrolledCourses);
        window.__LoaderDialog.hide();
        this.checkWhetherEnrolledCourse();
        break;

      default:


        break;


    }

  }

  shareContent = () => {

    console.log("SHARE POP UP CALLED", this.details);
    JBridge.logShareContentInitiateEvent("COURSES", "course", this.details.identifier, this.details.pkgVersion ? this.details.pkgVersion : this.details.contentData.pkgVersion);

    var shareCallback = callbackMapper.map(function (data) {

      window.__LoaderDialog.hide();


      if (data[0] != "failure") {
        var input = [
          {
            type: "text",
            data: window.__deepLinkUrl + "/public/#!/course/" + _this.details.identifier
          }
        ];


        var sharePopUp = (
          <SharePopup
            data={input}
            identifier={_this.details.identifier}
            type="COURSES"
          />
        )

        _this.replaceChild(_this.idSet.sharePopupContainer, sharePopUp.render(), 0);

        setTimeout(function () {
          window.__SharePopup.show();
        }, 200);
      } else {

        JBridge.showToast(window.__S.ERROR_CANT_SHARE_TRY_AGAIN, "short");

      }

    });

    JBridge.exportEcar(this.details.identifier, shareCallback);
    window.__LoaderDialog.show();

  }


  handleEnrollClick = (data) => {
    var whatToSend = { "course": this.state.data.value0.courseDetails }
    var event = { "tag": "OPEN_ViewBatchActivity", contents: whatToSend };
    window.__runDuiCallback(event);
    return;
  }


  onBackPressed = () => {
    JBridge.endEventLog(this.details.contentType, this.details.identifier, this.details.pkgVersion);
    var whatToSend = []
    var event = { tag: 'BACK_CourseInfoActivity', contents: whatToSend }
    window.__runDuiCallback(event);
  }

  getCurriculumnBrief = () => {
    var json = [];
    if (this.details.hasOwnProperty("contentTypesCount")) {
      var Curriculum = JSON.parse(this.details.contentTypesCount);

      var index = 0;
      var json = [];
      for (var item in Curriculum) {
        json.push({
          "count": Curriculum[item],
          "type": item
        })
      }
    }
    else {
      json.push({
        "count": "Not",
        "type": "Available"
      })
    }

    var items = json.map((item, i) => {
      return (<TextView
        style={window.__TextStyle.textStyle.HINT.REGULAR}
        text={(i == 0 ? "" : " | ") + item.count + " " + item.type} />)
    })

    return (
      <HorizontalScrollView
        width="match_parent"
        height="wrap_content">
        <LinearLayout
          padding="2,0,2,5"
          height="wrap_content"
          width="match_parent">
          {items}
        </LinearLayout>
      </HorizontalScrollView>);
  }

  handleMenuClick = (url) => {
    if (url == "ic_action_share_black") {

      this.shareContent();

    }
  }

  contentDetails = (data) => {
    var contentText = "";

    if(data.contentData && data.contentData.description){
      contentText+="<br>"+data.contentData.description + "<br><br>";
    }
    if(data.contentData && data.contentData.gradeLevel){
      contentText+="GRADE:<br>"+data.contentData.gradeLevel + "<br><br>";
    }
    if(data.contentData && data.contentData.subject){
      contentText+="SUBJECT:<br>"+data.contentData.subject + "<br><br>";
    }
    if(data.contentData && data.contentData.board){
      contentText+="BOARD:<br>"+data.contentData.board + "<br><br>";
    }
    if(data.contentData && data.contentData.language){
      contentText+="MEDIUM:<br>"+data.contentData.language;
    }

    var layout = (
      <LinearLayout
       id={this.idSet.readMore}
       width="match_parent"
       height="wrap_content"
       orientation="vertical">
      <LinearLayout
       width="match_parent"
       height="wrap_content"
       orientation="vertical"
       background={window.__Colors.WHITE_F2}>
       <TextView
         text={window.__S.ABOUT}
         margin="16,12,0,12"
         style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
        </LinearLayout>
       <CropParagraph
         height="match_parent"
         width="match_parent"
         margin="16,0,0,16"
         background={window.__Colors.WHITE_F2}
         privacyStatus={"false"}
         charToShow="20"
         contentText={contentText}
         editable={"false"} />
      </LinearLayout>
      )
      this.replaceChild(this.idSet.readMore,layout.render(),0);
  }

  getBody = () => {
    var btn = {
      text: window.__S.ENROLL_COURSE,
      onClick: this.handleEnrollClick
    }
    var buttonList = [btn];
    return (

      <LinearLayout
        root="true"
        width="match_parent"
        height="match_parent"
        background={window.__Colors.WHITE}
        orientation="vertical">

        <SimpleToolbar
          title=""
          width="match_parent"
          height="wrap_content"
          menuData={this.menuData}
          onMenuItemClick={this.handleMenuClick}
          showMenu="true"
          onBackPress={this.onBackPressed} />

        <LinearLayout
          id={this.idSet.parentContainer}
          height="match_parent"
          width="match_parent"
          orientation="vertical">
          <ScrollView
            height="0"
            weight="1"
            width="match_parent"
            fillViewPort="true">
            <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">
            <LinearLayout
              height="match_parent"
              width="match_parent"
              padding="16,24,16,16"
              orientation="vertical">

              <TextView
                width="wrap_content"
                height="wrap_content"
                margin="0,0,0,7"
                text={utils.firstLeterCapital(this.data.courseName)}
                style={window.__TextStyle.textStyle.HEADING.DARK} />


              <TextView
                height="wrap_content"
                width="match_parent"
                margin="0,0,0,12"
                text={this.data.courseDesc}/>
                </LinearLayout>

                <LinearLayout
                 id={this.idSet.readMore}/>
                 <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  background={window.__Colors.WHITE_F2}>
                 <TextView
                   margin="16,16,0,16"
                   text={window.__S.STRUCTURE}
                   style={window.__TextStyle.textStyle.CARD.TITLE.DARK} />
                   </LinearLayout>
                 <LinearLayout
                   height="match_parent"
                   width="match_parent"
                   padding="16,24,16,16"
                   orientation="vertical">


              {this.getCurriculumnBrief()}



              <LinearLayout
                id={this.idSet.descriptionContainer}
                height="wrap_content"
                width="match_parent"
                gravity="center"
                root="true"
                orientation="vertical">
                <ProgressBar
                  height="30"
                  width="30"
                  margin="20,20,20,20" />
                <TextView
                  id={this.idSet.downloadProgressText}
                  test="Fetching spine"
                  height="wrap_content"
                  gravity="center"
                  width="match_parent" />
              </LinearLayout>

            </LinearLayout>
            </LinearLayout>

          </ScrollView>
          <LinearLayout
            width="match_parent"
            height="wrap_content"
            visibility="gone"
            id={this.idSet.enrollButtonId}>
            <PageOption
              width="match_parent"
              buttonItems={buttonList} />
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>);

  }


  render() {
    this.layout = (

      <RelativeLayout
        width="match_parent"
        height="match_parent"
        clickable="true"
        root="true">

        <LinearLayout
          background={window.__Colors.WHITE}
          orientation="vertical"
          id={this.idSet.totalContainer}
          width="match_parent"
          height="match_parent" />


        <LinearLayout
          width="match_parent"
          height="match_parent"
          id={this.idSet.sharePopupContainer} />



      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseInfoActivity);
