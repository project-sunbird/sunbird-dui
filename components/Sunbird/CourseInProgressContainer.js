var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ProgressBar = require("@juspay/mystique-backend/src/android_views/ProgressBar");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require("../../utils/GenericFunctions")
var _this;
var CardComponent = require('../Sunbird/core/CardComponent');


class CourseInProgressContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;
    console.log("CourseInProgressContainer", this.props);
    this.setIds([
      "parentContainer",
      "progressContainer",
      "viewAllContainer",
    ]);
    this.displayName = "course_in_progress_container";
    window.__UpdateUserCourses = this.renderContent;
    window.__fetchCourse = this.fetchFromServer;

    this.appendAtPosition=0;
    this.savedCourseTag = "savedCourse";

  }


  fetchFromServer = () => {
    console.log("fetchFromServer");
    var res = null;
    if (JBridge.isNetworkAvailable()) {
      var whatToSend = {"user_token":window.__user_accessToken,"api_token": window.__apiToken}
      var event ={ "tag": "API_UserEnrolledCourse", contents: whatToSend};
      window.__runDuiCallback(event);
    } else {
     // window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      res = JBridge.getSavedData(this.savedCourseTag);
      if (res && res != "__failed"){
        var parsed = JSON.parse(utils.decodeBase64(res));
        this.renderContent(parsed, true);
        window.__enrolledCourses = parsed;
      }
    }
  }


  renderContent = (data, dontSaveToFile) => {
    console.log("renderContent");
    if (dontSaveToFile == undefined && data != undefined){
      var encoded = utils.encodeBase64(JSON.stringify(data));
      JBridge.saveData(this.savedCourseTag, encoded);
    }

    var isDataEmpty = (data === "" || data === undefined || data.length == 0);

    this.data = data;



     var layout="";
     var layout1="";
     var rows="";

    if(isDataEmpty){
        if(this.props.addCard==undefined||this.props.addCardVisibility=="gone")
          {
            layout1= (
              <TextView
                    width="match_parent"
                    height="50"
                    gravity="center"
                    text={window.__S.ERROR_NO_COURSES_ENROLLED}
                    style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>)
          }
        else {
          layout1=this.getExtraLayout();
        }

       var cmd = this.set({
        id: this.idSet.viewAllContainer,
        visibility : isDataEmpty?"gone":"visible"
      })

    Android.runInUI(cmd, 0);

    layout = (
      <LinearLayout
        root="true"
        height="wrap_content"
        width="match_parent">
        {layout1}
      </LinearLayout>);
    }
    else{
       rows = this.data.map((item, index) => {
       return this.getCardLayout(item,index);
      });
      layout = (
        <LinearLayout
          root="true"
          height="wrap_content"
          width="match_parent">
          {this.getExtraLayout()}
          {rows}
        </LinearLayout>);
    }

    this.replaceChild(this.idSet.parentContainer,layout.render(),0);
    window.__ContentLoadingComponent.hideLoader();
    window.__LoaderDialog.hide();
  }

  formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  };

  getCardLayout =(item,index) => {
    console.log("item in progress container",item)
     var pDone= (item.progress == undefined || !Number.isInteger(item.progress)) ? 0 : item.progress;
     var pTotal = (item.leafNodesCount == undefined || !Number.isInteger(item.leafNodesCount)) ? 0 : item.leafNodesCount;
     var progressCount = (pDone / pTotal)*100;
     progressCount = isNaN(progressCount) ? 0 : parseInt(progressCount);

     console.log("GET CARD LAYOUT",item)

     var temp = {
        imageUrl: (item.courseLogoUrl ? item.courseLogoUrl : "ic_action_course"),
        title: item.courseName,
        actionText:  window.__S.RESUME,
        // footerTitle: (isNaN(pDone/pTotal)?"0":(pDone/pTotal)) +"% done",
        footerTitle: window.__S.COURSE_PROGRESS_COMPLETED.format(progressCount),
        progressPercent : progressCount,
        footerSubTitle:  "",
        isProgress : "true"
      };

      return (<CardComponent
                 data={temp}
                 content={item}
                 index = {index}
                 onCardClick={this.handleCardClick}/>)
  }


  getHeader() {
    return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="16,16,16,16"
            orientation="horizontal">

            <TextView
              width="wrap_content"
              height="wrap_content"
              text={this.props.title}
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            <ViewWidget
              width="0"
              height="0"
              weight="1"/>

            <TextView
              width="wrap_content"
              height="wrap_content"
              padding = "8,8,8,8"
              text={window.__S.VIEW_ALL}
              id={this.idSet.viewAllContainer}
              onClick={this.handleViewAllClick}
              style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>


            </LinearLayout>)
  }



   handleCardClick = (content, type, index) => {

    console.log("index",index)
    var callback = callbackMapper.map(function(data) {

      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");

        _this.props.onCourseClick(content, type, index);

      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_warning_grey",window.__S.STORAGE);
      }

    });

    JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");

  }




  handleViewAllClick = () =>{
      JBridge.logViewAllClickEvent("COURSES",window.__S.COURSES_IN_PROGRESS);
      var courseListDetails = {
                               "title" : this.props.title || window.__S.COURSES_IN_PROGRESS,
                               "courseListDetails" : this.data,
                               "viewMore" : this.props.showViewMore
                              }

      var whatToSend = {"courseListDetails": JSON.stringify(courseListDetails)}
      var event = { tag: "OPEN_CourseViewAllActivity", contents: whatToSend};
      window.__runDuiCallback(event);

  }

  getExtraLayout=()=>{
    if(this.props.addCard==undefined)
      {
        return(
          <LinearLayout
          visibility="gone"/>
        )
      }
      return this.props.addCard;
  }


  render() {
    this.layout = (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          afterRender={this.fetchFromServer}
          background={this.props.transparent?window.__Colors.WHITE_F2:window.__Colors.WHITE}
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "match_parent"
           height = "match_parent"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
                    padding="0,0,20,0"
                    id={this.idSet.parentContainer}
                    width="match_parent"
                    height="match_parent">

         </LinearLayout>
          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseInProgressContainer;
