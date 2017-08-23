var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var ProfileHeader = require('../../components/Sunbird/ProfileHeader');
var ComingSoonComponent = require('../../components/Sunbird/ComingSoonComponent');
var PersonalDetails = require('../../components/Sunbird/PersonalDetails');
var ProfileExperiences = require('../../components/Sunbird/ProfileExperiences');
var ProfileSkillTags = require('../../components/Sunbird/ProfileSkillTags');
var ProfileAccomplishments = require('../../components/Sunbird/ProfileAccomplishments');
var ProfileCreations = require('../../components/Sunbird/ProfileCreations');
var ProfileBadges = require('../../components/Sunbird/ProfileBadges');
var ProfileProgress = require('../../components/Sunbird/ProfileProgress');
var ProfileAdditionalInfo = require('../../components/Sunbird/ProfileAdditionalInfo');
var ProfilAffiliations = require('../../components/Sunbird/ProfileAffiliations');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var utils = require('../../utils/GenericFunctions');


var _this;
class ProfileFragment extends View {
  constructor(props, children) {
    super(props, children);
    console.log(props, "this.props");

    this.props.appendText = this.props.appendText || "";
    this.setIds([

    ]);

    _this = this;
    this.isEditable = this.props.editable;
    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" },
        { imageUrl: "ic_action_notification"},
        { imageUrl: "ic_action_overflow" }
      ]
    }
    this.popupMenu="Logout";

    this.handleResponse();
  }


  logout = () =>{
    window.__Logout();
  }

  handleResponse = () => {
    console.log("this.props.response", this.props.response);
    if (this.props.response) {
      if (!this.props.response.sendBack){
        var whatToSend = {
          user_token: window.__userToken,
          api_token: window.__apiToken,
          sendBack : JSON.stringify(this.props.response),
          filters: JSON.stringify({"filters" : {
                     "createdBy": this.props.response.result.response.userId,
                     "status": ["Live"],
                     "contentType": ["Collection", "Story", "Worksheet", "TextBook", "Course", "LessonPlan"]
                 }
               })
         }
        var event = { tag: "API_CreatedBy", contents: whatToSend}
        window.__runDuiCallback(event);
      }
      var profileData = JSON.parse(this.props.response.sendBack)
      this.details = profileData.result.response;
      this.description = this.details.profileSummary ? this.details.profileSummary : ""
      this.createdBy = this.props.response.result;
      this.jobProfile = this.details.jobProfile;
      this.education = this.details.education;
      console.log("this.createdBy", this.createdBy);
    } else {
      this.details = {};
      this.description = "";
      this.createdBy = {};
    }
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,15"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  overFlowCallback = (params) => {
    if(params == 0){
      this.logout();
    }
  }


  afterRender() {}

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin = "0, 10, 0, 10"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getDescription = () => {
    console.log("this.details", this.details.profileSummary);
    if(this.details.profileSummary){
      console.log("inside getDescription");
      return(
        <LinearLayout
          orientation = "vertical"
          height = "wrap_content"
          width = "match_parent">

          {this.getLineSeperator()}
          {
          // <TextView
          //   text = "Description"
          //   style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
          }
            <CropParagraph
              height = "wrap_content"
              margin = "0,0,0,12"
              width = "match_parent"
              headText = { window.__S.DESCRIPTION }
              contentText = { this.details.profileSummary }/>

        </LinearLayout>
      )
    } else {
      return (
        <LinearLayout
          orientation = "vertical"
          height = "wrap_content"
          width = "match_parent">
        </LinearLayout>
      )
    }

  }

  handleMenuClick = (url) => {
    if (url == "ic_action_notification") {
      JBridge.showSnackBar(window.__S.COMMING_SOON);
    } else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Profile" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_CommProfSearchActivity", contents: whatToSend}
      window.__runDuiCallback(event);
    }
  }

  handleCreatedCardClick = (item) => {
    var itemDetails = JSON.stringify(item);
    if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook" || item.contentType.toLowerCase() == "course" || utils.checkEnrolledCourse(item.identifier)){
      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_EnrolledCourseActivity",contents:whatToSend}
        window.__runDuiCallback(event);
      }else{
        this.setPermissions();
      }
    } else {
      var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");
      var resDetails = {};
      resDetails['imageUrl'] = item.appIcon;
      resDetails['title'] = item.name;
      resDetails['description'] = item.description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;
      resDetails['screenshots'] = item.screenshots || [] ;
      resDetails['content'] = item;

      var whatToSend = {resourceDetails:JSON.stringify(resDetails)}
      var event= {tag:"OPEN_ResourceDetailActivity",contents:whatToSend}
      window.__runDuiCallback(event);
    }
  }

  render() {

    this.layout = (

  <RelativeLayout
     height="match_parent"
     width="match_parent">
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        height="match_parent">


          <SimpleToolbar
            title={window.__S.PROFILE_LW}
            width="match_parent"
            menuData={this.menuData}
            popupMenu={this.popupMenu}
            overFlowCallback = {this.overFlowCallback}
            onMenuItemClick={this.handleMenuClick}
            showMenu="true"
            hideBack="true"
            invert="true"/>


          <ScrollView
            height="0"
            weight="1"
            width="match_parent">

              <LinearLayout
                height="match_parent"
                width="match_parent"
                padding={"0,0,0,50"}
                padding="16,16,16,0"
                orientation="vertical">

                <ProfileHeader
                  data={this.details}/>

                {this.getDescription()}

                <ProfileExperiences
                  editable = {this.isEditable}
                  data = {this.education}
                  heading = "Education"/>

                <ProfileExperiences
                  editable = {this.isEditable}
                  data = {this.jobProfile}
                  heading = "Experiences"/>

                <ProfileCreations
                  data = {this.createdBy}
                  editable = {this.editable}
                  onCardClick = {this.handleCreatedCardClick}/>

                <ProfileAdditionalInfo
                  data={this.details}
                  editable = {this.isEditable}/>

              </LinearLayout>

         </ScrollView>

        </LinearLayout>




   </RelativeLayout>


    )

    return this.layout.render();
  }
}

module.exports = ProfileFragment;
