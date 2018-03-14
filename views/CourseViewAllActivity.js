var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var LargeCardComponent = require('../components/Sunbird/core/LargeCardComponent');
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");
var utils = require('../utils/GenericFunctions');

var _this;

class CourseViewAllActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    window.__LoaderDialog.show();
    this.jsonArray=[];
    this.setIds([
      "viewMoreButton",
      "listContainer"
    ]);
    this.state = state;

    this.screenName = "CourseViewAllActivity";

    this.shouldCacheScreen = false;
    _this = this;

    this.totalDetails = JSON.parse(state.data.value0.courseViewAllDetails);
    this.searchQuery = this.totalDetails.hasOwnProperty("searchQuery") ? this.totalDetails.searchQuery : null;
    this.btnStatus = this.totalDetails.viewMore;
    this.displayContent = [];
    this.start_index = 0;
    this.appbarTitle = this.totalDetails.title;
    this.totalDetails = this.totalDetails.courseListDetails;
    this.menuData = {
    url: []
    }
    // JBridge.logListViewScreenEvent("COURSES",this.totalDetails.length,this.searchQuery)
    }

  checkEnrolledCourse = (identifier) =>{
    var enrolled = false;
    if (window.__enrolledCourses) {
      window.__enrolledCourses.map(function (item) {
        if (item.courseId == identifier) {
          enrolled = true;
        }
      });
    }
     return enrolled;
  }

  showList = () =>{
    console.log("data in cva",this.totalDetails)
    var list = this.totalDetails;
    this.jsonArray=[];
    list.map((item,i) => {
      var progressCount = 0;
      var pDone= (item.progress == undefined || !Number.isInteger(item.progress)) ? 0 : item.progress;
      var pTotal = (item.leafNodesCount == undefined || !Number.isInteger(item.leafNodesCount)) ? 0 : item.leafNodesCount;
      var progressCount = (pDone / pTotal)*100;
      progressCount = isNaN(progressCount) ? 0 : parseInt(progressCount);
      var appIcon,name,isProgress,size,actionText,type;
      if(item.courseId){
        appIcon = item.courseLogoUrl ? item.courseLogoUrl : "ic_action_course";
        name = item.courseName
        isProgress = "true"
        size = window.__S.COURSE_PROGRESS_COMPLETED.format(progressCount)
        actionText = window.__S.RESUME;
        type = null;
      }else if(item.identifier) {
        appIcon = item.appIcon ? item.appIcon : "ic_action_course";
        name = item.name
        isProgress = "false"
        size = item.hasOwnProperty("size") ? window.__S.FILE_SIZE.format(utils.formatBytes(item.size)) : "";
        actionText = window.__S.OPEN
        type = _this.checkEnrolledCourse(item.identifier) ? "ENROLLED" : null;
      }else{
        appIcon = "ic_action_course"
        name = ""
        isProgress = "false"
      }
      var temp = {};
      temp['imageUrl'] = appIcon;
      temp['name'] = name;
      temp['isProgress'] = isProgress;
      temp['footerTitle'] = size;
      temp['actionText'] = actionText;
      temp["footerSubTitle"] = window.__S.ERROR_DURATION_NOT_AVAILABLE;
      temp["type"] = type;
      var contentName = "";
      var contentId = "";
      if(item.courseId){
        contentName = item.courseName;
        contentId = item.courseId;
      } else if(item.identifier){
        contentName = item.name;
        contentId = item.identifier;
      }
      var layout = (
      <LargeCardComponent
        data={temp}
        content={item}
        index = {i}
        onResourceClick = {this.handleCourseClick}/>)
        this.jsonArray.push({ view: this.getView(layout.render()),value:"",viewType:0,name:contentName, id:contentId}
      );
    });
    var callback1 = callbackMapper.map(function() {
      console.log("button pressed");
      _this.handleViewMoreClick();
    });
    if(this.start_index==0){
      var buttonCallback="";
      var buttonText="";
      if(this.btnStatus=="visible"&&(this.jsonArray.length)>=10){
        buttonText = window.__S.VIEW_MORE;
        buttonCallback = callback1;
      }
      JBridge.listViewAdapter(
        this.idSet.listContainer,
        JSON.stringify(this.jsonArray),
        1000,
        buttonText,
        buttonCallback,
        this.idSet.viewMoreButton,
        0
      );
    }else{
      JBridge.appendToListView(
        this.idSet.listContainer,
        JSON.stringify(this.jsonArray),
        1000);
      }
      window.__LoaderDialog.hide();
  }

  handleCourseClick = (content,i)=>{
    if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        this.performCourseAction(content,i);
    }else{
        this.setPermissions();
    }
  }

  setPermissions = () =>{
    var callback = callbackMapper.map(function(data) {
        if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
              JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
        }else if(data == "DeniedPermanently"){
          console.log("DENIED DeniedPermanently");
          window.__PermissionDeniedDialog.show("ic_warning_grey", window.__S.STORAGE);
        }
        });
        JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");
  }

  performCourseAction = (content,index) =>{
       var tmp = JSON.stringify(content);
       console.log("content: ", content);

       var index_click = this.start_index <1 ? index+1 : index+(this.start_index*10)+1;
       var contentId = content.courseId ? content.courseId : content.identifier;
    JBridge.logContentClickEvent("COURSES", index_click, "", contentId, content.pkgVersion);
        var whatToSend = {
          "course": tmp
          };
          if(this.totalDetails[0].courseId){
           var event = { tag: 'OPEN_EnrolledCourseFlowFromCourseViewAll', contents: whatToSend };
          }else{
           var event = { tag: 'OPEN_CourseInfoFlowFromCourseViewAll', contents: whatToSend };
          }
          JBridge.logListViewEvent("COURSES");
        window.__runDuiCallback(event);
  }

  onStop = () =>{
    window.__PermissionDeniedDialog.hide();
  }

  onBackPressed = () => {
    JBridge.logListViewEvent("COURSES");
    if(window.__PermissionDeniedDialog.getVisibility() == "visible"){
      window.__PermissionDeniedDialog.hide();
    }else{
      var event = { tag: 'BACK_CourseViewAllActivity', contents: [] }
      window.__runDuiCallback(event);
    }
  }

  handleViewMoreClick = () =>{
    window.__LoaderDialog.show();
    this.temp1++;
       if(JBridge.isNetworkAvailable()){
            var callback = callbackMapper.map(function(data){
              data[0] = JSON.parse(utils.decodeBase64(data[0]));
              _this.displayContent=data[0];
              _this.totalDetails=[];
              console.log("data from response",data[0]);
              for(var i = _this.start_index*10;i<_this.displayContent.length;i++){
                  _this.totalDetails.push(_this.displayContent[i]);
              }
              _this.start_index++;
              _this.showList();
              window.__LoaderDialog.hide();
             if(((_this.start_index+1)*10>_this.displayContent.length)
              ||(_this.displayContent.length>=999)){
                _this.changeViewMoreButtonStatus();
              }
              });
              JBridge.searchContent(callback, JSON.stringify(this.searchQuery), "", "Course",(_this.start_index+2)*10, null, true);
        }else{
          window.__LoaderDialog.hide();
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
        }
  }

  changeViewMoreButtonStatus=()=>{
  JBridge.hideFooterView(
    this.idSet.listContainer,
    this.idSet.viewMoreButton
  );
  }

  render() {
    this.layout = (
        <LinearLayout
        width="match_parent"
        height="match_parent"
        root = "true"
        afterRender={this.showList}
        background={window.__Colors.PRIMARY_LIGHT}
        orientation="vertical">
        <SimpleToolbar
          afterRender={this.afterRender}
          width="match_parent"
          menuData={this.menuData}
          onBackPress={this.onBackPressed}
          showMenu="true"
          title= {this.appbarTitle}/>
          <ListView
          id={this.idSet.listContainer}
          width="match_parent"
          height="match_parent"/>
      </LinearLayout>
      );
    return this.layout.render();
  }
}

module.exports = Connector(CourseViewAllActivity);
