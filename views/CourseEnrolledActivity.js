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
      "contentLoaderContainer"
    ]);
    this.state = state;
    this.screenName = "CourseEnrolledActivity"

    this.menuData = {
      url: [
        { imageUrl: "ic_action_share_black" }
      ]
    }

    // this.popupMenu="Flag/Report content,Logout";

    _this = this;
    this.shouldCacheScreen = false;
    this.courseContent = "";

    this.enrolledCourses = window.__enrolledCourses;
    //this.checkContentLocalStatus(this.details.identifier);
    
    this.details = JSON.parse(state.data.value0.courseDetails);
    
    console.log("detials in CES",this.details)
    
    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;

    this.showProgress = this.details.hasOwnProperty("contentType") && this.details.contentType == "collection" || this.details.contentType == "TextBook" ? "gone" : "visible";
    console.log("\n\n\n\n progress",this.showProgress)
    this.baseIdentifier = this.details.identifier ? this.details.identifier : this.details.contentId;


    console.log("enrolled courses details",window.__enrolledCourses)

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
      courseDesc: this.details ? this.details.courseDesc : "This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced",
      completedProgress: this.downloadProgress
      
    };

    // window.__ContentLoaderDialog.show();

  }

  onPop = () => {
    window.__getDownloadStatus = this.getSpineStatus;
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  // getContentState = (courseId,userToken) =>{
  //   var whatToSend = { 
  //     "courseId": courseId, 
  //     "user_token": userToken, 
  //     "api_token": window.__apiToken 
  //   }
  //   var event = { "tag": "API_GetContentState", contents: whatToSend };
  //   window.__runDuiCallback(event);

  // }


  getSpineStatus = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.baseIdentifier)
      return;
    
    var textToShow = ""
    console.log("DATA -> ", data)
    
    data.downloadProgress= data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
    var downloadedPercent = data.downloadProgress;
    downloadedPercent =  downloadedPercent < 0 ? 0 : downloadedPercent;

    if (downloadedPercent == 100) {
      window.__ContentLoaderDialog.updateProgressBar(100);
      window.__ContentLoaderDialog.hide();
      console.log("SPINE IMPORTED -> ")
      this.checkContentLocalStatus(this.baseIdentifier);

    } else {
      window.__ContentLoaderDialog.show();
      window.__ContentLoaderDialog.updateProgressBar(downloadedPercent);
      
    }

    
  }


  checkContentLocalStatus = (identifier) => {

    console.log("in check local status")
    
    var callback = callbackMapper.map(function(status) {

      if (status == "true") {
        window.__ContentLoaderDialog.hide()
        console.log("Spine Found")
        var callback1 = callbackMapper.map(function(data) {
          console.log(data)
          // window.__testJSON = data[0];
          // data[0] = data [0].replace(/\t/g, ' ');
          data[0] = utils.jsonifyData(data[0])
          _this.courseContent = JSON.parse(data[0]);
          window.__ContentLoaderDialog.hide();
          _this.renderCourseChildren()
        });
        JBridge.getChildContent(identifier, callback1)


      } else {
        console.log("Spine Not Found, IMPORTING ")
          
          

          var callback22= callbackMapper.map(function(data){
            console.log(data)
                data = JSON.parse(data)
                if(data.status==="NOT_FOUND"){
                      console.log("Import")
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
                  text="Contents not added yet" />
    }else{
     layout = (
                <CourseCurriculum
                  height="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  title=""
                  onClick={this.handleModuleClick}
                  content= {this.courseContent.children}
                  width="match_parent"/>
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

    console.log("AFTER RENDER CAME IN COURSE ENROLLED")
    this.checkContentLocalStatus(this.baseIdentifier);

    var callback = callbackMapper.map(function(data) {

      var input = [{
                    type : "text",
                    data : "ntp.net.in/c/"+_this.baseIdentifier

                  },{
                    type : "file",
                    data : "file://"+data[0]

                  }];

      var sharePopUp = (
        <SharePopup
        data = {input}/>
        )

    _this.replaceChild(_this.idSet.sharePopupContainer,sharePopUp.render(),0);

    
    });

    JBridge.exportEcar(this.baseIdentifier, callback);

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
      window.__SharePopup.show();
    }
  }

  handlePageOptionClick = (data) =>{

  }


  render() {
    var buttonList = ["RESUME THE COURSE"];
    this.layout = (

      <RelativeLayout
      width="match_parent"
      height="match_parent"
      root="true">

      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
            title=""
            width="match_parent"
            menuData={this.menuData}
            popupMenu={this.popupMenu}
            onMenuItemClick={this.handleMenuClick}
            overFlowCallback = {this.overFlowCallback}
            showMenu="true"
            onBackPress={this.onBackPressed}
            invert="true"/>


          <HorizontalProgressBar
            currentProgress={this.data.completedProgress}
            totalProgress={this.data.totalProgress}
            width="match_parent"
            height="wrap_content"
            visibility = {this.showProgress}

            />

            <LinearLayout
              height="match_parent"
              orientation="vertical"
              id={this.idSet.parentContainer}
              width="match_parent">

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
                            height="match_parent"
                            width="match_parent"
                            gravity="center"
                            root="true"
                            orientation="vertical"
                            id={this.idSet.descriptionContainer}>

                            <TextView
                            margin="0,50,0,0"
                            width="wrap_content"
                            height="wrap_content"
                            gravity="center"
                            text="Loading content"/>

                            <ProgressBar
                            margin="0,10,0,0"
                            gravity="center"
                            width="20"
                            height="20"/>

                            </LinearLayout>


                </LinearLayout>

                </ScrollView>

                

          </LinearLayout>

          

      </LinearLayout>

       <FlagPopup/>

       <LinearLayout
       width="match_parent"
       height="match_parent"
       id={this.idSet.sharePopupContainer}/>

      </RelativeLayout>
    );

    return this.layout.render();

  }
}

module.exports = Connector(CourseEnrolledActivity);
