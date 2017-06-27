var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;


///////not used

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var HorizontalProgressBar = require("../../components/Sunbird/HorizontalProgressBar");

var CourseProgress = require('../../components/Sunbird/CourseProgress');
var CourseCurriculum = require('../../components/Sunbird/CourseCurriculum');

class EnrolledCourseScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "ratingBar",
      "recylerView"
    ]);
    this.state = state;
    this.screenName = "EnrolledCourseScreen"
    this.shouldCacheScreen = false;

    this.data = {
      courseName: "RANDOM VAL",
      courseDesc: "This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced",
      competedCount: "10",
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
        chapterName: "Scientific Notatios",
        chapterFinished: "2",
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

    this.competedCount = this.data != undefined ? this.data.competedCount : "25";
    this.totalCount = this.data != undefined ? this.data.totalCount : "150";


  }

  updateProgressBar = (pStatus) => {
    this.competedCount = pStatus

    //updating progressbar
    var ProgressBar = this.find('horizontal_progress_card')[0];
    ProgressBar.updateProgressBar(pStatus);

    //updating CourseProgressComponent
    (this.find('course_progress')[0]).updateProgress(pStatus);


  }


  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }


  handleBackPress = () => {
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          onBackPress={this.handleBackPress}
          title={this.data.type}
          menuData={this.menuData}
          width="match_parent"/>

         <HorizontalProgressBar 
              currentProgress={this.competedCount}
              totalProgress = {this.totalCount}
              width="match_parent"
              height="4"/> 

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
                    onResumeClick={this.handleCourseResume}/>

                 <CourseCurriculum
                  height="match_parent"
                  content={this.data}
                  onItemSelected={this.handleItemSelect}
                  enrolledStatus={true}
                  width="match_parent"/>




                </LinearLayout>

                </ScrollView>



      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(EnrolledCourseScreen);
