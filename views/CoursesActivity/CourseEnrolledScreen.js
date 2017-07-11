var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../../components/Sunbird/CourseCurriculum');
var HorizontalProgressBar = require('../../components/Sunbird/HorizontalProgressBar');
var CourseProgress = require('../../components/Sunbird/CourseProgress');

var _this;
class CourseEnrolledScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
      "descriptionContainer",
      "downloadProgressText"
    ]);
    this.state = state;
    this.screenName = "CourseEnrolledScreen"

    this.menuData = {
      url: [
        
      ]
    }
    _this = this;
    this.shouldCacheScreen = false;
    this.courseContent = "";

    //this.checkContentLocalStatus(this.details.identifier);
    this.details = JSON.parse(state.data.value0.courseDetails);
    console.log("GOT VALUES ", this.details)

    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;

    this.baseIdentifier = this.details.identifier ? this.details.identifier : this.details.contentId;




    this.data = {
      courseName: this.details ? this.details.courseName : "",
      courseDesc: this.details ? this.details.courseDesc : "This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced",
      completedProgress: "60",
      totalCount: "150",
      courseBrief: [{
        count: "50",
        type: "Assignments"
      }, {
        count: "25",
        type: "Videos"
      }, {
        count: "5",
        type: "Quizes"
      }],
      chapterList: [{
        chapterName: "Progression",
        chapterDuration: "30",
        chapterFinished: "3",
        chapterContent: [{
          name: "Arithemetic Progression",
          type: "PLAY",
          status: "DONE"
        }, {
          name: "Geometric Progeressions",
          type: "PLAY",
          status: "DONE"
        }, {
          name: "Quiz 1: 10 questions",
          type: "QUIZ",
          status: "DONE"
        }]
      }, {
        chapterName: "Scientific Notations",
        chapterFinished: "2",
        chapterDuration: "50",
        chapterContent: [{
          name: "Arithemetic Progression",
          type: "PLAY",
          status: "DONE"
        }, {
          name: "Geometric Progeressions",
          type: "PLAY",
          status: "DONE"
        }, {
          name: "Significant figures",
          type: "ASSIGNMENT",
          status: "PROGRESS"
        }, {
          name: "Quiz 2: 5 questions",
          type: "QUIZ",
          status: "PENDING"
        }]
      }, {
        chapterName: "Scientific Notations",
        chapterFinished: "2",
        chapterDuration: "50",
        chapterContent: [{
          name: "Arithemetic Progression",
          type: "PLAY",
          status: "DONE"
        }, {
          name: "Geometric Progeressions",
          type: "PLAY",
          status: "DONE"
        }, {
          name: "Significant figures",
          type: "ASSIGNMENT",
          status: "PROGRESS"
        }, {
          name: "Quiz 2: 5 questions",
          type: "QUIZ",
          status: "PENDING"
        }]
      }, {
        chapterName: "Progression",
        chapterFinished: "0",
        chapterDuration: "10",
        chapterContent: [{
          name: "Arithemetic Progression",
          type: "Chapter",
          status: "PENDING"
        }, {
          name: "Geometric Progeressions",
          type: "Chapter",
          status: "PENDING"
        }, {
          name: "Quiz 1: 10 questions",
          type: "Quiz",
          status: "PENDING"
        }]
      }]
    };

  }

  onPop = () => {
    window.__getDownloadStatus = this.getSpineStatus;
    Android.runInUI(
      this.animateView(),
      null
    );
  }



  afterRender = () => {
    this.checkContentLocalStatus(this.baseIdentifier);
  }


  getSpineStatus = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.baseIdentifier)
      return;

    var textToShow = ""
    console.log("DATA -> ", data)

    var downloadedPercent = parseInt(data.downloadProgress);
    downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;

    if (downloadedPercent == 100) {

      console.log("SPINE IMPORTED -> ")
      this.checkContentLocalStatus(this.baseIdentifier);

    } else {
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        text: "Downloaded " + downloadedPercent + "%"
      })
      Android.runInUI(cmd, 0);
    }
  }

  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function(status) {

      if (status == "true") {
        console.log("Spine Found")
        var callback1 = callbackMapper.map(function(data) {
          console.log("course details;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;", JSON.parse(data));
          _this.courseContent = JSON.parse(data);
          _this.renderCourseChildren()
        });
        JBridge.getChildContent(identifier, callback1)
      } else {
        console.log("Spine Not Found, IMPORTING ")
        JBridge.importCourse(identifier,"false")
      }



    });
    window.__getDownloadStatus = this.getSpineStatus;
    JBridge.getLocalContentStatus(identifier, callback);
  }


  handleModuleClick = (moduleName, module) => {
    var eventAction = { "tag": "ShowModuleScreen", contents: { "moduleName": moduleName, "moduleDetails": JSON.stringify(module) } };
    window.__runDuiCallback(eventAction);

  }


  renderCourseChildren = () => {
    console.log("RENDRING BREKAUP", this.courseContent.children)
    var layout = (
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

    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }




  onBackPressed = () => {
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }


  render() {
    var buttonList = ["ENROLL FOR THIS COURSE"];
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title={this.data.courseName}
          menuData={this.menuData}
          onBackPress={this.onBackPressed}
          width="match_parent"
          invert="true"
          showMenu="true"/>

        <HorizontalProgressBar  
          currentProgress={this.data.completedProgress}
          totalProgress={this.data.totalProgress}
          width="match_parent"
          height="wrap_content"/>

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
                      title={this.data.courseName}
                      onResumeClick={this.handleCourseResume}/>


                  <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    gravity="center"
                    root="true"
                    afterRender={this.afterRender}
                    orientation="vertical"
                    id={this.idSet.descriptionContainer}>
                       <TextView
                          id={this.idSet.downloadProgressText}
                          text="Fetching spine"
                          height="300"
                          gravity="center"
                          width="match_parent"/>
                  </LinearLayout>   



                </LinearLayout>

                </ScrollView>

          </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseEnrolledScreen);
