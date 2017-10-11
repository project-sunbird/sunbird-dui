var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;
var dom = require("@juspay/mystique-backend/src/doms/android");

var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

var objectAssign = require('object-assign');
var FeatureButton = require('../components/Sunbird/FeatureButton');

window.R = require("ramda");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');
var HorizontalProgressBar = require('../components/Sunbird/HorizontalProgressBar');
var CourseProgress = require('../components/Sunbird/CourseProgress');
var FlagPopup = require('../components/Sunbird/FlagPopup');
var SharePopup = require('../components/Sunbird/core/SharePopup');
var PageOption = require('../components/Sunbird/core/PageOption');


var utils = require('../utils/GenericFunctions');
var _this;
class ContentPreviewScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
      "descriptionContainer",
      "downloadProgressText",
      "sharePopupContainer",
      "contentLoaderContainer",
      "featureButton",
      "simpleToolBarOverFlow",
      "moduleText"
    ]);
    this.state = state;
    this.screenName = "ContentPreviewScreen";

    console.log("CONTENT PREVIEW STATE\nn\n\n\n\n\n\n\n",state.data.value0.details)

    this.menuData = {
      url: [
        { imageUrl: "ic_action_share_black" }
      ]
    }

    JBridge.logPreviewScreenEvent();

    this.menuData1 = {
      url: [
        { imageUrl: "ic_action_share_black" },
        { imageUrl: 'ic_action_overflow'}
      ]
    }



    _this = this;
    this.shouldCacheScreen = false;
    this.courseContent = "";

    this.enrolledCourses = window.__enrolledCourses;

    this.localContent = null;
    this.details = JSON.parse(state.data.value0.details);
    // this.details = {
    //     "basePath": "/storage/emulated/0/.NTP/content/do_30014516",
    //     "contentData": {
    //       "appIcon": "do_30014516/slide10_1466528196919.jpg",
    //       "contentType": "Worksheet",
    //       "contentVariantList": [],
    //       "copyright": "CC0",
    //       "description": "This worksheet contains 10 questions from the multiplication table of 11. It is for students learning multiplication tables of 2-digit numbers. For each question, feedback is provided.",
    //       "downloadUrl": "do_30014516/1466591550955_do_30014516.zip",
    //       "gradeLevel": [
    //         "Grade 1",
    //         "Grade 2",
    //         "Grade 3",
    //         "Grade 4",
    //         "Grade 5",
    //         "Other"
    //       ],
    //       "identifier": "do_30014516",
    //       "language": [
    //         "English"
    //       ],
    //       "license": "Creative Commons Attribution (CC BY)",
    //       "name": "Multiplication - 11 Times Table",
    //       "osId": "org.ekstep.quiz.app",
    //       "owner": "Parabal Partap Singh",
    //       "pkgVersion": "1.0",
    //       "publisher": "",
    //       "size": "1490861.0",
    //       "status": "Live",
    //       "subject": "domain"
    //     },
    //     "contentType": "worksheet",
    //     "hierarchyInfo": [
    //       {
    //         "contentType": "collection",
    //         "identifier": "do_30022230"
    //       }
    //     ],
    //     "identifier": "do_30014516",
    //     "isAvailableLocally": true,
    //     "isUpdateAvailable": false,
    //     "lastUpdatedTime": 1502983624000,
    //     "mimeType": "application/vnd.ekstep.ecml-archive",
    //     "referenceCount": 1
    //   }

    this.popupMenu = window.__S.DELETE;

    //to get geneie callback for download of spine
    // window.__getDownloadStatus = this.getSpineStatus;

    // this.showProgress = this.details.hasOwnProperty("contentType") && this.details.contentType == "collection" || this.details.contentType == "TextBook" ? "gone" : "visible";

    // if(this.details.hasOwnProperty("courseId")){
    //   this.baseIdentifier = this.details.courseId
    // }
    // else if(this.details.hasOwnProperty("contentId")){
    //   this.baseIdentifier = this.details.contentId
    // }
    // else if(this.details.hasOwnProperty("identifier")){
    //   this.baseIdentifier = this.details.identifier
    // }



    // if(window.__enrolledCourses != undefined){
    //   window.__enrolledCourses.map((item)=>{
    //   if(this.baseIdentifier == item.courseId){
    //     this.enrolledCourses = item;
    //   }
    // })
    //   this.downloadProgress = this.details.leafNodesCount == null? 0 : (this.enrolledCourses.progress/this.enrolledCourses.leafNodesCount)*100;
    //   this.downloadProgress = parseInt(isNaN(this.downloadProgress)?0:this.downloadProgress)
    // }
    // else{

    //   this.downloadProgress = 0;
    // }

    this.data = {
      courseName: this.details ? this.details.name : "",
      courseDesc: this.details.contentData ? this.details.contentData.description : "",
      completedProgress: 0
    };


  }

  onPop = () => {
    window.__getDownloadStatus = this.getSpineStatus;
    Android.runInUI(
      this.animateView(),
      null
    );
  }

   onStop = () =>{
    window.__SharePopup.hide();
    console.log("ON STOP IN ResourceDetailActivity")
  }


  getSpineStatus = (pValue) => {
    var cmd;

    var data = JSON.parse(pValue);

    if (data.identifier != this.baseIdentifier)
      return;

    var textToShow = ""

    if(data.status == "NOT_FOUND"){
      window.__ContentLoaderDialog.hide();
      window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
      this.onBackPressed();
      return;
    }

    data.downloadProgress= data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
    var downloadedPercent = data.downloadProgress;
    downloadedPercent =  downloadedPercent < 0 ? 0 : downloadedPercent;

    if (downloadedPercent == 100) {
      window.__ContentLoaderDialog.updateProgressBar(100);
      window.__ContentLoaderDialog.hide();
      this.checkContentLocalStatus(this.baseIdentifier);

    } else {
      window.__ContentLoaderDialog.show();
      window.__ContentLoaderDialog.setClickCallback(this.handleContentLoaderCancelClick);
      window.__ContentLoaderDialog.updateProgressBar(downloadedPercent);

    }


  }

  handleContentLoaderCancelClick = () => {
    JBridge.cancelDownload(this.baseIdentifier);
    setTimeout(function(){
      window.__ContentLoaderDialog.hide();
      this.onBackPressed();
    }, 500);
  }


  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function(data) {
      _this.localContent = JSON.parse(utils.decodeBase64(data[0]));
      if (_this.localContent.isAvailableLocally == true) {
        window.__ContentLoaderDialog.hide()
        var callback1 = callbackMapper.map(function(data) {
          data[0] = utils.jsonifyData(utils.decodeBase64(data[0]))
          _this.courseContent = JSON.parse(data[0]);
          window.__ContentLoaderDialog.hide();
          _this.renderCourseChildren()
        });
        JBridge.getChildContent(identifier, callback1)
      } else {
        if(JBridge.isNetworkAvailable()){
          JBridge.importCourse(identifier,"false");

        }
        else
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
      }

    });
    window.__getDownloadStatus = this.getSpineStatus;
    JBridge.getContentDetails(identifier, callback);


  }


  handleModuleClick = (moduleName, module) => {
    var whatToSend = {
      "moduleName": moduleName,
      "moduleDetails": JSON.stringify(module)
     }
    var event = { "tag": "OPEN_ModuleDetailsActivity", contents: whatToSend};
    window.__runDuiCallback(event);

  }
  handleStateChange(state){
    console.log("state in CES",state)
  }


  renderCourseChildren = () => {
    var layout;
    if(this.courseContent.children==undefined){
       var cmd = this.set({
        id: this.idSet.moduleText,
        visibility: "gone"
      });
       cmd += this.set({
        id: this.idSet.descriptionContainer,
        visibility: "gone"
      });
      Android.runInUI(cmd, 0);
      layout = <TextView
                  height="wrap_content"
                  width="match_parent"
                  gravity="center"
                  root="true"
                  text="" />
    }else{
     layout = (
                <CourseCurriculum
                  height="match_parent"
                  width="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  title=""
                  shouldGoForward = "false"
                  onClick={this.handleModuleClick}
                  content= {this.courseContent.children}/>
                  )
   }
    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }




  onBackPressed = () => {
    window.__ContentLoaderDialog.hide();

    if(window.__SharePopup != undefined && window.__SharePopup.getVisible()){
     window.__SharePopup.hide();
     return;
    }

   var whatToSend = []
   var event = { tag: 'BACK_CourseEnrolledActivity', contents: whatToSend }
   window.__runDuiCallback(event);
  }

  afterRender=()=>{
    console.log("details",this.details)


    this.checkContentLocalStatus(this.details.identifier);
  }

  overFlowCallback = (params) => {
    window.__LoaderDialog.show();
     if(params == 0){
      var callback = callbackMapper.map(function(response){
        window.__LoaderDialog.hide();

        if(response[0] == "successful"){

          _this.onBackPressed();
        }
      });
      JBridge.deleteContent(this.baseIdentifier,callback);
    }
  }

  handleMenuClick = (url) =>{
    console.log("menu item clicked",url);


    if(url=="ic_action_share_black"){


    var callback = callbackMapper.map(function(data) {
      var input;
      if (data[0]!="failure"){
        input = [{
                      type : "text",
                      data : window.__deepLinkUrl+"/public/#!/content/"+_this.baseIdentifier

                    },{
                      type : "file",
                      data : "file://"+data[0]

                    }];
        } else {
          input = [{
                        type : "text",
                        data : window.__deepLinkUrl+"/public/#!/content/"+_this.baseIdentifier

                      }];
        }
        var sharePopUp = (
          <SharePopup
          data = {input}
          identifier = {_this.baseIdentifier}
          type = ""
          />
          )


        _this.replaceChild(_this.idSet.sharePopupContainer,sharePopUp.render(),0);

         setTimeout(function() {
          window.__SharePopup.show();
        }, 200);



    });
    JBridge.exportEcar(this.baseIdentifier, callback);

  }
}

  handlePageOptionClick = (data) =>{

  }

  handleButtonClick = () =>{
    console.log("HANDLE PREVIEW CLICK")
    JBridge.logPreviewLoginClickEvent();
    var event={tag:"OPEN_UserActivityFromPreview",contents:{}}
    window.__runDuiCallback(event);
  }



  changeOverFlow = () =>{
    var toolbar =  (<SimpleToolbar
        title=""
        height="wrap_content"
        width="match_parent"
        menuData={this.menuData1}
        popupMenu={this.popupMenu}
        overFlowCallback = {this.overFlowCallback}
        showMenu="true"
        onBackPress={this.onBackPressed}
        invert="true"/>)

    this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
  }
  getHeader = () => {
    var headFooterTitle = this.details.contentType + (this.details.contentData.hasOwnProperty("size") ? " ["+utils.formatBytes(this.details.contentData.size)+"]" : "");
    return (

      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,0,0,0"
        orientation="vertical">


          <LinearLayout
          width="match_parent"
          height="wrap_content">

            <LinearLayout
            width="80"
            height="50"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}>

                <ImageView
                width="80"
                height="50"
                circularImageUrl={"4,"+ (this.details.imageUrl?this.details.imageUrl:"ic_action_resource")}/>

            </LinearLayout>

            <TextView
            width="wrap_content"
            height="wrap_content"
            padding="8,0,0,0"
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
            enableEllipse  = "true"
            text={this.data.courseName || this.details.name || this.details.contentData.name}/>

          </LinearLayout>

          <LinearLayout
          margin="0,12,0,0"
          width="match_parent"
          height="wrap_content">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={headFooterTitle}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>


          </LinearLayout>

        </LinearLayout>

    )

  }
  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getBody = () => {

    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical">

        <TextView
          margin="0,13,0,0"
          width="wrap_content"
          height="wrap_content"
          text={window.__S.ABOUT_MODULE}
          style={window.__TextStyle.textStyle.HINT.BOLD}/>

         <TextView
          margin="0,4,0,0"
          width="wrap_content"
          height="wrap_content"
          text={this.details.description || this.details.contentData.description}
          style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}/>


          <TextView
            margin="0,16,0,0"
            width="wrap_content"
            height="wrap_content"
            text={window.__S.PREVIEWS}
            style={window.__TextStyle.textStyle.HINT.BOLD}/>


         <LinearLayout
          width="match_parent"
          height="wrap_content"
          visibility="gone"
          margin="0,8,0,0">


            <ImageView
              width="156"
              height="200"
              stroke ={"3," + window.__Colors.PRIMARY_BLACK}
              imageFromUrl = "https://pbs.twimg.com/media/CRafzhtWIAEQ2c9.png"/>

            <ImageView
              width="156"
              height="200"
              margin="16,0,0,0"
              stroke ={"3," + window.__Colors.PRIMARY_BLACK}
              imageFromUrl = "https://pbs.twimg.com/media/CRafzhtWIAEQ2c9.png"/>

          </LinearLayout>



          <TextView
            margin="0,4,0,0"
            width="wrap_content"
            height="wrap_content"
            text={window.__S.NO_PREVIEW}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>


          <TextView
            margin="0,16,0,0"
            width="wrap_content"
            height="wrap_content"
            text={window.__S.CREATED_BY}
            style={window.__TextStyle.textStyle.HINT.BOLD}/>


          <LinearLayout
            width="match_parent"
            height="wrap_content">

            <TextView
              margin="0,4,0,10"
              width="wrap_content"
              height="wrap_content"
              text={this.details.contentData.owner}
              style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}/>


            <ViewWidget
              width="0"
              height="0"
              weight="1"/>


            <ImageView
              width="20"
              height="12"
              imageUrl="ic_chat"/>

          </LinearLayout>
      </LinearLayout>

    )
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
          root = "true"
          width="match_parent"
          height="wrap_content"
          id = {this.idSet.simpleToolBarOverFlow}>
          <SimpleToolbar
              title=""
              height="wrap_content"
              width="match_parent"
              menuData={this.menuData}
              popupMenu={this.popupMenu}
              overFlowCallback = {this.overFlowCallback}
              showMenu="true"
              onBackPress={this.onBackPressed}
              invert="true"/>
        </LinearLayout>

          <HorizontalProgressBar
            width="match_parent"
            currentProgress={this.data.completedProgress}
            totalProgress={this.data.totalProgress}
            visibility = {this.showProgress}/>

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
                    root="true"
                    padding="16,24,16,16"
                    orientation="vertical">

                      {this.getHeader()}

                      {this.getLineSeperator()}

                      {this.getBody()}

                    <TextView
                        margin="0,13,0,0"
                        width="wrap_content"
                        height="wrap_content"
                        text={window.__S.MODULES}
                        id = {this.idSet.moduleText}
                        style={window.__TextStyle.textStyle.HINT.BOLD}/>

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
                        text={window.__S.LOADING_CONTENT}/>

                      <ProgressBar
                        margin="0,10,0,0"
                        gravity="center"
                        width="20"
                        height="20"/>

                      </LinearLayout>
                  </LinearLayout>
                </ScrollView>
                <FeatureButton
                    clickable="true"
                    margin = "16,16,16,16"
                    width = "match_parent"
                    height = "56"
                    id = {this.idSet.featureButton}
                    background = {window.__Colors.PRIMARY_ACCENT}
                    text = {window.__S.BTN_CLICK_TO_OPEN_CONTENT}
                    style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                    buttonClick = {this.handleButtonClick}
                    />
          </LinearLayout>


      </LinearLayout>

       <FlagPopup/>

       <LinearLayout
       id={this.idSet.sharePopupContainer}
        height="match_parent"
       width="match_parent"/>

      </RelativeLayout>
    );

    return this.layout.render();

  }
}

module.exports = Connector(ContentPreviewScreen);
