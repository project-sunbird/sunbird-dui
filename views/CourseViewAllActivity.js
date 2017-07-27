var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var LargeCardComponent = require('../components/Sunbird/core/LargeCardComponent');

var utils = require('../utils/GenericFunctions');
var objectAssign = require('object-assign');
window.R = require("ramda");

class CourseViewAllActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
    ]);
    this.state = state;

    this.screenName = "CourseViewAllActivity";

    this.shouldCacheScreen = false;

    this.totalDetails = JSON.parse(state.data.value0.courseViewAllDetails);
    this.totalDetails = this.totalDetails.courseListDetails;
    console.log("COURSE VIEW ALL SCREEN DETAILS",this.totalDetails);


    this.menuData = {
    url: [
    ]
    }

    var _this = this;
    setTimeout(function() {
      Android.runInUI(
        _this.animateView(),
        null
      );
    },100)
  }


  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }


  getRows = () =>{


      var rows = this.totalDetails.map((item,i) => {

        console.log("PROGRESS IN COURSES VIEW ALL SCREEN",item);


                  var temp = {};
                  temp['imageUrl'] = item.courseLogoUrl?item.courseLogoUrl:"ic_action_course";
                  temp['name'] = item.courseName;
                  temp['isProgress'] = "true";
                  temp['footerTitle'] = (item.progress?item.progress:"0")+"% done";
                  temp['actionText'] = "RESUME";
                  temp["footerSubTitle"] = "Duration unavailable";

           return (<LargeCardComponent
                   data={temp}
                   content={item}
                   onResourceClick = {this.handleCourseClick}/>)

       });

      var layout = (<LinearLayout
                      width="match_parent"
                      height="wrap_content"
                      orientation = "vertical">

                      {rows}

                    </LinearLayout>);
      return layout;

    }




  afterRender = () => {

  }

  handleCourseClick = (content)=>{

    console.log("DATA IN COURSE PROGRESS COMPONENT VIEW ALL CLICK",content)

    var tmp = JSON.stringify(content)
    
    var whatToSend = {
        "course": tmp 
      };
     var event = { tag: 'OPEN_EnrolledCourseFlowFromCourseViewAll', contents: whatToSend };
    window.__runDuiCallback(event);
  }


  getLineSeperator = () =>{
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  onBackPressed = () => {
    var whatToSend = []
    var event = { tag: 'BACK_CourseViewAllActivity', contents: whatToSend }
    window.__runDuiCallback(event);
  }

  render() {
    var buttonList = ["ENROLL FOR THIS COURSE"];
    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          afterRender={this.afterRender}
          width="match_parent"
          menuData={this.menuData}
          onBackPress={this.onBackPressed}
          showMenu="true"
          invert="true"
          title= {this.appbarTitle}/>


              <ScrollView
                height="0"
                weight="1"
                width="match_parent"
                fillViewport="true"
                >

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                  {this.getRows()}


                </LinearLayout>

                </ScrollView>



      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseViewAllActivity);
