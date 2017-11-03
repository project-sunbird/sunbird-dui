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
        { imageUrl: "ic_scanqr"},
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
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }
  getTodoProfileCard=(index)=>{
   this.profileData = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedProfile")));
    this.profileData= JSON.parse(utils.decodeBase64(this.profileData.response.status[1]));
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
      if(editButtonText=="address"){
          editButtonText=window.__S.TITLE_ADDRESS;
        }
      else if(editButtonText=="education"){
          editButtonText=window.__S.TITLE_EDUCATION;
        }
      else if(editButtonText=="jobProfile"){
          editButtonText=window.__S.TITLE_EXPERIENCES;
        }
      else if(editButtonText=="dob"){
          editButtonText=window.__S.DATE_OF_BIRTH;
        }
      else if(editButtonText=="grade"){
          editButtonText=window.__S.GRADE;
        }
      else if(editButtonText=="gender"){
          editButtonText=window.__S.GENDER;
        }
      else if(editButtonText=="profileSummary"){
          editButtonText=window.__S.DESCRIPTION;
        }
      else if(editButtonText=="lastName"){
           editButtonText=window.__S.LAST_NAME;
        }
      else if (editButtonText=="subject")
        {
           editButtonText=window.__S.SUBJECTS;
        }
      else if(editButtonText=="avatar"){
        return this.getTodoProfileCard(index+1);
        }
      else if(editButtonText=="location"){
           editButtonText=window.__S.CURRENT_LOCATION;
      }
      else{
        this.profileUpdateCardVisibility="gone";
      }

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
              circularImageUrl={"0,"+(data.avatar ? data.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc")}
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



  render() {
    var imgUrl = "ic_launcher";
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed" && JBridge.getFromSharedPrefs("logo_file_path") != "__failed"){
      imgUrl = "file://" + JBridge.getFromSharedPrefs("logo_file_path");
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
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                   <CourseInProgressContainer
                    addCardVisibility={this.profileUpdateCardVisibility}
                    transparent="true"
                    title={window.__S.TO_DO}
                    onCourseClick={this.handleUserCoursesClick}/>


                   {this.getSpaceSeparator()}

                    <HomeRecommendedContainer
                         title= {window.__S.RECOMMENDED}
                         onCourseOpenClick = {this.handleCourseOpen}
                         onResourceOpenClick = {this.handleResourceOpen}/>


               </LinearLayout>

            </ScrollView>


      </LinearLayout>




      )


    return this.layout.render();
  }
  handleEditProfileClick = (editButtonText) => {
    if(editButtonText=="avatar")
      {
        editButtonText=this.props.data.missingFields[1]||"";
      }
    if(editButtonText=="address"){
      window.__AddressPopUp.data=undefined;
      window.__AddressPopUp.show();
      return ;
      }
    else if(editButtonText=="education"){
      window.__EducationPopUp.data=undefined;
      window.__EducationPopUp.show();
      return;
      }
    else if(editButtonText=="jobProfile"){
      window.__ExperiencePopUp.data=undefined;
      window.__ExperiencePopUp.show();
      return;
      }
        console.log("testing",this.profileData.result.response)
        var whatToSend = { "profile" : JSON.stringify(this.profileData.result.response)}
        var event ={ tag: "OPEN_EditProfileActivity", contents: whatToSend }
        window.__runDuiCallback(event);

      }

}


module.exports = HomeFragment;
