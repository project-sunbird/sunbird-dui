var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var LargeCardComponent = require('../components/Sunbird/core/LargeCardComponent');
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");


var utils = require('../utils/GenericFunctions');
var objectAssign = require('object-assign');
window.R = require("ramda");

var _this;

class CourseViewAllActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.jsonArray=[];
    this.temp1=0;
    this.j = 0;
    this.viewTypeMap = ["ic_action_course"];
    this.setIds([
      "listItems",
      "viewMoreButton",
      "listContainer",
      "textView",
      "image"
    ]);
    this.state = state;

    this.screenName = "CourseViewAllActivity";

    this.shouldCacheScreen = false;

    this.totalDetails = JSON.parse(state.data.value0.courseViewAllDetails);
    this.searchQuery = this.totalDetails.hasOwnProperty("searchQuery") ? this.totalDetails.searchQuery : null;
    this.btnStatus = this.totalDetails.viewMore;
    this.displayContent = [];
    this.start_index = 0;
    this.appbarTitle = this.totalDetails.title; 
    this.totalDetails = this.totalDetails.courseListDetails;
    this.menuData = {
    url: [
    ]
    }
    JBridge.logListViewScreenEvent("COURSES",this.totalDetails.length,this.searchQuery)

    _this = this;
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

  checkEnrolledCourse = (identifier) =>{
    
    var enrolled = false;
    window.__enrolledCourses.map(function(item){
      if(item.courseId == identifier){
        enrolled = true;
      }
    })

     return enrolled;

  }
 getRows = () =>
 {
  return (<ListView
    id={this.idSet.listContainer}
    width="match_parent"
    height="match_parent"/>);
 }
  showList = () =>{
     console.log("data in cva",this.totalDetails)
     var list = this.totalDetails;
     this.jsonArray=[];
     let viewType = 0
      list.map((item,i) => {
                var progressCount = item.leafNodesCount == null ? 0 : (item.progress/item.leafNodesCount)*100;
                progressCount = parseInt(progressCount)
                var appIcon;
                
                  var appIcon,name,isProgress,size,actionText,type;
                  if(item.courseId){
                    appIcon = item.courseLogoUrl ? item.courseLogoUrl : "ic_action_course";
                    viewType = this.viewTypeMap.indexOf(appIcon);
                    if(viewType ==-1){
                      this.viewTypeMap.push(appIcon);
                      viewType=this.viewTypeMap.length-1;
                    }
                    name = item.courseName
                    isProgress = "true"
                    size = window.__S.COURSE_PROGRESS_COMPLETED.format(progressCount)
                    actionText = window.__S.RESUME;
                    type = null;
                  }
                  else if(item.identifier) {
                    appIcon = item.appIcon ? item.appIcon : "ic_action_course";
                    viewType = this.viewTypeMap.indexOf(appIcon);
                    if(viewType ==-1){
                      this.viewTypeMap.push(appIcon);
                      viewType=this.viewTypeMap.length-1;
                    }
                    name = item.name
                    isProgress = "false"
                    size = item.hasOwnProperty("size") ? window.__S.FILE_SIZE.format(utils.formatBytes(item.size)) : "";
                    actionText = window.__S.OPEN
                    type = _this.checkEnrolledCourse(item.identifier) ? "ENROLLED" : null;
                  }
                  else{
                    appIcon = "ic_action_course"
                    viewType=0;
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

                  

           var layout = (
          <LargeCardComponent
                   data={temp}
                   content={item}
                   index = {i}
                   onResourceClick = {this.handleCourseClick}/>)
                   this.jsonArray.push({ view: this.getView(layout.render()),value:"",viewType:0});
                   this.j++;
       });

       var callback = callbackMapper.map(function() {
        console.log("button pressed");  
        _this.handleViewMoreClick();
      });

       if(this.temp1==0)
        {
       JBridge.listViewAdapterWithBtn(
        this.idSet.listContainer,
        JSON.stringify(this.jsonArray),
        1000,
        "View more",
        callback
      );
    }else
    {
        JBridge.appendToListView(
        this.idSet.listContainer,
        JSON.stringify(this.jsonArray),
        1000);
    }
    }


  afterRender = () => {
    console.log("after render");
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

        }
        if(data == "DeniedPermanently"){
          console.log("DENIED DeniedPermanently");
          window.__PermissionDeniedDialog.show("ic_warning_grey", window.__S.STORAGE);
        }

        });

        JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");
  }

  performCourseAction = (content,index) =>{
       var tmp = JSON.stringify(content)
       var index_click = this.start_index <1 ? index+1 : index+(this.start_index*10)+1;
       var contentId = content.courseId ? content.courseId : content.identifier;
        JBridge.logContentClickEvent("COURSES",index_click,"",contentId)
        var whatToSend = {
          "course": tmp 
          };
          if(this.totalDetails[0].courseId){
           var event = { tag: 'OPEN_EnrolledCourseFlowFromCourseViewAll', contents: whatToSend };
          }
          else{
           var event = { tag: 'OPEN_CourseInfoFlowFromCourseViewAll', contents: whatToSend }; 
          }
        window.__runDuiCallback(event);
  }


  onStop = () =>{
    window.__PermissionDeniedDialog.hide();
  }


  getLineSeperator = () =>{
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  onBackPressed = () => {
    
    if(window.__PermissionDeniedDialog.getVisibility() == "visible"){
      window.__PermissionDeniedDialog.hide();
      return;
    }else{
      var whatToSend = []
      var event = { tag: 'BACK_CourseViewAllActivity', contents: whatToSend }
      window.__runDuiCallback(event);
    }

  }
  
  handleViewMoreClick = () =>{
    var listContent = [];
    this.temp1++;
   // window.__LoaderDialog.show();
    // if(this.displayContent == "[]" || this.displayContent.length == 0){
       if(JBridge.isNetworkAvailable()){
            var callback = callbackMapper.map(function(data){
              data[0] = JSON.parse(utils.decodeBase64(data[0]));
              _this.displayContent=data[0];
              console.log("data from response",data[0])
              _this.displayContent.map(function(item,index){
                if(index > _this.start_index*10 && index<(_this.start_index+1)*10 && index<_this.displayContent.length)
                  listContent.push(item)
              })
              _this.start_index++;
              _this.totalDetails=listContent;
              _this.showList();
              // _this.appendChild(_this.idSet.listItems,_this.showList().render(),_this.start_index)
              window.__LoaderDialog.hide();
            /*  if(_this.start_index*10>=_this.displayContent.length){
                _this.changeViewMoreButtonStatus("gone")
              }
              */
              });
              JBridge.searchContent(callback, JSON.stringify(this.searchQuery), "", "Course", false,(_this.start_index+2)*10);
        }
        else{
          window.__LoaderDialog.hide();
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
        }
    
  }

  render() {
    this.layout = (
        <LinearLayout
        width="match_parent"
        height="match_parent"
        root = "true"
        clickable="true"
        background="#ffffff"
        afterRender={this.showList}
        orientation="vertical">
        <SimpleToolbar
          afterRender={this.afterRender}
          width="match_parent"orientation="vertical"
          menuData={this.menuData}
          onBackPress={this.onBackPressed}
          showMenu="true"
          invert="true"
          title= {this.appbarTitle}/>   
                    
                      {
                        this.getRows()
                      }
      </LinearLayout>
      );

    return this.layout.render();
  }
}

module.exports = Connector(CourseViewAllActivity);
