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

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../../components/Sunbird/CourseCurriculum');
var PageOption = require('../../components/Sunbird/PageOption');
var CourseProgress = require('../../components/Sunbird/CourseProgress');

class CourseInfoScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
    ]);
    this.state = state;
    this.screenName = "COURSE_INFO_SCREEN"
    console.log("GOT STATE", state)
    this.menuData = {
      url: [
        { imageUrl: "ic_action_search", title: "hello" }
      ]
    }

    this.data = {
      courseName: "Arithematic-Advanced",
      courseDesc: "This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced",
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

  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {

  }

  handleItemSelect = (data) => {
    this.state = R.merge(this.state, { event: 'showCourseActivity' })
    window.__runDuiCallback({ action: "showCourseActivity" });
  }


  handleCourseResume = (data) => {
    this.state = R.merge(this.state, { event: 'showQuizActivity' })
    window.__runDuiCallback({ action: "showQuizActivity" });
  }
  getEnrolledContent = () => {
    return (
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
                    onResumeClick={this.handleCourseResume}/>

                 <CourseCurriculum
                  height="match_parent"
                  content={this.data}
                  onItemSelected={this.handleItemSelect}
                  enrolledStatus={true}
                  width="match_parent"/>




                </LinearLayout>

                </ScrollView>)
  }

  handleEnrollClick = (data) => {
    if (data === "ENROLL NOW") {
      console.log(data)

      this.replaceChild(this.idSet.parentContainer, this.getEnrolledContent().render(), 0);



    }
  }

  handleBackPress = () => {
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }


  render() {
    var buttonList = ["ENROLL NOW"];
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
          onBackPress={this.handleBackPress}
          width="match_parent"
          showMenu="true"/>
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
                padding="16,24,16,16"
                orientation="vertical">

                <CropParagraph
                  height="wrap_content"
                  margin="0,0,0,12"
                  width="match_parent"
                  headText={"About the course"}
                  contentText={this.data.courseDesc}
                  />

                 <CourseCurriculum
                  height="match_parent"
                  margin="0,12,0,0"
                  content= {this.data}
                  width="match_parent"/>


                </LinearLayout>


             </ScrollView>

             <PageOption
                 width="match_parent"
                 id={this.idSet.pageOption}
                 buttonItems={buttonList}
                 onButtonClick={this.handleEnrollClick}/>
            </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseInfoScreen);
