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

var utils = require('../utils/GenericFunctions');
var objectAssign = require('object-assign');
window.R = require("ramda");

var _this;

class CourseViewAllActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "listItems",
      "viewMoreButton"
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


  getRows = (list) =>{

     console.log("data in cva",this.totalDetails)
     // if(list == undefined)
     //  list = this.totalDetails;


      var rows = list.map((item,i) => {
                var progressCount = item.leafNodesCount == null ? 0 : (item.progress/item.leafNodesCount)*100;
                progressCount = parseInt(progressCount)
                var appIcon;
                
                  var appIcon,name,isProgress,size,actionText,type;
                  if(item.courseId){
                    appIcon = item.courseLogoUrl ? item.courseLogoUrl : "ic_action_course";
                    name = item.courseName
                    isProgress = "true"
                    size = window.__S.COURSE_PROGRESS_COMPLETED.format(progressCount)
                    actionText = window.__S.RESUME;
                    type = null;
                  }
                  else if(item.identifier) {
                    appIcon = item.appIcon ? item.appIcon : "ic_action_course";
                    name = item.name
                    isProgress = "false"
                    size = item.hasOwnProperty("size") ? window.__S.FILE_SIZE.format(utils.formatBytes(item.size)) : "";
                    actionText = window.__S.OPEN
                    type = _this.checkEnrolledCourse(item.identifier) ? "ENROLLED" : null;
                  }
                  else{
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
    this.changeViewMoreButtonStatus(this.btnStatus)
  }

  handleCourseClick = (content)=>{


    if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        this.performCourseAction(content);
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
          window.__PermissionDeniedDialog.show("ic_warning_grey", window.__S.STORAGE_DENIED);
        }

        });

        JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");
  }

  performCourseAction = (content) =>{
       var tmp = JSON.stringify(content)

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

  changeViewMoreButtonStatus(status){
    
      var cmd = this.set({
        id: this.idSet.viewMoreButton,
        visibility: status
      });
      Android.runInUI(cmd, 0);
    
  }

  
  handleViewMoreClick = () =>{
    var listContent = [];
    window.__LoaderDialog.show();
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
              console.log(listContent)
              _this.appendChild(_this.idSet.listItems,_this.getRows(listContent).render(),_this.start_index)
              window.__LoaderDialog.hide();
              if(_this.start_index*10>=_this.displayContent.length){
                _this.changeViewMoreButtonStatus("gone")
              }
              
              });
              JBridge.searchContent(callback, JSON.stringify(this.searchQuery), "", "Course", false,(_this.start_index+2)*10);
        }
        else{
          window.__LoaderDialog.hide();
          JBridge.showSnackBar(window.__S.ERROR_NO_INTERNET_MESSAGE)
        }
    // }
    // else{
    //       this.displayContent.map(function(item,index){
    //         if(index > _this.start_index*10 && index<(_this.start_index+1)*10 && _this.start_index<_this.displayContent.length)
    //           listContent.push(item)
    //       })
    //       _this.start_index++;
    //       _this.appendChild(_this.idSet.listItems,_this.getRows(listContent).render(),_this.start_index)
    //       window.__LoaderDialog.hide();
    //       if(_this.start_index*10>=_this.displayContent.length){
    //             _this.changeViewMoreButtonStatus("gone")
    //       }
          

    // }
    // console.log(this.start_index,this.displayContent.length)
    //  if(this.start_index >= 9 ){
    //   _this.changeViewMoreButtonStatus("gone")
      
    //  }

  }

  render() {
    this.layout = (
      <LinearLayout
        width="match_parent"
        height="match_parent"
        root = "true"
        clickable="true"
        background={window.__Colors.WHITE}
        orientation="vertical">
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
                  height = "match_parent"
                  width = "match_parent"
                  orientation = "vertical"
                  layouTransition="true"
                  >

                      <LinearLayout
                        height="match_parent"
                        width="match_parent"
                        orientation="vertical"
                        padding= "0,0,0,16"
                        id = {this.idSet.listItems}
                        >

                        {this.getRows(this.totalDetails)}


                      </LinearLayout>
                      <LinearLayout
                              width = "match_parent"
                              height = "50"
                              margin = "16,16,16,16"
                              layouTransition="true"
                              id = {this.idSet.viewMoreButton}
                              background = {window.__Colors.PRIMARY_DARK}
                              gravity = "center"
                              visibility = "gone"
                              >
                              <TextView
                                height = "match_parent"
                                width = "match_parent"
                                gravity="center"
                                onClick = {this.handleViewMoreClick}
                                text = {window.__S.VIEW_MORE}
                                style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                                />
                            </LinearLayout>  
                </LinearLayout>

                </ScrollView>



      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseViewAllActivity);
