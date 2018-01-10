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
      "featureButton1",
      "featureButton2",
      "simpleToolBarOverFlow",
      "batchDetailsContainer"
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
    this.shouldCacheScreen = false;
    this.courseContent = "";

    this.enrolledCourses = window.__enrolledCourses;


    this.details = JSON.parse(state.data.value0.courseDetails);

    this.courseDetails = {}
    this.batchName = "";
    this.batchDescription = "";

    this.popupMenu = window.__S.DELETE;

    this.popupMenu = window.__S.DELETE + "," + window.__S.FLAG;
    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;
    console.log("details in CEA", this.details)
    this.showProgress = this.details.hasOwnProperty("mimeType") && this.details.contentType == "application/vnd.ekstep.content-collection" ? "gone" : "visible";



    if (this.details.hasOwnProperty("courseId")) {
      this.baseIdentifier = this.details.courseId
    }
    else if (this.details.hasOwnProperty("contentId")) {
      this.baseIdentifier = this.details.contentId
    }
    else if (this.details.hasOwnProperty("identifier")) {
      this.baseIdentifier = this.details.identifier
    }

    this.name = this.details.name;

    if (window.__enrolledCourses != undefined) {
      window.__enrolledCourses.map((item) => {
        if (this.baseIdentifier == item.courseId) {
          this.enrolledCourses = item;
        }
      })
      if (this.enrolledCourses.leafNodesCount != null && this.enrolledCourses.progress <= this.enrolledCourses.leafNodesCount) {
        this.downloadProgress = this.details.leafNodesCount == null ? 0 : (this.enrolledCourses.progress / this.enrolledCourses.leafNodesCount) * 100;
        this.downloadProgress = parseInt(isNaN(this.downloadProgress) ? 0 : this.downloadProgress);
      } else {
        this.downloadProgress = 0;
      }
    }
    else {

      this.downloadProgress = 0;
    }

    this.data = {
      courseName: (this.name && this.name != "") ? this.name : (this.details ? this.details.courseName : ""),
      courseDesc: this.details ? this.details.courseDesc : "",
      completedProgress: this.downloadProgress
    };


  }

  onPop = () => {
    window.__getDownloadStatus = this.getSpineStatus;
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
    console.log("flag request", this.details)
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

  getSpineStatus = (pValue) => {
    var cmd;

    var data = JSON.parse(pValue);

    if (data.identifier != this.baseIdentifier)
      return;

    var textToShow = ""
    console.log(data)
    if (data.status == "NOT_FOUND") {
      window.__ContentLoaderDialog.hide();
      window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
      this.onBackPressed();
      return;
    }

    data.downloadProgress = data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
    var downloadedPercent = data.downloadProgress;
    downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;
    if (downloadedPercent == 100) {
      window.__ContentLoaderDialog.updateProgressBar(100);
      window.__ContentLoaderDialog.hide();
      this.checkContentLocalStatus(this.baseIdentifier);

    } else if (downloadedPercent < 100) {
      window.__ContentLoaderDialog.show();
      window.__ContentLoaderDialog.setClickCallback(this.handleContentLoaderCancelClick)
      window.__ContentLoaderDialog.updateProgressBar(downloadedPercent);
    }
  }

  handleContentLoaderCancelClick = () => {
    JBridge.cancelDownload(this.baseIdentifier);
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
      window.__ContentLoaderDialog.hide();
      _this.renderCourseChildren()
      _this.changeOverFlow();
    });
    JBridge.getChildContent(identifier, callback1);
  }

  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function (data) {
      if (data == "__failed") {
        window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
        _this.logTelelmetry(identifier, null, false);
        this.onBackPressed();
        return;
      }
      data = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
      console.log("this.courseDetails ", data);

      _this.courseDetails = data;
      console.log("data", data);
      if (data.isAvailableLocally == true) {
        _this.logTelelmetry(identifier, data.contentData.pkgVersion, data.isAvailableLocally);
        _this.renderChildren(identifier);
      } else {
        _this.logTelelmetry(identifier, data.contentData.pkgVersion, data.isAvailableLocally);
        if (JBridge.isNetworkAvailable()) {
          JBridge.importCourse(identifier, "true");
          _this.changeOverFlow();
        } else {
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
        }
      }
    });
    window.__getDownloadStatus = this.getSpineStatus;
    JBridge.getContentDetails(identifier, callback);
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

  getBatchDetailSection = (name, description, createdBy) => {
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
  }

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
      }
      else if (state.responseFor == "API_Get_Batch_Creator_name") {
        var user_details = response.result.response;
        console.log("user details", user_details)
        console.log(this.batchName, this.batchDescription)
        var userName = user_details.firstName + " " + (user_details.lastName || " ")
        this.replaceChild(_this.idSet.batchDetailsContainer, _this.getBatchDetailSection(this.batchName, this.batchDescription, userName).render(), 0);
      }
    }
    else {
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.TIME_OUT)
    }
  }

  renderCourseChildren = () => {
    var layout;

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
    window.__ContentLoaderDialog.hide();

    if (window.__SharePopup != undefined && window.__SharePopup.getVisible()) {
      window.__SharePopup.hide();
      return;
    }
    if (window.__ContentLoaderDialog.getVisible()) {
      window.__ContentLoaderDialog.hide();
      return;
    }
    JBridge.endEventLog(this.courseDetails.contentType, this.courseDetails.identifier, this.courseDetails.contentData.pkgVersion);
    var event = { tag: 'BACK_CourseEnrolledActivity', contents: [] }
    window.__runDuiCallback(event);
  }

  afterRender = () => {
    console.log("details", this.details)

    if ((this.details.hasOwnProperty("mimeType")) && (this.details.mimeType.toLocaleLowerCase() == "application/vnd.ekstep.content-collection")) {
      var cmd = this.set({
        id: this.idSet.featureButton1,
        visibility: "gone"
      });

      cmd += this.set({
        id: this.idSet.featureButton2,
        visibility: "gone"
      });
      Android.runInUI(cmd, 0);

    }
    if (this.enrolledCourses.hasOwnProperty("lastReadContentId") && (this.enrolledCourses.lastReadContentId != null)) {

      var cmd = this.set({
        id: this.idSet.featureButton1,
        visibility: "gone"
      });

      cmd += this.set({
        id: this.idSet.featureButton2,
        visibility: "visible"
      });

      Android.runInUI(cmd, 0);

    }


    this.checkContentLocalStatus(this.baseIdentifier);
    if (this.details.batchId || this.enrolledCourses.batchId) {
      var batchId = this.details.batchId ? this.details.batchId : this.enrolledCourses.batchId;
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
    }
    else if (params == 1) {
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
    console.log(this.details, "handleResumeClick this.details")
    var id;
    if (this.enrolledCourses.hasOwnProperty('lastReadContentId') && this.enrolledCourses.lastReadContentId != null) {
      console.log("this.enrolledCourses.lastReadContentId", this.enrolledCourses.lastReadContentId);
      id = this.enrolledCourses.lastReadContentId;
    }
    else if (this.details.hasOwnProperty("lastReadContentId") && this.details.lastReadContentId != null) {
      console.log("this.details.lastReadContentId", this.details.lastReadContentId);
      id = this.details.lastReadContentId
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
          orientation="vertical"
        >
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

          <HorizontalProgressBar
            width="match_parent"
            currentProgress={this.data.completedProgress}
            totalProgress={this.data.totalProgress}
            visibility={this.showProgress} />

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
                  padding="16,24,16,16"
                  orientation="vertical">

                  <CourseProgress
                    height="wrap_content"
                    width="wrap_content"
                    content={this.data}
                    title={this.data.courseName || this.details.name || this.details.contentData.name}
                    onResumeClick={this.handleCourseResume}
                    visibility={this.showProgress} />

                  <LinearLayout
                    id={this.idSet.batchDetailsContainer}
                    height="match_parent"
                    width="match_parent"
                    orientation="vertical" />



                  <TextView
                    width="wrap_content"
                    height="wrap_content"
                    margin="0,16,0,0"
                    style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
                    text={window.__S.STRUCTURE} />



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
              </ScrollView>
              <RelativeLayout
                height="wrap_content"
                width="match_parent">
                <FeatureButton
                  clickable="true"
                  margin="16,16,16,16"
                  width="match_parent"
                  height="56"
                  id={this.idSet.featureButton1}
                  visibility="visible"
                  background={window.__Colors.PRIMARY_ACCENT}
                  text={window.__S.START_COURSE}
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                  buttonClick={this.handleResumeClick} />
                <FeatureButton
                  clickable="true"
                  margin="16,16,16,16"
                  width="match_parent"
                  height="56"
                  visibility="gone"
                  id={this.idSet.featureButton2}
                  background={window.__Colors.PRIMARY_ACCENT}
                  text={window.__S.RESUME + " " + window.__S.COURSE}
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                  buttonClick={this.handleResumeClick} />
              </RelativeLayout>
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
          onConfirm={this.flagContent}
        />

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
