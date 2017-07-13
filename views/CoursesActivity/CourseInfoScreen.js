var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../../components/Sunbird/CourseCurriculum');
var PageOption = require('../../components/Sunbird/core/PageOption');
var CourseProgress = require('../../components/Sunbird/CourseProgress');
var ProgressButton = require('../../components/Sunbird/core/ProgressButton');
var _this;
class CourseInfoScreen extends View {
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
      // console.log("GOT STATE", JSON.stringify(state))
      // window.__RootScreen.snackBar("Hellllllo")
    this.menuData = {
      url: [
        { imageUrl: "ic_action_bookmark" },
        { imageUrl: "ic_action_overflow" }
      ]
    }

    this.shouldCacheScreen = false;
    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;


    _this = this;

    this.details = JSON.parse(state.data.value0.courseDetails);
    console.log("GOT VALUES CIS ", this.details)

    this.checkContentLocalStatus(this.details.identifier);




    this.data = {
      courseName: this.details ? this.details.name : "",
      courseDesc: this.details ? this.details.courseDesc : "This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced",
      competedCount: this.details && this.details.footerTitle ? this.details.footerTitle.split('%')[0] : "10",
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



  getSpineStatus = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.details.identifier)
      return;

    var textToShow = ""
    console.log("DATA -> ", data)

    var downloadedPercent = parseInt(data.downloadProgress);
    downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;

    if (downloadedPercent == 100) {

      console.log("SPINE IMPORTED -> ")
      this.checkContentLocalStatus(this.details.identifier);

    } else {
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        text: "Fetching Contents: " + downloadedPercent + "%"
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
        JBridge.importCourse(identifier, "false")
      }



    });
    JBridge.getLocalContentStatus(identifier, callback);
  }


  renderCourseChildren = () => {
    console.log("RENDRING BREKAUP", this.courseContent.children)
    var layout = (<CourseCurriculum
                  height="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  content= {this.courseContent.children}
                  width="match_parent"/>)

    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }



  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {
    if (this.details.isProgress == "true") {
      console.log("Already enrolled")
      var eventAction = { tag: 'ShowEnrolledCourse', contents: { "course": this.state.data.value0.courseDetails } }
      window.__runDuiCallback(eventAction);

    }

  }


  handleStateChange = (state) => {

    var status = state.response.status[0];
    var response = JSON.parse(state.response.status[1]);
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];

    if (parseInt(responseCode) != 200) {
      console.log("INVALID FORMAT")
      return;
    }

    var result = response.result;

    if (response.params.err) {
      console.log("EROR MESSAGE :", response.params.errmsg)
      JBridge.showSnackBar("E MSG ->" + response.params.errmsg)
      return;
    }

    console.log("GOT RESULT FORM RESPONSE ->>", result)

    if (response.params.err == "INVALID_CREDENTIAL") {
      console.log("EROR MESSAGE :", response.params.errmsg)
      JBridge.showSnackbar("E MSG ->" + response.params.errmsg)
      return;
    }

    console.log("BEFOR SWITCH", state.responseFor)
    switch (state.responseFor + "") {
      case "EnrollCourse":
        if (result.response == "SUCCESS") {
          console.log("WELCOME -->>", result.response.firstName);
          JBridge.showSnackBar("Course enrolled")

          //"{"id":null,"ver":"v1","ts":"2017-06-28 02:09:30:032+0000","params":{"resmsgid":null,"msgid":null,"err":"INVALID_CREDENTIAL","status":"SERVER_ERROR","errmsg":"Invalid credential."},"responseCode":"CLIENT_ERROR","result":{}}"
          var eventAction = { tag: 'ShowEnrolledCourse', contents: { "course": this.state.data.value0.courseDetails } }
          window.__runDuiCallback(eventAction);
        } else {
          JBridge.showSnackBar("Please retry")
        }
        break;

        break;
      default:
        console.log("default SWITCH")
        break;


    }

    console.log("AFTER SWITCH")


  }

  handleEnrollClick = (data) => {
    console.log("---->\t", "handleEnrollClick");

    var eventAction = {
      "tag": "EnrollCourse",
      "contents": { reqParams: this.details.identifier }
    }
    console.log("IN ENROLLNOW")
    window.__runDuiCallback(eventAction);


  }

  onBackPressed = () => {
    window.__changePureScriptFlow();
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
          onBackPress={this.onBackPressed}
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
                  text={this.data.courseName}
                  style={window.__TextStyle.textStyle.HEADING.DARK} />
                 

                <TextView
                  height="wrap_content"
                  margin="0,0,0,12"
                  width="match_parent"
                  text="lorem ipsum, quia dolor sit
                  dolore magnam aliquam quaerat voluptatem.
                  Ut enim ad minima veniam, quis nostrum 
                  qui in ea voluptate velit esse,
                  quam nihil molestiae consequatur,
                  vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur" />
                 

                <TextView
                  margin="0,0,0,4"
                  text="Curriculum" 
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                  {this.getCurriculumnBrief()}  

                 

                <LinearLayout
                  height="300"
                  width="match_parent"
                  gravity="center"
                  root="true"
                  orientation="vertical"
                  id={this.idSet.descriptionContainer}>
                      <ProgressBar
                        height="30"
                        width="30"
                        margin="20,20,20,20"/>
                     <TextView
                        id={this.idSet.downloadProgressText}
                        test="Fetching spine"
                        height="wrap_content"
                        gravity="center"
                        width="match_parent"/>
                </LinearLayout>    

                </LinearLayout>


             </ScrollView>

             <PageOption
             width="match_parent"
             buttonItems={buttonList}
             onButtonClick={this.handleEnrollClick}/>

            </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseInfoScreen);
