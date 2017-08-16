var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;

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
class CourseEnrolledActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
      "descriptionContainer",
      "downloadProgressText",
      "sharePopupContainer",
      "contentLoaderContainer",
      "featureButton"
    ]);
    this.state = state;
    this.screenName = "CourseEnrolledActivity"

    this.menuData = {
      url: [
        { imageUrl: "ic_action_share_black" }
      ]
    }



    _this = this;
    this.shouldCacheScreen = false;
    this.courseContent = "";

    this.enrolledCourses = window.__enrolledCourses;

    
    this.details = JSON.parse(state.data.value0.courseDetails);
    

    
    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;

    this.showProgress = this.details.hasOwnProperty("contentType") && this.details.contentType == "collection" || this.details.contentType == "TextBook" ? "gone" : "visible";

    if(this.details.hasOwnProperty("courseId")){
      this.baseIdentifier = this.details.courseId
    }
    else if(this.details.hasOwnProperty("contentId")){
      this.baseIdentifier = this.details.contentId
    }
    else if(this.details.hasOwnProperty("identifier")){
      this.baseIdentifier = this.details.identifier
    }



    if(window.__enrolledCourses != undefined){
      window.__enrolledCourses.map((item)=>{
      if(this.baseIdentifier == item.courseId){
        this.enrolledCourses = item;
      }
    })
      this.downloadProgress = this.details.leafNodesCount == null? 0 : (this.enrolledCourses.progress/this.enrolledCourses.leafNodesCount)*100;
      this.downloadProgress = parseInt(isNaN(this.downloadProgress)?0:this.downloadProgress)
    }
    else{

      this.downloadProgress = 0;
    }
    
    this.data = {
      courseName: this.details ? this.details.courseName : "",
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
      JBridge.showSnackBar(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
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
      window.__ContentLoaderDialog.updateProgressBar(downloadedPercent);
      
    }

    
  }


  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function(status) {

      if (status == "true") {
        window.__ContentLoaderDialog.hide()
        var callback1 = callbackMapper.map(function(data) {
          data[0] = utils.jsonifyData(data[0])
          _this.courseContent = JSON.parse(data[0]);
          window.__ContentLoaderDialog.hide();
          _this.renderCourseChildren()
        });
        JBridge.getChildContent(identifier, callback1)
      } else {          
          var callback22= callbackMapper.map(function(data){
            console.log(data)
                data = JSON.parse(data)
                if(data.status==="NOT_FOUND"){
                      if(JBridge.isNetworkAvailable())
                        JBridge.importCourse(identifier,"false")
                      else
                        JBridge.showSnackBar(window.__S.NO_INTERNET)
                }
                else{
                  this.checkContentLocalStatus(identifier)
                }
          })

          JBridge.getContentImportStatus(identifier,callback22) 
      }

    });
    window.__getDownloadStatus = this.getSpineStatus;
    JBridge.getLocalContentStatus(identifier, callback);


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
      layout = <TextView
                  height="300"
                  width="match_parent"
                  gravity="center"
                  root="true"
                  text={window.__S.ERROR_CONTENT_NOT_FOUND} />
    }else{
     layout = (
                <CourseCurriculum
                  height="match_parent"
                  width="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  title=""
                  onClick={this.handleModuleClick}
                  content= {this.courseContent.children}/>
                  )
   }
    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }




  onBackPressed = () => {
   var whatToSend = []
   var event = { tag: 'BACK_CourseEnrolledActivity', contents: whatToSend }
   window.__runDuiCallback(event);
  }

  afterRender=()=>{
    if(this.details.contentType!="course" || this.details.contentType != "Course"){
      var cmd = this.set({
        id: this.idSet.featureButton,
        visibility: "gone"

      })
      Android.runInUI(cmd, 0);
    }


    this.checkContentLocalStatus(this.baseIdentifier);
  }


  overFlowCallback = (params) => {
    if(params == 0){
      window.__FlagPopup.show();
    }else if(params == 1){
      this.logout();
    }
  }

  handleMenuClick = (url) =>{
    console.log("menu item clicked",url);


    if(url=="ic_action_share_black"){


    var callback = callbackMapper.map(function(data) {


      var input = [{
                    type : "text",
                    data : "staging.open-sunbird.org/public/"+_this.baseIdentifier

                  },{
                    type : "file",
                    data : "file://"+data[0]

                  }];

      var sharePopUp = (
        <SharePopup
        data = {input}/>
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

  handleResumeClick = () =>{
    console.log(this.details)
    var callback = callbackMapper.map(function(data){
      console.log("local content details",data)
      data[0] = JSON.parse(data[0])
      _this.handleModuleClick(data[0].contentData.name,data[0])
    });
    var id;
    if(this.details.hasOwnProperty("lastReadContentId")){
      id = this.details.lastReadContentId
    }
    else if(!(this.courseContent.children == undefined)){
      console.log("children details",this.courseContent.children)
      id = this.courseContent.children[0].identifier;
    }
    else{
      JBridge.showSnackBar("No Resume Content Available")
    }
    JBridge.getChildContent(id,callback)
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

        <SimpleToolbar
            title=""
            height="wrap_content"
            width="match_parent"
            menuData={this.menuData}
            popupMenu={this.popupMenu}
            onMenuItemClick={this.handleMenuClick}
            overFlowCallback = {this.overFlowCallback}
            showMenu="true"
            onBackPress={this.onBackPressed}
            invert="true"/>


          <HorizontalProgressBar
            width="match_parent"
            height="wrap_content"
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

                      <CourseProgress
                        height="wrap_content"
                        width="wrap_content"
                        content={this.data}
                        title={this.data.courseName || this.details.name || this.details.contentData.name}
                        onResumeClick={this.handleCourseResume}
                        visibility = {this.showProgress}/>


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
                    text = {"RESUME COURSE"}
                    style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                    buttonClick = {this.handleResumeClick}
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

module.exports = Connector(CourseEnrolledActivity);
