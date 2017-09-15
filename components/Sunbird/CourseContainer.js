var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var _this;
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var CardComponent = require('../Sunbird/core/CardComponent');
var utils = require('../../utils/GenericFunctions');


class CourseContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([
      "courseContainer",
      "parentContainer"]);
    this.count = (this.props.data != undefined) ? this.props.data.length : 0;
    this.enrolled = false;
  }


  afterRender = () => {
    this.data= this.props.data;
    if(this.data==undefined)
          this.data=[];

    var rows = this.data.map((item, i) => {

      return this.geCardLayout(item,i);

    });

    var layout=(<LinearLayout
                  orientation="vertical"
                  height="wrap_content"
                  width="match_parent">

                  {this.getHeader()}


                  <HorizontalScrollView
                   width = "wrap_content"
                   height = "wrap_content"
                   scrollBarX="false"
                   fillViewport="true">

                   <LinearLayout
                     padding="0,0,16,0"
                     width="match_parent"
                     height="wrap_content">

                    {rows}

                    </LinearLayout>

                  </HorizontalScrollView>

                  </LinearLayout>)

    this.replaceChild(this.idSet.courseContainer,layout.render(),0)

  }

  checkEnrolledCourse = (identifier) =>{

    var enrolled = false;
    window.__enrolledCourses.map(function(item){
      if(item.courseId == identifier){
        enrolled = true;
      }
    })

     return enrolled;

  }


  geCardLayout = (item,i) => {

    var size = item.hasOwnProperty("size") ? "  "+window.__S.FILE_SIZE.format(utils.formatBytes(item.size)) : "";

    var temp = {
        imageUrl: (item.appIcon ? item.appIcon : "ic_action_course"),
        title: item.name,
        actionText: window.__S.OPEN,
        footerTitle : "",
        stars : item.hasOwnProperty("me_averageRating")? item.me_averageRating+ "" : "0",
        footerSubTitle: size,
    };

    if(_this.checkEnrolledCourse(item.identifier)){
     temp['type'] = "ENROLLED";
    }
      return (<CardComponent
                 data={temp}
                 content={item}
                 index = {i}
                 onCardClick={this.handleCardClick}/>)

  }



  getHeader() {
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              padding="16,16,16,16"
              orientation="horizontal">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={this.props.languageTitle}
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
                width="0"
                height="0"
                weight="1"/>

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={window.__S.VIEW_ALL}
                visibility = {(this.count <= 0)? "gone" : "visible"}
                padding="8,8,8,8"
                onClick={()=>{this.handleViewAllClick()}}
                style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>


            </LinearLayout>)
  }

 handleViewAllClick = () =>{
      JBridge.logViewAllClickEvent("COURSES",this.props.title);
      var courseListDetails = {
                               "title" : this.props.title,
                               "courseListDetails" : this.data,
                               "searchQuery" : this.props.searchQuery,
                               "viewMore" : this.props.showViewMore
                              }
      var whatToSend = {"courseListDetails": JSON.stringify(courseListDetails)}
      var event = { tag: "OPEN_CourseViewAllActivity", contents: whatToSend};
      window.__runDuiCallback(event);

  }


  handleCardClick = (content, type , index) => {

    console.log("index clicked",index)
    var callback = callbackMapper.map(function(data) {

      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
        _this.props.onCourseClick(content, type, index);

      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_warning_grey", window.__S.STORAGE);
      }

    });

    JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");

  }






  render() {
    this.layout = (
      <LinearLayout
        id={this.idSet.parentContainer}
        height="match_parent"
        width="match_parent"
        afterRender={this.afterRender}
        background={this.props.transparent?window.__Colors.WHITE_F2:window.__Colors.WHITE}
        root="true"
        orientation="vertical">

           <LinearLayout
            id={this.idSet.courseContainer}
            padding="0,0,0,0"
            height="wrap_content"
            width="match_parent"/>


         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseContainer;
