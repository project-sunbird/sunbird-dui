var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");

var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var objectAssign = require('object-assign');
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var CourseInProgressContainer = require('../../components/Sunbird/CourseInProgressContainer');
var HorizontalProgressBar = require('../../components/Sunbird/HorizontalProgressBar');
var utils = require('../../utils/GenericFunctions');
var Button = require('../../components/Sunbird/Button');
var AnnouncementCard = require('../../components/Sunbird/AnnouncementCard');
const CommunityParams = require('../../CommunityParams');



window.R = require("ramda");


var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');


var HomeRecommendedContainer = require('../../components/Sunbird/HomeRecommendedContainer');
var HomeTodoContainer = require('../../components/Sunbird/HomeTodoContainer');


class HomeFragment extends View {
  constructor(props, children) {
    super(props, children);

    this.menuData = {
      url: [
       // { imageUrl: "ic_scanqr"}, // hide qr scanner feature
        { imageUrl: "ic_action_search" }
      ]
    }
    JBridge.logTabScreenEvent("HOME");
    window.setEnrolledCourses = this.setEnrolledCourses;
    this.profileData="";
    this.profileUpdateCardVisibility="gone";
  }

  setEnrolledCourses = (list) => {
    this.enrolledCourses = list;

    window.__UpdateUserCourses(this.enrolledCourses);
  }


  handleAnnouncementClick = (item) => {

    var whatToSend = { "announcementData" : JSON.stringify(item)}
    var event ={ tag: "OPEN_AnnouncementDetailActivity", contents: whatToSend }
    window.__runDuiCallback(event);

  }

  handleTodoClick = (index) => {
    console.log("Todo Clicked index is ", index);
  }

  handleViewAllTodoClick = () => {
    console.log("View All todos in home");
  }
  handleUserCoursesClick = (content, type) => {
    var whatToSend = { "course": JSON.stringify(content) }
    var event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    window.__runDuiCallback(event);
  }




  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {

    }
    if (url == "ic_action_search") {

      var searchDetails = { filterDetails: "", searchType: "Combined" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      window.__runDuiCallback(event);
    } else if (url == "ic_scanqr") {
      var whatToSend = []
      var event = { tag: "OPEN_QRActivity", contents: whatToSend }
      window.__runDuiCallback(event);
    }
  }


  handleResourceOpen = (data) => {
    console.log("resourceDetails");
    var whatToSend={ "resourceDetails": "nothing" }
    var event ={ tag: "OPEN_ResourceDetailActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleCourseOpen = (data) => {
    var whatToSend = { "course": "something" }
    var event = { tag: "OPEN_CourseInfoActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleRecommendedClick = (content) => {
    console.log("Recommended clicked :", content.downloadUrl)

  }
  getLocalData = (data) => {
    console.log("data from android ", JSON.parse(data));
  }

  getSpaceSeparator = () => {
    return (<LinearLayout
             height="4"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }
  getTodoProfileCard=(index)=>{
    try {
      this.profileData = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedProfile")));
      this.profileData= JSON.parse(utils.decodeBase64(this.profileData.response.status[1]));
      } catch (error) {
        return(<LinearLayout/>);
    }
    var data= this.profileData.result.response;
    if(data.completeness==100||data.completeness==undefined)
      {
        this.profileUpdateCardVisibility="gone";
        return(<LinearLayout
        height="match_parent"/>);
      }
      this.profileUpdateCardVisibility="visible";
      if(data.hasOwnProperty("missingFields")&&(index<data.missingFields.length)&&data.missingFields[index]!=undefined){
      var editButtonText=data.missingFields[index];
      }
      else{
        var editButtonText="";
        this.profileUpdateCardVisibility="gone";
      }
      switch(editButtonText){
        case "address" : editButtonText = window.__S.TITLE_ADDRESS;
        break;
        case "education" : editButtonText=window.__S.TITLE_EDUCATION;
        break;
        case "jobProfile" : editButtonText=window.__S.TITLE_EXPERIENCE;
        break;
        case "dob" : editButtonText=window.__S.DATE_OF_BIRTH;
        break;
        case "grade" :  editButtonText=window.__S.GRADE;
        break;
        case "gender" : editButtonText=window.__S.GENDER;
        break;
        case "profileSummary" : editButtonText=window.__S.DESCRIPTION;
        break;
        case "lastName" : editButtonText=window.__S.LAST_NAME;
        break;
        case "subject" : editButtonText=window.__S.SUBJECTS;
        break;
        case "location" : editButtonText=window.__S.CURRENT_LOCATION;
        break;
        case "avatar" : editButtonText=window.__S.AVATAR;
        break;
        default : this.profileUpdateCardVisibility="gone";
      }
      this.avatarImageUrl=data.avatar ? data.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc";
    return(
      <LinearLayout
      width="200"
      height="match_parent"
      margin="16,0,0,0"
      orientation="vertical"
      onClick={()=>this.handleEditProfileClick(data.missingFields[index])}>
      <LinearLayout
      widht="match_parent"
      height="110"
      cornerRadius="4"
      stroke ={"2," + window.__Colors.PRIMARY_BLACK_66}
      orientation="vertical">
      <HorizontalProgressBar
            width="match_parent"
            height="4"
            progressBarColor={window.__Colors.PRIMARY_ACCENT}
            cornerRadius={"12,12,0,0"}
            currentProgress={data.completeness}
            totalProgress={100}/>
      <LinearLayout
      width="match_parent"
      height="match_parent"
      orientation="horizontal">
      <ImageView
              width="74"
              height="74"
              margin="16,16,0,0"
              circularImageUrl={"0,"+(this.avatarImageUrl)}
              stroke ={"2," + "#d8d8d8"}
              cornerRadius="37"/>
            <LinearLayout
            width="match_parent"
            height="match_parent"
            gravity="center"
            margin="8,20,16,20"
            orientation="vertical">
            <TextView
            widht="'wrap_content"
            height="wrap_content"
            gravity="left"
            text={window.__S.STRENGTHEN_YOUR_PROFILE}
            style={window.__TextStyle.textStyle.CARD.HEADING}/>
            <TextView
            width="wrap_content"
            height="wrap_content"
            gravity="center"
            margin="0,10,0,0"
            text={utils.cropText(window.__S.ADD+" "+editButtonText,14)}
            style={window.__TextStyle.textStyle.HINT.TINY}/>
            </LinearLayout>
              </LinearLayout>
              </LinearLayout>
              <LinearLayout
              width="match_parent"
              height="match_parent"
              margin="0,8,0,0">
              <LinearLayout
              weight="1"
              padding="0,0,8,0"
              height="match_parent">
              <TextView
              width="match_parent"
              height="match_parent"
              text={window.__S.YOUR_PROFILE_IS.format(data.completeness)}
              style={window.__TextStyle.textStyle.HINT.TINY}/>
              </LinearLayout>
              <Button
                type="SmallButton_Secondary_BT"
                width="wrap_content"
                height="wrap_content"
                text={window.__S.UPDATE}
                onClick={()=>this.handleEditProfileClick(data.missingFields[index])}/>

            </LinearLayout>
             </LinearLayout>
    )
  }
  getAnnouncementCard=()=>{
    var viewAllVisibility="gone";
    var cards = <LinearLayout/>
    var card1=(<LinearLayout/>),card2=(<LinearLayout/>);
    if(window.__AnnouncementApiData==undefined||window.__AnnouncementApiData.length==0)
      {
        cards= (<LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    background={window.__Colors.PRIMARY_LIGHT}>
                    <TextView
                      width="match_parent"
                      height="70"
                      gravity="center"
                      text={window.__S.NO_ANNOUNCEMENTS}/>
                  </LinearLayout>
          );
      }else{
        viewAllVisibility="visible";
        if(window.__AnnouncementApiData.length>0){
          card1 = (
          <AnnouncementCard
            params={window.__AnnouncementApiData[0]}
            onClick={()=>this.handleAnnouncementClick(window.__AnnouncementApiData[0])}/>
          );
        }
        if(window.__AnnouncementApiData.length>1){
          card2 = (
            <AnnouncementCard
            params={window.__AnnouncementApiData[1]}
            onClick={()=>this.handleAnnouncementClick(window.__AnnouncementApiData[1])}/>
            );
        }
        cards = (
          <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical">
          {card1}
          {this.getSpaceSeparator()}
          {card2}
          </LinearLayout>
        )
      }
    return (<LinearLayout
              height="wrap_content"
              width="match_parent"
              orientation="vertical"
              background={window.__Colors.LIGHT_GRAY}>
                <LinearLayout
                 width="match_parent"
                 height="wrap_content"
                 orientation="horizontal">
                  <TextView
                    height="wrap_content"
                    width="wrap_content"
                    padding="25,5,25,5"
                    text={window.__S.ANNOUNCEMENT}
                    style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
                  <TextView
                    height="wrap_content"
                    weight="1"
                    gravity="right"
                    padding="5,0,15,0"
                    visibility={viewAllVisibility}
                    onClick={()=>this.handleAnnouncementViewAllClick(window.__AnnouncementApiData)}
                    text={window.__S.VIEW_ALL}
                    style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>
                </LinearLayout>
                {cards}
              </LinearLayout>);
 }
 handleAnnouncementViewAllClick= (data1) =>{
   var data = {
     "details" : data1
   }

var whatToSend ={ "announcementDetails": JSON.stringify(data)}
   var event ={ tag: "OPEN_AnnouncementViewAllActivity", contents:  whatToSend}

   window.__runDuiCallback(event);
}

  render() {
    var imgUrl = "ic_launcher";
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed"){
      imgUrl = JBridge.getFromSharedPrefs("logo_url");
    }
    this.layout = (

      <LinearLayout
        orientation="vertical"
        width="match_parent"
        root="true"
        height="match_parent">


         <SimpleToolbar
            title=""
            width="match_parent"
            showMenu="true"
            logo={imgUrl}
            invert="true"
            hideBack="true"
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}/>



            <ScrollView
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                   <CourseInProgressContainer
                    addCard={this.getTodoProfileCard(0)}
                    addCardVisibility={this.profileUpdateCardVisibility}
                    transparent="true"
                    title={window.__S.TO_DO}
                    onCourseClick={this.handleUserCoursesClick}/>


                   {this.getSpaceSeparator()}

                    <HomeRecommendedContainer
                         title= {window.__S.RECOMMENDED}
                         onCourseOpenClick = {this.handleCourseOpen}
                         onResourceOpenClick = {this.handleResourceOpen}/>
                    {this.getAnnouncementCard()}
               </LinearLayout>

            </ScrollView>


      </LinearLayout>
      )
    return this.layout.render();
  }

  handleEditProfileClick = (editButtonText) => {
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return;
    }
    var whatToSend = "";
    var event = ""
    switch(editButtonText){
      case "address" :
      whatToSend = { "profile": "" }
      event = { tag: 'OPEN_AddressActivity', contents: whatToSend }
      break;
      case "education" :
      whatToSend = { "profile": "" }
      event = { tag: 'OPEN_EducationActivity', contents: whatToSend }
      break;
      case "jobProfile" :
      whatToSend = { "profile": "" }
      event = { tag: 'OPEN_ExperienceActivity', contents: whatToSend }
      break;
      case "avatar" : window.__ProfileImagePopUp.show(); 
      return;     
      default :
      whatToSend = { "profile" : JSON.stringify(this.profileData.result.response)}
      event ={ tag: "OPEN_EditProfileActivity", contents: whatToSend }
      }
      window.__runDuiCallback(event);
    }
}

module.exports = HomeFragment;
