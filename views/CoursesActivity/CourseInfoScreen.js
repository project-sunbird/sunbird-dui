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
var ProgressButton = require('../../components/Sunbird/ProgressButton');

class CourseInfoScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
    ]);
    this.state = state;
    this.screenName = "COURSE_INFO_SCREEN"
      // console.log("GOT STATE", JSON.stringify(state))
      // window.__RootScreen.snackBar("Hellllllo")
     this.menuData = {
      url: [
        { imageUrl: "ic_action_bookmark" },
        { imageUrl: "ic_action_overflow"}
      ]
    }



    this.data = {
      courseName: this.state.values ? this.state.values.courseName : "",
      courseDesc: this.state.values ? this.state.values.courseDesc : "This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced",
      competedCount: this.state.values ? this.state.values.competedCount : "10",
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
      },{
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
      },
       {
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
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {
    if (this.state.type == "completed") {
      this.replaceChild(this.idSet.parentContainer, this.getEnrolledContent().render(), 0);
    }

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
                    content={this.data}
                    onResumeClick={this.handleCourseResume}/>

                 <CourseCurriculum
                  height="match_parent"
                  content={this.data}
                  onItemSelected={this.handleItemSelect}
                  enrolledStatus={true}
                  brief={true}
                  width="match_parent"/>




                </LinearLayout>

                </ScrollView>)
  }

  handleEnrollClick = (data) => {
    if (data === "ENROLL NOW") {
      var req = {
        "request": {
          "userId": "user1",
          "courseId": "course1",
          "coursename": "course name ",
          "description": "course description",
          "delta": {}
        }
      }
      window.__runDuiCallback({ action: "enrollCourse", reqparams: req });

      //this.replaceChild(this.idSet.parentContainer, this.getEnrolledContent().render(), 0);


    }
  }

  handleBackPress = () => {
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }

  getCurriculumnBrief = () => {

    var items = this.data.courseBrief.map((item, i) => {
      return (<TextView
                style={window.__TextStyle.textStyle.HINT.REGULAR} 
                text ={(i==0?"":" | ") +item.count + " "+item.type}/>)
    })

    return (
      <LinearLayout
        margin="0,0,0,0"
        height="wrap_content"
        width="match_parent">
        {items}
      </LinearLayout>);
  }


  render() {
    var buttonList = ["ENROLL FOR THIS COURSE"];
    this.layout = (
      <LinearLayout
        root="true"
        afterRender={this.afterRender()}
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title={this.data.courseName}
          menuData={this.menuData}
          onBackPress={this.handleBackPress}
          width="match_parent"
          invert="true"
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

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  margin="0,0,0,7"
                  text="Organic Chemistry Reactions"
                  style={window.__TextStyle.textStyle.HEADING.DARK}
                  />

                <CropParagraph
                  height="wrap_content"
                  margin="0,0,0,12"
                  width="match_parent"
                  contentText={this.data.courseDesc}
                  />

                <TextView
                  margin="0,0,0,4"
                  text="Curriculum" 
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                  {this.getCurriculumnBrief()}  

                 <CourseCurriculum
                  height="match_parent"
                  margin="0,0,0,12"
                  brief={true}
                  content= {this.data}
                  width="match_parent"/>


                </LinearLayout>


             </ScrollView>

             <ProgressButton
                 width="match_parent"
                 buttonItems={buttonList}/>

            </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseInfoScreen);
