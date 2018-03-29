var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var ProgressBar = require("@juspay/mystique-backend/src/android_views/ProgressBar");
var utils = require('../utils/GenericFunctions');
var FeatureButton = require('../components/Sunbird/FeatureButton');
var DownloadAllProgressButton = require('../components/Sunbird/DownloadAllProgressButton');
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");
var CropContentDetails = require('../components/Sunbird/CropContentDetails');
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");


window.R = require("ramda");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');
var HorizontalProgressBar = require('../components/Sunbird/HorizontalProgressBar');
var CourseProgress = require('../components/Sunbird/CourseProgress');
var FlagPopup = require('../components/Sunbird/FlagPopup');
var SharePopup = require('../components/Sunbird/core/SharePopup');


var utils = require('../utils/GenericFunctions');
var _this;
class CourseEnrolledActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.setIds([
      "descriptionContainer",
      "courseNotStartedOverLay",
      "sharePopupContainer",
      "startCourseBtn",
      "resumeCourseBtn",
      "simpleToolBarOverFlow",
      "batchDetailsContainer",
      "downloadAllProgressButton",
      "startOrResumeBtnContainer",
      "horizontalProgressBarContainer",
      "headerContainer",
      "readMore",
      "ratingBar",
      "ratingContainer",
      "creditsSection",
      "creditsText",
      "viewCreditsButton",
      "upDownBlueArrow"
    ]);
    this.state = state;
    this.screenName = "CourseEnrolledActivity"

    this.menuData = {
      url: [
        { imageUrl: "ic_action_share_black" }
      ]
    }

    this.menuData1 = {
      url: [
        { imageUrl: "ic_action_share_black" },
        { imageUrl: 'ic_action_overflow' }
      ]
    }
    _this = this;
    this.shouldCacheScreen = false; //set to true so that the screen does not reinitialize and send startEventLog telemetry
    this.enrolledCourses = window.__enrolledCourses;
    this.apiDetails = JSON.parse(state.data.value0.courseDetails); //Content details fetched from API
    this.courseDetails = {} //Content details fetched from Genie SDK
    this.courseContent = {}; //Children contents if any
    this.batchName = "";
    this.batchDescription = "";
    this.batchCreatedBy = "";
    this.popupMenu = window.__loggedInState == "GUEST" ? window.__S.DELETE : (window.__S.DELETE + "," + window.__S.FLAG);
    // array of all the children content ids
    this.subContentArray = [];
    this.downloadSize = 0; //size of all the contents to download
    this.creditsAndLicense = "";
    this.showCredits = true;
    console.log("details in CEA", this.apiDetails)
    this.showProgress = this.apiDetails.hasOwnProperty("courseName") ? "visible" : "gone";

    if (this.apiDetails.hasOwnProperty("courseId")) {
      this.baseIdentifier = this.apiDetails.courseId
    } else if (this.apiDetails.hasOwnProperty("contentId")) {
      this.baseIdentifier = this.apiDetails.contentId
    } else if (this.apiDetails.hasOwnProperty("identifier")) {
      this.baseIdentifier = this.apiDetails.identifier
    }

    this.name = this.apiDetails.name;
    this.downloadProgress = 0;

    if (window.__enrolledCourses != undefined) {
      window.__enrolledCourses.map((item) => {
        if (this.baseIdentifier == item.courseId) {
          this.enrolledCourses = item;
        }
      })
      if (this.enrolledCourses && this.enrolledCourses.leafNodesCount != null) {
        this.downloadProgress = utils.getCompletedPercentage(this.apiDetails.progress, this.apiDetails.leafNodesCount)
      }
    }

    this.data = {
      courseName: (this.name && this.name != "") ? this.name : (this.apiDetails ? this.apiDetails.courseName : ""),
      courseDesc: this.apiDetails ? this.apiDetails.courseDesc : "",
      completedProgress: (window.__currCourseDetails && window.__currCourseDetails.progress) ? window.__currCourseDetails.progress : this.downloadProgress
    };
    this.gotSpine = false; //called when fetching spine is complete
    this.cancelled = false; //called when fetching spine is cancelled
    if (window.__currCourseDetails == undefined) {
      window.__currCourseDetails = {};
      window.__currCourseDetails.courseId = this.baseIdentifier;
      window.__currCourseDetails.moduleName = this.apiDetails.identifier;
    }
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  onStop = () => {
    if (window.__SharePopup) {
      window.__SharePopup.hide();
    }
    console.log("ON STOP IN ResourceDetailActivity")
  }

  flagContent = (comment, selectedList) => {
    window.__LoaderDialog.show();
    console.log("flag request", this.apiDetails)
    console.log(comment, selectedList)
    var versionKey;
    if (this.courseDetails.hasOwnProperty("contentData") && this.courseDetails.contentData.hasOwnProperty("versionKey")) {
      versionKey = this.courseDetails.contentData.versionKey
    }
    else {
      versionKey = "0";
    }

    var request = {
      "flagReasons": selectedList,
      "flaggedBy": window.__userName,
      "versionKey": versionKey,
      "flags": [comment]
    }

    var whatToSend = {
      "user_token": window.__user_accessToken,
      "api_token": window.__apiToken,
      "requestBody": JSON.stringify(request),
      "identifier": this.baseIdentifier
    }
    var event = { "tag": "API_FlagCourse", contents: whatToSend };
    JBridge.logFlagClickInitiateEvent("COURSES", selectedList.toString(), comment, this.baseIdentifier, "course", this.courseDetails.contentData.pkgVersion);
    window.__runDuiCallback(event);

  }

  getSpineStatus = (res) => {
    console.log("inside getSpineStatus", res);

    var cb = res[0];
    var id = res[1];
    var data = JSON.parse(res[2]);
    if (id != this.baseIdentifier || this.gotSpine || this.cancelled) return;

    if (cb == "onDownloadProgress") {
      var textToShow = ""
      if (data.status == "NOT_FOUND") {
        window.__ContentLoaderDialog.hide();
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        this.onBackPressed();
        return;
      }

      var downloadedPercent = data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
      downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;
      console.log("downloadedPercent -> ", downloadedPercent);
      if (downloadedPercent < 100) {
        window.__ContentLoaderDialog.show();
        window.__ContentLoaderDialog.setClickCallback(this.handleContentLoaderCancelClick)
        window.__ContentLoaderDialog.updateProgressBar(downloadedPercent);
      }
    } else if (cb == "onContentImportResponse" && data.status == "IMPORT_COMPLETED") {
      window.__ContentLoaderDialog.updateProgressBar(100);
      window.__ContentLoaderDialog.hide();
      this.renderChildren(this.baseIdentifier);
      this.gotSpine = true;
    }
  }

  handleContentLoaderCancelClick = () => {
    JBridge.cancelDownload(this.baseIdentifier);
    this.cancelled = true;
    setTimeout(function () {
      window.__ContentLoaderDialog.hide();
      this.onBackPressed();
    }, 500);
  }

  renderChildren = (identifier) => {
    window.__ContentLoaderDialog.hide()
    var callback1 = callbackMapper.map(function (data) {
      data[0] = utils.jsonifyData(utils.decodeBase64(data[0]))
      _this.courseContent = JSON.parse(data[0]);
      _this.checkAllDownloadedStatus();
      console.log("childrenContent: ", _this.courseContent);

      window.__ContentLoaderDialog.hide();
      _this.renderCourseChildren();
      _this.changeOverFlow();
    });
    JBridge.getChildContent(identifier, callback1);
  }

  checkAllDownloadedStatus = () => {
    console.log("checkAllDownloadedStatus called");
    if (this.courseContent.hasOwnProperty("children") && this.courseContent.children != "") {
      _this.getSubcontentIds(_this.courseContent.children);
      if (_this.subContentArray.length > 0) {
        _this.replaceChild(_this.idSet.downloadAllProgressButton, _this.getDownloadAll(_this.downloadSize).render(), 0);
      }
      console.log("to be downloaded -> ", _this.subContentArray);
    }
  }

  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function (data) {
      if (data == "__failed") {
        console.log("JBridge.getContentDetails failed");
        //TODO implemented hack, actual implementation - get error from SDK
        if (JBridge.isNetworkAvailable()) {
          window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        } else {
          window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
        }
        _this.logTelelmetry(identifier, null, false);
        _this.onBackPressed();
        return;
      }
      data = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("this.courseDetails", data);

      _this.courseDetails = data;
      console.log("data", data);

      if (_this.courseDetails.hasOwnProperty("contentData") && _this.courseDetails.contentData.hasOwnProperty("me_averageRating")) {
        _this.updateRatings(_this.courseDetails.contentData.me_averageRating);
      } else {
        _this.updateRatings(0);
      }

      if (_this.courseDetails.hasOwnProperty("contentFeedback") && _this.courseDetails.contentFeedback.length != 0) {
        window.__RatingsPopup.initData(_this.courseDetails.identifier, "content-detail", _this.courseDetails.contentData.pkgVersion, _this.courseDetails.contentFeedback[0].rating, _this.courseDetails.contentFeedback[0].comments);
      } else {
        window.__RatingsPopup.initData(_this.courseDetails.identifier, "content-detail", _this.courseDetails.contentData.pkgVersion);
      }


        _this.contentDetails();

      _this.creditsDetail(data);


      if (data.isAvailableLocally == true) {
        _this.logTelelmetry(identifier, data.contentData.pkgVersion, data.isAvailableLocally);
        _this.renderChildren(identifier);
      } else {
        _this.logTelelmetry(identifier, data.contentData.pkgVersion, data.isAvailableLocally);
        if (JBridge.isNetworkAvailable()) {
          JBridge.importCourse(identifier, "false", utils.getCallbacks(_this.getSpineStatus, "", _this.getSpineStatus));
          _this.changeOverFlow();
        } else {
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
          _this.onBackPressed();
        }
      }
    });
    JBridge.getContentDetails(identifier, callback, true);
  }

  logTelelmetry = (id, pkgVersion, isAvailableLocally) => {
    if (_this.showProgress == "gone") {
      JBridge.logResourceDetailScreenEvent(id, pkgVersion, isAvailableLocally);
    } else {
      JBridge.logCourseDetailScreenEvent(id, pkgVersion, isAvailableLocally);
    }
    JBridge.startEventLog(this.courseDetails.contentType, id, pkgVersion);
  }

  handleModuleClick = (moduleName, module) => {
    var whatToSend = {
      "moduleName": moduleName,
      "moduleDetails": JSON.stringify(module)
    }
    var event = { "tag": "OPEN_ModuleDetailsActivity", contents: whatToSend };
    window.__runDuiCallback(event);
  }

  /*getBatchDetailSection = (name, description, createdBy) => {
    return (<LinearLayout
      width="match_parent"
      height="wrap_content"
      root="true"
      padding="0,8,0,8"
      orientation="vertical">

      <TextView
        width="match_parent"
        height="wrap_content"
        text={utils.firstLeterCapital(name)}
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK_16} />

      <TextView
        width="match_parent"
        height="wrap_content"
        text={description}
        style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULA_10} />

      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="horizontal">
        <TextView
          width="wrap_content"
          height="wrap_content"
          text={window.__S.CREATED_BY_SMALL + "  "}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULA_10} />
        <TextView
          width="wrap_content"
          height="wrap_content"
          text={createdBy}
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK_14} />
      </LinearLayout>
    </LinearLayout>)
  }*/

  handleStateChange = (state) => {

    var res = utils.processResponse(state);
    if (res.code != 504) {
      var response = res.data;//JSON.parse(utils.decodeBase64(state.response.status[1]))
      var responseCode = res.code;
      //
      // console.log("response \n\n",response)

      if (res.hasOwnProperty("err")) {
        //   window.__LoaderDialog.hide();
        //   window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION)
        //   responseData=tmp;
        // }else  if (response.params && response.params.err) {
        window.__LoaderDialog.hide();
        if (state.responseFor == "API_FlagCourse") {
          window.__Snackbar.show(window.__S.CONTENT_FLAG_FAIL);
          _this.onBackPressed();
        }
        else
          console.log(window.__S.ERROR_SERVER_MESSAGE + res.err)
        return;
      }

      if (state.responseFor == "API_Get_Batch_Details") {
        console.log("batch details", response);
        var batch = response.result.response;
        var curr_Date = new Date();
        var start_date = new Date(batch.startDate);
        if (start_date > curr_Date) {
          Android.runInUI(this.set({
            id: this.idSet.courseNotStartedOverLay,
            visibility: "visible"
          }), 0);

        }
        var description = "";
        description += utils.prettifyDate(batch.startDate);
        window.__currCourseDetails.endDate = batch.endDate;
        if (batch.endDate && batch.endDate != null && batch.endDate != undefined) {
          description += " - ";
          description += utils.prettifyDate(batch.endDate);
        }
        this.batchDescription = description;
        var name = batch.name;
        this.batchName = batch.name;
        var whatToSend = {
          "user_token": batch.createdBy,
          "api_token": window.__apiToken
        }
        var event = { "tag": "API_Get_Batch_Creator_name", contents: whatToSend };
        window.__runDuiCallback(event);
        console.log("batch created token", batch.createdBy)
      } else if (state.responseFor == "API_FlagCourse") {
        if (responseCode == 200) {
          if (response[0] == "successful") {
            JBridge.logFlagStatusEvent(this.baseIdentifier, "COURSES", true, this.courseDetails.contentData.pkgVersion);
            setTimeout(function () {
              window.__Snackbar.show(window.__S.CONTENT_FLAGGED_MSG)
              window.__BNavFlowRestart();
              _this.onBackPressed();
              window.__LoaderDialog.hide();
            }, 2000)
          }
        } else {
          JBridge.logFlagStatusEvent(this.baseIdentifier, "COURSES", false, this.courseDetails.contentData.pkgVersion);
          window.__LoaderDialog.hide();
          window.__Snackbar.show(window.__S.CONTENT_FLAG_FAIL);
          _this.onBackPressed();

        }
      } else if (state.responseFor == "API_Get_Batch_Creator_name") {
        var user_details = response.result.response;
        console.log("user details", user_details)
        console.log(this.batchName, this.batchDescription)
        var userName = user_details.firstName + " " + (user_details.lastName || " ")
        this.batchCreatedBy = userName;
        this.contentDetails();

        this.replaceChild(this.idSet.headerContainer, this.getHeader().render(), 0);
        //this.replaceChild(_this.idSet.batchDetailsContainer, _this.getBatchDetailSection(this.batchName, this.batchDescription, userName).render(), 0);
        if (window.__currCourseDetails && window.__currCourseDetails.hasOwnProperty("reload") && window.__currCourseDetails.reload) {
          this.refeshCourseProgressApi();
        }
      } else if (state.responseFor == "API_Reload_Course") {
        var course_details = response.result;
        console.log("reloaded course data -> ", course_details);
        var progress = 0;
        course_details.courses.map((item, i) => {
          if (item.courseId == this.baseIdentifier) {
            progress = utils.getCompletedPercentage(item.progress, item.leafNodesCount);
            this.data.completedProgress = progress;
            window.__currCourseDetails.progress = progress;
          }
        });
        window.__currCourseDetails.reload = false;
        this.replaceChild(this.idSet.headerContainer, this.getHeader().render(), 0);
        var layout = (
          <HorizontalProgressBar
            width="match_parent"
            currentProgress={progress + ""}
            totalProgress={this.data.totalProgress}
            visibility={this.showProgress} />
        );
        this.replaceChild(this.idSet.horizontalProgressBarContainer, layout.render(), 0);
      }
    }
    else {
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.TIME_OUT)
    }
  }

  getHeader = () => {
    var isTextbook = this.apiDetails.contentType == "textbook";
    var batchCreatedBy = "";
    if(this.apiDetails && this.apiDetails.owner)
     batchCreatedBy = this.apiDetails.owner;
     else if(this.data && this.data.owner)
      batchCreatedBy = this.apiDetails.owner;
     else if(this.apiDetails && this.apiDetails.contentData && this.apiDetails.contentData.owner)
      batchCreatedBy = this.apiDetails.contentData.owner;

    return (
      <CourseProgress
        height="wrap_content"
        width="wrap_content"
        content={this.data}
        textbook={isTextbook}
        title={this.data.courseName || this.apiDetails.name || this.apiDetails.contentData.name}
        batchCreatedBy={batchCreatedBy}
        onResumeClick={this.handleCourseResume}
        visibility={this.showProgress} />
    );
  }

  renderCourseChildren = () => {
    var layout;
    JBridge.logRollupEvent("COURSE",window.__currCourseDetails.moduleName ,"","","");

    if (this.courseContent.children == undefined) {
      layout = <TextView
        height="300"
        width="match_parent"
        gravity="center"
        root="true"
        text={window.__S.ERROR_CONTENT_NOT_FOUND} />
      var cmd = this.set({
        id: this.idSet.featureButton,
        visibility: "gone"

      });
      Android.runInUI(cmd, 0);
    } else {
      layout = (
        <CourseCurriculum
          height="match_parent"
          width="match_parent"
          root="true"
          margin="0,0,0,12"
          brief={true}
          title=""
          onClick={this.handleModuleClick}
          content={this.courseContent.children} />
      )
    }
    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }


  onBackPressed = () => {
    window.__currCourseDetails = undefined;
    window.__ContentLoaderDialog.hide();

    if (window.__SharePopup != undefined && window.__SharePopup.getVisible()) {
      window.__SharePopup.hide();
      return;
    }
    if (window.__ContentLoaderDialog.getVisible()) {
      window.__ContentLoaderDialog.hide();
      return;
    }
   if (window.__RatingsPopup.getVisibility()) {
      window.__RatingsPopup.hide();
    } else {
     JBridge.endEventLog(this.courseDetails.contentType, this.courseDetails.identifier, (this.courseDetails.contentData && this.courseDetails.contentData.pkgVersion) ? this.courseDetails.contentData.pkgVersion : null);
    var event = { tag: 'BACK_CourseEnrolledActivity', contents: [] }
    window.__runDuiCallback(event);
  }
  }

  refeshCourseProgressApi = () => {
    var whatToSend = {
      "user_token": window.__user_accessToken,
      "api_token": window.__apiToken
    }
    var event = { "tag": "API_Reload_Course", contents: whatToSend };
    window.__runDuiCallback(event);
  }

  afterRender = () => {
    console.log("details", this.apiDetails);
    console.log("ratings idSet -> ", this.idSet.ratingBar);

    JBridge.setRating(this.idSet.ratingBar, 0);
    if ((this.apiDetails.hasOwnProperty("mimeType")) && (this.apiDetails.mimeType.toLocaleLowerCase() == "application/vnd.ekstep.content-collection")) {
      var cmd = this.set({
        id: this.idSet.startCourseBtn,
        visibility: "gone"
      });

      cmd += this.set({
        id: this.idSet.resumeCourseBtn,
        visibility: "gone"
      });
      Android.runInUI(cmd, 0);

    }
    if (this.enrolledCourses && this.enrolledCourses.hasOwnProperty("lastReadContentId") && (this.enrolledCourses.lastReadContentId != null)) {
      var cmd = this.set({
        id: this.idSet.startCourseBtn,
        visibility: "gone"
      });
      cmd += this.set({
        id: this.idSet.resumeCourseBtn,
        visibility: "visible"
      });

      Android.runInUI(cmd, 0);
    }

    this.checkContentLocalStatus(this.baseIdentifier);

    if (this.apiDetails.batchId || this.enrolledCourses.batchId) {
      var batchId = this.apiDetails.batchId ? this.apiDetails.batchId : this.enrolledCourses.batchId;
      var whatToSend = {
        "user_token": window.__user_accessToken,
        "api_token": window.__apiToken,
        "batch_id": batchId
      }
      var event = { "tag": "API_Get_Batch_Details", contents: whatToSend };
      if (JBridge.isNetworkAvailable())
        window.__runDuiCallback(event);
      else
        window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
    }
  }

  overFlowCallback = (params) => {
    window.__LoaderDialog.show();
    if (params == 0) {
      var callback = callbackMapper.map(function (response) {
        window.__LoaderDialog.hide();

        if (response[0] == "successful") {

          _this.onBackPressed();
        }
      });
      JBridge.deleteContent(this.baseIdentifier, callback);
    } else if (params == 1) {
      console.log("in flag rda");
      JBridge.logFlagScreenEvent("COURSES", this.baseIdentifier, this.courseDetails.contentData.pkgVersion);
      window.__LoaderDialog.hide();
      window.__FlagPopup.show();
    }
  }

  handleMenuClick = (url) => {
    console.log("menu item clicked", url);
    JBridge.logShareContentInitiateEvent("LIBRARY", _this.showProgress == "gone" ? "content" : "course", this.baseIdentifier, this.courseDetails.contentData.pkgVersion);

    if (url == "ic_action_share_black") {

      var contentType = _this.showProgress == "gone" ? "content" : "course";
      var callback = callbackMapper.map(function (data) {

        window.__LoaderDialog.hide();

        var input;
        if (data[0] != "failure") {
          input = [{
            type: "text",
            data: window.__deepLinkUrl + "/public/#!/" + contentType + "/" + _this.baseIdentifier

          }, {
            type: "file",
            data: "file://" + data[0]

          }];
        }
        else {
          input = [{
            type: "text",
            data: window.__deepLinkUrl + "/public/#!/" + contentType + "/" + _this.baseIdentifier

          }];
        }
        var type = _this.showProgress == "gone" ? "LIBRARY" : "COURSES";
        var sharePopUp = (
          <SharePopup
            data={input}
            identifier={_this.baseIdentifier}
            type={type}
          />
        )


        _this.replaceChild(_this.idSet.sharePopupContainer, sharePopUp.render(), 0);

        setTimeout(function () {
          window.__SharePopup.show();
        }, 200);
      });
      JBridge.exportEcar(this.baseIdentifier, callback);
      window.__LoaderDialog.show();


    }
  }

  handleResumeClick = () => {
    console.log(this.apiDetails, "handleResumeClick this.apiDetails")
    var id;
    if (this.enrolledCourses && this.enrolledCourses.hasOwnProperty('lastReadContentId') && this.enrolledCourses.lastReadContentId != null) {
      console.log("this.enrolledCourses.lastReadContentId", this.enrolledCourses.lastReadContentId);
      id = this.enrolledCourses.lastReadContentId;
    }
    else if (this.apiDetails.hasOwnProperty("lastReadContentId") && this.apiDetails.lastReadContentId != null) {
      console.log("this.apiDetails.lastReadContentId", this.apiDetails.lastReadContentId);
      id = this.apiDetails.lastReadContentId
    }
    else if (!(this.courseContent.children == undefined)) {
      console.log("children details", this.courseContent.children)
      id = this.courseContent.children[0].identifier;
    }
    else {
      window.__Snackbar.show(window.__S.ERROR_NO_RESUME_CONTENT_AVAILABLE)
    }
    console.log("id before JBridge.getChildContent ", id);
    console.log("courseContent children", this.courseContent.children);
    if (id) {

      var item = this.getContentById(id, this.courseContent.children);
      console.log("get content by id", item);
      if (item == "failed")
        window.__Snackbar.show(window.__S.ERROR_NO_RESUME_CONTENT_AVAILABLE)
      else
        this.handleModuleClick(item.contentData.name, item)

    } else window.__Snackbar.show(window.__S.ERROR_NO_RESUME_CONTENT_AVAILABLE)
  }

  getContentById = (id, content) => {
    var ret = "failed"
    content.map((item, i) => {
      if (item.identifier == id) ret = item;
      else if (item.children != undefined) {
        var temp = _this.getContentById(id, item.children)
        if (temp != "failed")
          ret = temp;
      }
    })
    return ret
  }

  getSubcontentIds = (content) => {
    content.map((item, i) => {
      if (item.children == undefined && item.isAvailableLocally != undefined && !item.isAvailableLocally) {
        if (item.contentData.hasOwnProperty("size") && (item.contentData.size != "" || item.contentData.size != null || item.contentData.size != undefined)) {
          _this.downloadSize += isNaN(Number(item.contentData.size)) ? 0 : Number(item.contentData.size);
        }
        _this.subContentArray.push(item.identifier);
      } else if (item.children != undefined) {
        _this.getSubcontentIds(item.children)
      }
    })
  }

  changeOverFlow = () => {
    var toolbar = (<SimpleToolbar
      title=""
      height="wrap_content"
      width="match_parent"
      menuData={this.menuData1}
      popupMenu={this.popupMenu}
      onMenuItemClick={this.handleMenuClick}
      overFlowCallback={this.overFlowCallback}
      showMenu="true"
      onBackPress={this.onBackPressed} />)

    this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
  }
  getLineSeperator = () => {
    return (<LinearLayout
      width="match_parent"
      height="2"
      background={window.__Colors.PRIMARY_BLACK_22} />)
  }


  handleDownloadAllClick = () => {
    console.log("children", this.subContentArray);
    this.__DownloadAllProgressButton.update(this.subContentArray);
    window.__DownloadAllPopup.hide();
  }

  showDownloadAllPopUp = () => {
    window.__DownloadAllPopup.props.totalSize = this.downloadSize;
    window.__DownloadAllPopup.props.buttonClick = this.handleDownloadAllClick;
    window.__DownloadAllPopup.show();
  }

  updateRatings = (rating) => {
    var r = rating ? rating : 0;
    var layout = (
      <LinearLayout
        width="wrap_content"
        height="wrap_content"
        onClick={() => { if (window.__loggedInState != "GUEST") { window.__RatingsPopup.show() } else { window.__Snackbar.show(window.__S.SIGNIN_TO_USE_FEATURE) }}}>
        <RatingBar
          id={this.idSet.ratingBar}
          width="wrap_content"
          height="wrap_content" />
      </LinearLayout>
    );
    _this.replaceChild(_this.idSet.ratingContainer, layout.render(), 0);
    JBridge.setRating(this.idSet.ratingBar, r);
  }

  getDownloadAll = (size) => {
    var sizeText = "";
    if (size != undefined) {
      sizeText = "(" + utils.formatBytes(size) + ")";
    }
    this.__DownloadAllProgressButton = (
      <DownloadAllProgressButton
        width="wrap_content"
        buttonText={window.__S.DOWNLOAD_ALL_wSIZE.format(sizeText)}
        hideDivider="gone"
        handleButtonClick={this.showDownloadAllPopUp} />
    );
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="16,0,16,16">
        {this.__DownloadAllProgressButton}
      </LinearLayout>
    );
  }

  contentDetails = () => {
    var data = this.courseDetails;
    var screenWidth = JBridge.getScreenWidth().toString();
    var contentText = "";
    if(data.contentData && data.contentData.description){
      contentText+="<br>"+data.contentData.description + "<br><br>";
    }
    if(data.contentData && data.contentData.gradeLevel){
      contentText+="<b>" + window.__S.GRADE + "</b><br>"+data.contentData.gradeLevel.toString().replace(/,/g,", ") + "<br><br>";
    }
    if(data.contentData && data.contentData.subject){
      contentText+="<b>" + window.__S.SUBJECT + "</b><br>"+data.contentData.subject.toString().replace(/,/g,", ") + "<br><br>";
    }
    if(data.contentData && data.contentData.board){
      contentText+="<b>" + window.__S.BOARD + "</b><br>"+data.contentData.board.toString().replace(/,/g,", ") + "<br><br>";
    }
    if(data.contentData && data.contentData.language){
      contentText+="<b>" + window.__S.MEDIUM_2 + "</b><br>"+data.contentData.language.toString().replace(/,/g,", ");
    }
    if(this.batchName != "" && this.batchDescription != "" && this.batchCreatedBy != ""){
      contentText+="<br><br><b>" + window.__S.BATCH_DETAILS + "</b><br>"+this.batchName+"<br>"+this.batchDescription+"<br>"+window.__S.CREATED_BY_SMALL+" "+this.batchCreatedBy;
    }
    var layout = (
      <LinearLayout
       width="match_parent"
       height="wrap_content"
       orientation="vertical">
      <LinearLayout
       width={screenWidth}
       height="wrap_content"
       background={window.__Colors.WHITE_F2}>
       <TextView
         text={window.__S.ABOUT}
         width="match_parent"
         margin="16,12,0,12"
         style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
        </LinearLayout>
       <CropContentDetails
         height="wrap_content"
         width="match_parent"
         margin="16,0,16,16"
         contentDescription={data.contentData.description ? data.contentData.description : " "}
         contentText={contentText}/>
      </LinearLayout>
      )
      this.replaceChild(this.idSet.readMore,layout.render(),0);
  }

  creditsDetail = (data) => {
    if(data.contentData.license || data.contentData.credits){
      if(data.contentData.credits){
        this.creditsAndLicense += "<br><b>" + window.__S.CREDITS + "</b><br>"+data.contentData.credits.toString().replace(/,/g,", ");
      }
      if(data.contentData.license){
        this.creditsAndLicense += "<br><b>" + window.__S.LICENSE + "</b><br>"+data.contentData.license;
      }
      var creditsLayout = (<LinearLayout
                              width="match_parent"
                              height="wrap_content"
                              orientation="vertical"
                              visibility="visible">
                          <LinearLayout
                              width="1000"
                              height="wrap_content"
                              orientation="vertical"
                              margin="0,8,0,0"
                              background={window.__Colors.WHITE_F2}>
                          <TextView
                            id={this.idSet.creditsText}
                            textFromHtml={""}
                            visibility="gone"
                            margin="16,0,0,0"
                            />
                            <LinearLayout
                              orientation="horizontal">
                          <TextView
                            id={this.idSet.viewCreditsButton}
                            text={window.__S.VIEW_CREDITS_INFO}
                            margin="16,8,0,8"
                            color={"#FF0079FF"}
                            onClick={this.viewCreditsButtonClick}/>
                            <ImageView
                              width="10"
                              height="10"
                              id={this.idSet.upDownBlueArrow}
                              gravity="center_vertical"
                              margin="8,14,0,8"
                              imageUrl="ic_action_down_blue" />
                              </LinearLayout>
                          </LinearLayout>
                        </LinearLayout>)
        this.replaceChild(this.idSet.creditsSection,creditsLayout.render(),0);
    }
  }

  viewCreditsButtonClick = () => {
    if(!this.showCredits){
      var cmd = this.set({
        id: this.idSet.creditsText,
        textFromHtml: "",
        visibility: "gone"
      })
        cmd+= this.set({
        id: this.idSet.viewCreditsButton,
        text: window.__S.VIEW_CREDITS_INFO
      })
      cmd+= this.set({
        id: this.idSet.upDownBlueArrow,
        visibility:"visible",
        imageUrl:"ic_action_down_blue"
      })

      Android.runInUI(cmd, 0);
    } else{
      var cmd = this.set({
        id: this.idSet.creditsText,
        textFromHtml: this.creditsAndLicense,
        visibility: "visible"
      })
     cmd+= this.set({
        id: this.idSet.viewCreditsButton,
        text: window.__S.HIDE_CREDITS_INFO
      })
    cmd+= this.set({
      id: this.idSet.upDownBlueArrow,
      visibility:"visible",
      imageUrl: "ic_action_up_blue"
    })

      Android.runInUI(cmd, 0);
    }
    this.showCredits = !this.showCredits;
  }


  render() {
    this.layout = (
      <RelativeLayout
        height="match_parent"
        width="match_parent"
        clickable="true"
        root="true">

        <LinearLayout
          root="true"
          width="match_parent"
          height="match_parent"
          background={window.__Colors.WHITE}
          orientation="vertical">
          <LinearLayout
            root="true"
            width="match_parent"
            height="wrap_content"
            id={this.idSet.simpleToolBarOverFlow}>

            <SimpleToolbar
              title=""
              height="wrap_content"
              width="match_parent"
              menuData={this.menuData}
              popupMenu={this.popupMenu}
              onMenuItemClick={this.handleMenuClick}
              overFlowCallback={this.overFlowCallback}
              showMenu="true"
              onBackPress={this.onBackPressed} />
          </LinearLayout>

          <LinearLayout
            width="match_parent"
            id={this.idSet.horizontalProgressBarContainer}>

            <HorizontalProgressBar
              width="match_parent"
              currentProgress={this.data.completedProgress}
              totalProgress={this.data.totalProgress}
              visibility={this.showProgress} />
          </LinearLayout>

          <RelativeLayout
            height="match_parent"
            width="match_parent">

            <LinearLayout
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
                  root="true"
                  orientation="vertical">

                  <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    padding="16,24,16,16"
                    layoutTransition = "true"
                    orientation="vertical">
                    <LinearLayout
                      width="match_parent"
                      id={this.idSet.headerContainer}>

                      {this.getHeader()}
                    </LinearLayout>
                    <LinearLayout
                      width="wrap_content"
                      height="wrap_content"
                      layoutTransition="true"
                      id={this.idSet.ratingContainer} />

                  </LinearLayout>
                  <LinearLayout
                    id={this.idSet.readMore} />

                  <LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    orientation="vertical"
                    background={window.__Colors.WHITE_F2}>
                    <TextView
                      width="wrap_content"
                      height="wrap_content"
                      margin="16,16,0,16"
                      style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
                      text={window.__S.STRUCTURE} />
                  </LinearLayout>
                  <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    padding="16,24,16,16"
                    orientation="vertical">


                    <LinearLayout
                      id={this.idSet.descriptionContainer}
                      height="match_parent"
                      width="match_parent"
                      gravity="center"
                      root="true"
                      orientation="vertical">

                      <TextView
                        margin="0,50,0,0"
                        width="wrap_content"
                        height="wrap_content"
                        gravity="center"
                        text={window.__S.LOADING_CONTENT} />

                      <ProgressBar
                        margin="0,10,0,0"
                        gravity="center"
                        width="20"
                        height="20" />
                    </LinearLayout>
                  </LinearLayout>
                  <LinearLayout
                    width="match_parent"
                    height="match_parent"
                    id={this.idSet.creditsSection} />
                </LinearLayout>
              </ScrollView>

              <LinearLayout
                height="2"
                width="match_parent"
                margin="0,0,0,16"
                background={window.__Colors.PRIMARY_BLACK_22} />

              <RelativeLayout
                height="wrap_content"
                width="match_parent"
                id={this.idSet.startOrResumeBtnContainer}>

                <FeatureButton
                  clickable="true"
                  margin="16,0,16,16"
                  width="match_parent"
                  height="48"
                  id={this.idSet.startCourseBtn}
                  visibility="visible"
                  background={window.__Colors.PRIMARY_ACCENT}
                  text={window.__S.START_COURSE}
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                  buttonClick={this.handleResumeClick} />

                <FeatureButton
                  clickable="true"
                  margin="16,16,16,16"
                  width="match_parent"
                  height="48"
                  visibility="gone"
                  id={this.idSet.resumeCourseBtn}
                  background={window.__Colors.PRIMARY_ACCENT}
                  text={window.__S.RESUME + " " + window.__S.COURSE}
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                  buttonClick={this.handleResumeClick} />
              </RelativeLayout>

              <LinearLayout
                width="match_parent"
                id={_this.idSet.downloadAllProgressButton} />
            </LinearLayout>

            <LinearLayout
              id={this.idSet.courseNotStartedOverLay}
              height="match_parent"
              width="match_parent"
              visibility="gone"
              clickable="true"
              background={window.__Colors.WHITE_90}
              gravity="center">

              <TextView
                gravity="center"
                width="match_parent"
                height="match_parent"
                style={window.__TextStyle.textStyle.NOTHING}
                text={window.__S.ERROR_BATCH_NOT_STARTED} />
            </LinearLayout>
          </RelativeLayout>
        </LinearLayout>

        <FlagPopup
          onConfirm={this.flagContent} />

        <LinearLayout
          id={this.idSet.sharePopupContainer}
          height="match_parent"
          width="match_parent" />
      </RelativeLayout>
    );
    return this.layout.render();
  }
}

module.exports = Connector(CourseEnrolledActivity);


/*
** Format of data from API call
** stored in this.apiDetails

{
  "dateTime": "2017-11-09 06:08:37:401+0000",
  "identifier": "c075b917e376bf1e7c4c860adc50b9ddae882fa2a3c0dc4dde6484301c85da55",
  "enrolledDate": "2017-11-09 06:08:37:401+0000",
  "contentId": "do_212371599518752768174",
  "active": true,
  "description": "zz",
  "courseLogoUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212371599518752768174/artifact/maths-33_1504506840920.thumb.png",
  "batchId": "01237162672371302450",
  "userId": "efac9d25-9cdf-4222-8153-930466aa0cef",
  "courseName": "y8",
  "leafNodesCount": 1,
  "progress": 0,
  "id": "c075b917e376bf1e7c4c860adc50b9ddae882fa2a3c0dc4dde6484301c85da55",
  "tocUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212371599518752768174/artifact/do_212371599518752768174toc.json",
  "courseId": "do_212371599518752768174",
  "status": 0
}

** Format of content data from Genie SDK (getContentDetails)
** stored in this.courseDetails

{
  "basePath": "/storage/emulated/0/.Sunbird/content/do_212371599518752768174",
  "contentData": {
    "appIcon": "do_212371599518752768174/maths-33_1504506840920.png",
    "contentDisposition": "inline",
    "contentEncoding": "gzip",
    "contentType": "Course",
    "createdOn": "2017-11-09T05:23:39.379+0000",
    "description": "zz",
    "gradeLevel": [
      "Kindergarten"
    ],
    "identifier": "do_212371599518752768174",
    "language": [
      "English"
    ],
    "lastPublishedOn": "2017-11-09T05:36:18.516+0000",
    "mimeType": "application/vnd.ekstep.content-collection",
    "name": "y8",
    "osId": "org.ekstep.quiz.app",
    "pkgVersion": "1.0",
    "resourceType": "Story",
    "status": "Live",
    "subject": "domain",
    "versionKey": "1510205775633"
  },
  "contentType": "course",
  "identifier": "do_212371599518752768174",
  "isAvailableLocally": true,
  "isUpdateAvailable": false,
  "lastUpdatedTime": 1517987212000,
  "mimeType": "application/vnd.ekstep.content-collection",
  "referenceCount": 1,
  "sizeOnDevice": 1157715
}

** Format of child data for a content from Genie SDK (getChildContent)
** stored in this.courseContent

{
  "basePath": "/storage/emulated/0/.Sunbird/content/do_212371599518752768174",
  "children": [
    {
      "basePath": "/storage/emulated/0/.Sunbird/content/do_2123695414072033281534",
      "children": [
        {
          "basePath": "/storage/emulated/0/.Sunbird/content/do_2123695430246481921535",
          "children": [
            {
              "basePath": "/storage/emulated/0/.Sunbird/content/do_2123695406756003841533",
              "contentData": {
                "artifactUrl": "do_2123695406756003841533/uploadcontent_1509953724635.zip",
                "contentDisposition": "inline",
                "contentEncoding": "gzip",
                "contentType": "Story",
                "createdOn": "2017-11-06T07:34:55.752+0000",
                "downloadUrl": "do_2123695406756003841533/uploadcontent_1509953724635.zip",
                "identifier": "do_2123695406756003841533",
                "language": [
                  "English"
                ],
                "lastPublishedOn": "2017-11-06T14:49:13.877+0000",
                "mimeType": "application/vnd.ekstep.ecml-archive",
                "name": "Amit_Story_Content_nov_06_101",
                "osId": "org.ekstep.quiz.app",
                "pkgVersion": "4.0",
                "publisher": "EkStep",
                "resourceType": "Story",
                "size": "717947.0",
                "status": "Live",
                "subject": "domain",
                "variants": {
                  "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123695406756003841533/amit_story_content_nov_06_101_1509979754106_do_2123695406756003841533_4.0_spine.ecar",
                    "size": 952
                  }
                },
                "versionKey": "1509979754365"
              },
              "contentType": "story",
              "hierarchyInfo": [
                {
                  "contentType": "course",
                  "identifier": "do_212371599518752768174"
                },
                {
                  "contentType": "collection",
                  "identifier": "do_2123695414072033281534"
                },
                {
                  "contentType": "courseunit",
                  "identifier": "do_2123695430246481921535"
                }
              ],
              "identifier": "do_2123695406756003841533",
              "isAvailableLocally": false,
              "isUpdateAvailable": false,
              "lastUpdatedTime": 1517985074000,
              "mimeType": "application/vnd.ekstep.ecml-archive",
              "referenceCount": 1,
              "sizeOnDevice": 756051
            }
          ],
          "contentData": {
            "contentDisposition": "inline",
            "contentEncoding": "gzip",
            "contentType": "CourseUnit",
            "createdOn": "2017-11-06T07:39:42.501+0000",
            "description": "Amit_Collection_Content_Course_Unit_nov_06_101",
            "identifier": "do_2123695430246481921535",
            "language": [
              "English"
            ],
            "lastPublishedOn": "2017-11-09T05:36:17.202+0000",
            "mimeType": "application/vnd.ekstep.content-collection",
            "name": "Amit_Collection_Content_Course_Unit_nov_06_101",
            "osId": "org.ekstep.launcher",
            "pkgVersion": "5.0",
            "resourceType": "Story",
            "size": "718321.0",
            "status": "Live",
            "subject": "domain",
            "variants": {
              "spine": {
                "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123695430246481921535/amit_collection_content_course_unit_nov_06_101_1510205778187_do_2123695430246481921535_5.0_spine.ecar",
                "size": 1324
              }
            },
            "versionKey": "1510205778352"
          },
          "contentType": "courseunit",
          "hierarchyInfo": [
            {
              "contentType": "course",
              "identifier": "do_212371599518752768174"
            },
            {
              "contentType": "collection",
              "identifier": "do_2123695414072033281534"
            },
            {
              "contentType": "courseunit",
              "identifier": "do_2123695430246481921535"
            }
          ],
          "identifier": "do_2123695430246481921535",
          "isAvailableLocally": true,
          "isUpdateAvailable": false,
          "lastUpdatedTime": 1517987212000,
          "mimeType": "application/vnd.ekstep.content-collection",
          "referenceCount": 1,
          "sizeOnDevice": 759431
        }
      ],
      "contentData": {
        "contentDisposition": "inline",
        "contentEncoding": "gzip",
        "contentType": "Collection",
        "contentTypesCount": "{\"CourseUnit\":1,\"Story\":1}",
        "createdOn": "2017-11-06T07:36:25.059+0000",
        "identifier": "do_2123695414072033281534",
        "language": [
          "English"
        ],
        "lastPublishedOn": "2017-11-06T14:49:15.436+0000",
        "mimeType": "application/vnd.ekstep.content-collection",
        "name": "Amit_Collection_Content_nov_06_101",
        "osId": "org.ekstep.quiz.app",
        "pkgVersion": "4.0",
        "publisher": "EkStep",
        "resourceType": "Story",
        "size": "718552.0",
        "status": "Live",
        "subject": "domain",
        "variants": {
          "spine": {
            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123695414072033281534/amit_collection_content_nov_06_101_1509979757030_do_2123695414072033281534_4.0_spine.ecar",
            "size": 1556
          }
        },
        "versionKey": "1509979757203"
      },
      "contentType": "collection",
      "hierarchyInfo": [
        {
          "contentType": "course",
          "identifier": "do_212371599518752768174"
        },
        {
          "contentType": "collection",
          "identifier": "do_2123695414072033281534"
        }
      ],
      "identifier": "do_2123695414072033281534",
      "isAvailableLocally": true,
      "isUpdateAvailable": false,
      "lastUpdatedTime": 1517987212000,
      "mimeType": "application/vnd.ekstep.content-collection",
      "referenceCount": 1,
      "sizeOnDevice": 764808
    }
  ],
  "contentData": {
    "appIcon": "do_212371599518752768174/maths-33_1504506840920.png",
    "contentDisposition": "inline",
    "contentEncoding": "gzip",
    "contentType": "Course",
    "createdOn": "2017-11-09T05:23:39.379+0000",
    "description": "zz",
    "gradeLevel": [
      "Kindergarten"
    ],
    "identifier": "do_212371599518752768174",
    "language": [
      "English"
    ],
    "lastPublishedOn": "2017-11-09T05:36:18.516+0000",
    "mimeType": "application/vnd.ekstep.content-collection",
    "name": "y8",
    "osId": "org.ekstep.quiz.app",
    "pkgVersion": "1.0",
    "resourceType": "Story",
    "status": "Live",
    "subject": "domain",
    "versionKey": "1510205775633"
  },
  "contentType": "course",
  "hierarchyInfo": [
    {
      "contentType": "course",
      "identifier": "do_212371599518752768174"
    }
  ],
  "identifier": "do_212371599518752768174",
  "isAvailableLocally": true,
  "isUpdateAvailable": false,
  "lastUpdatedTime": 1517987212000,
  "mimeType": "application/vnd.ekstep.content-collection",
  "referenceCount": 1,
  "sizeOnDevice": 1157715
}

*/
