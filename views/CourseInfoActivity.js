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
var utils = require('../utils/GenericFunctions');

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');
var PageOption = require('../components/Sunbird/core/PageOption');
var CourseProgress = require('../components/Sunbird/CourseProgress');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var SharePopup = require('../components/Sunbird/core/SharePopup');

var _this;
class CourseInfoActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
      "descriptionContainer",
      "downloadProgressText",
      "totalContainer",
      "sharePopupContainer"
    ]);
    this.state = state;
    this.screenName = "CourseInfoActivity"
    
    this.menuData = {
      url: [
        {imageUrl: "ic_action_share_black" },
      ]
    }

    this.shouldCacheScreen = false;
    
    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;


    _this = this;


    this.details = JSON.parse(state.data.value0.courseDetails);


    this.checkContentLocalStatus(this.details.identifier);
   this.data = {
      courseName: this.details ? this.details.name : "",
      courseDesc: this.details ? this.details.description : "",
      competedCount: this.details && this.details.footerTitle ? this.details.footerTitle.split('%')[0] : "10",
    };
  }


  getSpineStatus = (pValue) => {
    var cmd;
    var data = JSON.parse(pValue);

    if (data.identifier != this.details.identifier)
      return;

    var textToShow = ""
    data.downloadProgress = data.downloadProgress == undefined ? 0 : data.downloadProgress;
    var downloadedPercent = parseInt(data.downloadProgress);
    downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;

    if (downloadedPercent == 100) {
      this.checkContentLocalStatus(this.details.identifier);

    } else {
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        text: window.__S.FETCHING_CONTENTS.format(downloadedPercent)
      })
      Android.runInUI(cmd, 0);
    }
  }

  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function(status) {

      if (status == "true") {
        var callback1 = callbackMapper.map(function(data) {
          data[0] = utils.jsonifyData(data[0])
          _this.courseContent = JSON.parse(data[0]);
          _this.renderCourseChildren()
        });
        JBridge.getChildContent(identifier, callback1)
      } else {
         var callback22= callbackMapper.map(function(data){
          data = JSON.parse(data)
          if(data.status==="NOT_FOUND"){
              if(JBridge.isNetworkAvailable())
                JBridge.importCourse(identifier,"false")
              else
                JBridge.showSnackBar(window.__S.NO_INTERNET)
          }
        })

        JBridge.getContentImportStatus(identifier,callback22)
      }

    });
    JBridge.getLocalContentStatus(identifier, callback);
  }



  renderCourseChildren = () => {
    console.log("RENDRING BREKAUP", this.courseContent)
    var child;
    if(this.courseContent.children==undefined){
      child = <TextView
                  height="300"
                  width="match_parent"
                  gravity="center"
                  root="true"
                  text={window.__S.ERROR_CONTENT_NOT_FOUND} />
    }
    else{
       child = (<CourseCurriculum
                  height="match_parent"
                  width="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  shouldGoForward={"gone"}
                  content= {this.courseContent.children}/>)
      }

      var layout = (
        <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical">

          <TextView
          width="wrap_content"
          height="wrap_content"
          margin="0,16,0,0"
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
          text={window.__S.STRUCTURE}/>

          {child}

        </LinearLayout>
        )
    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }


  onPop = () => {

    Android.runInUI(
      this.animateView(),
      null
    );
  }



  afterRender = () => {

    this.shareContent();

    if(window.__enrolledCourses == undefined){
      window.__LoaderDialog.show();
      var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken} 
      var event ={ "tag": "API_EnrolledCoursesList", contents: whatToSend};
      window.__runDuiCallback(event);
    }else{

      this.replaceChild(this.idSet.totalContainer,this.getBody().render(),0);
      var enrolledIds = window.__enrolledCourses;
      enrolledIds.map((item)=>{
      if(item.courseId == this.details.identifier){
          var whatToSend = { "course": this.state.data.value0.courseDetails }
          var event = { tag: 'OPEN_EnrolledActivity', contents: whatToSend }
          window.__runDuiCallback(event);

        }
      })
    }

  }


  handleStateChange = (state) => {
    window.__LoaderDialog.hide();
    var status = state.response.status[0];
    var response = JSON.parse(utils.decodeBase64(state.response.status[1]));
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];

    
    if (parseInt(responseCode) != 200) {
      return;
    }

    var result = response.result;

    if (response.params.err) {
      JBridge.showSnackBar(response.params.errmsg)
      return;
    }

    switch (state.responseFor + "") {
      case "API_EnrollCourse":
        if (result.response == "SUCCESS") {
          JBridge.showSnackBar(window.__S.COURSE_ENROLLED)
          var whatToSend = { "course": this.state.data.value0.courseDetails }
          var event = { tag: 'OPEN_EnrolledActivity', contents: whatToSend }
          window.__runDuiCallback(event);
        } else {
          JBridge.showSnackBar(window.__S.RETRY_ACTION)
        }
        break;


      case "API_EnrolledCoursesList":

        window.__enrolledCourses = response.result.courses;
        window.__LoaderDialog.hide();

        var enrolledIds = window.__enrolledCourses;
        enrolledIds.map((item)=>{
        if(item.courseId == this.details.identifier){
            var whatToSend = { "course": this.state.data.value0.courseDetails }
            var event = { tag: 'OPEN_EnrolledActivity', contents: whatToSend }
            window.__runDuiCallback(event);

          }
        })

        break;
        
      default:

        break;


    }

  }



  shareContent = () =>{

    console.log("SHARE POP UP CALLED")

    var shareCallback = callbackMapper.map(function(data) {
    var input = [
                 {
                    type : "text",
                    data : "staging.open-sunbird.org/public/"+_this.details.identifier
                 }
                ];

            
      var sharePopUp = (
        <SharePopup
        data = {input}/>
        )

    _this.replaceChild(_this.idSet.sharePopupContainer,sharePopUp.render(),0);

    });

    JBridge.exportEcar(this.details.identifier, shareCallback);
  }


  handleEnrollClick = (data) => {
    if(JBridge.isNetworkAvailable()){


        window.__LoaderDialog.show();

        var whatToSend = { "user_token":window.__userToken,
        "reqParams": this.details.identifier,
        "api_token": window.__apiToken }
        var event = {
          "tag": "API_EnrollCourse",
          "contents": whatToSend
        }
        
        window.__runDuiCallback(event);
    }
    else{
      JBridge.showSnackBar(window.__S.NO_INTERNET)
    }
  }


  onBackPressed = () => {
   var whatToSend = []
   var event = { tag: 'BACK_CourseInfoActivity', contents: whatToSend }  
   
   window.__runDuiCallback(event);
  }

  getCurriculumnBrief = () => {
    var json = [];
    if(this.details.hasOwnProperty("contentTypesCount")){
        var Curriculum = JSON.parse(this.details.contentTypesCount);

        var index = 0;
        var json = [];
        for(var item in Curriculum){
          json.push({
            "count" : Curriculum[item],
            "type" : item
          })
        }
    }
    else{
      json.push({
        "count" : "Not",
        "type" : "Available"
      })
    }

    var items = json.map((item, i) => {
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

  handleMenuClick = (url) =>{
    if(url == "ic_action_share_black"){
      window.__SharePopup.show();
    }
  }


  getBody = () =>{
    var buttonList = [window.__S.ENROLL_COURSE];
    return (

      <LinearLayout
        root="true"
        width="match_parent"
        height="match_parent"
        background={window.__Colors.WHITE}
        orientation="vertical">

        <SimpleToolbar
            title=""
            width="match_parent"
            height="wrap_content"
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}
            showMenu="true"
            onBackPress={this.onBackPressed}
            invert="true"/>

        <LinearLayout
          id={this.idSet.parentContainer}
          height="match_parent"
          width="match_parent"
          orientation="vertical">
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
                  width="match_parent"
                  margin="0,0,0,12"
                  text={this.data.courseDesc}/>


                <TextView
                  margin="0,0,0,4"
                  text={window.__S.STRUCTURE}
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                  {this.getCurriculumnBrief()}



                <LinearLayout
                  id={this.idSet.descriptionContainer}
                  height="wrap_content"
                  width="match_parent"
                  gravity="center"
                  root="true"
                  orientation="vertical">
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
            </LinearLayout>);

  }




  logout = () =>{
    JBridge.showSnackBar("Logged out")
    JBridge.setInSharedPrefs("logged_in","NO");
    JBridge.setInSharedPrefs("user_id", "__failed");
    JBridge.setInSharedPrefs("user_name",  "__failed");
    JBridge.setInSharedPrefs("user_token",  "__failed");


    window.__pressedLoggedOut=true;

    JBridge.keyCloakLogout(window.__loginUrl  + "/auth/realms/sunbird/protocol/openid-connect/logout");
    
    window.__Logout();
  }


  render() {
    this.layout = (

     <RelativeLayout
      width="match_parent"
      height="match_parent"
      clickable="true"
      root="true">

        <LinearLayout
          background={window.__Colors.WHITE}
          orientation="vertical"
          id={this.idSet.totalContainer}
          width="match_parent"
          height="match_parent"/>
      

        <LinearLayout
         width="match_parent"
         height="match_parent"
         id={this.idSet.sharePopupContainer}/>

       

      </RelativeLayout> 
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseInfoActivity);
