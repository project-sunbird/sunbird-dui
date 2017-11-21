var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ProfileFragment = require('./Fragments/ProfileFragment');
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var ProfileHeader = require('../components/Sunbird/ProfileHeader');
var ComingSoonComponent = require('../components/Sunbird/ComingSoonComponent');
var PersonalDetails = require('../components/Sunbird/PersonalDetails');
var ProfileExperiences = require('../components/Sunbird/ProfileExperiences');
var ProfileSkillTags = require('../components/Sunbird/ProfileSkillTags');
var ProfileAccomplishments = require('../components/Sunbird/ProfileAccomplishments');
var ProfileCreations = require('../components/Sunbird/ProfileCreations');
var ProfileBadges = require('../components/Sunbird/ProfileBadges');
var ProfileProgress = require('../components/Sunbird/ProfileProgress');
var ProfileAdditionalInfo = require('../components/Sunbird/ProfileAdditionalInfo');
var ProfilAffiliations = require('../components/Sunbird/ProfileAffiliations');
var CropParagraph = require('../components/Sunbird/CropParagraph');

var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../utils/GenericFunctions');
window.R = require("ramda");

var _this;

class ProfileActivity extends View {
  constructor(props, children, state){
    super(props, children, state);

    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" },
        { imageUrl: "ic_action_notification"},
        { imageUrl: "ic_action_overflow" }
      ]
    }

    this.setIds([
      "mainHolder",
      "createdByHolder",
      "skillTagComponent"
    ]);

    this.popupMenu="Logout";

    _this = this;
    this.shouldCacheScreen = false;

    this.state = state;
    this.profile = JSON.parse(this.state.data.value0.profile);
    console.log("profileData in ProfileActivity::", this.profile);

    this.profileData = this.profile.data;
    this.jobProfile = this.profileData.jobProfile;
    this.education = this.profileData.education;
    this.createdBy = {}
    console.log("this.profileData", this.profileData);
    console.log("this.createdBy", this.createdBy);
    this.isEditable = "false"
    this.skills = "";
    }

  isAllFeildsPresent = () => {
    if ((this.profileData.profileSummary && this.profileData.profileSummary == "") || (this.education && this.education.length > 0) || (this.jobProfile && this.jobProfile.length > 0) || (this.createdBy && this.createdBy.content) || (this.profileData && this.profileData.language.length && this.profileData.language.length > 0 && this.profileData.address && this.profileData.address.length))
      return true;
    else
      return false;
  }

  onBackPressed = () => {
    var whatToSend = [];
    var event = {"tag": "BACK_ProfileActivity", contents: whatToSend};
    window.__runDuiCallback(event);
  }

  logout = () =>{
    window.__Snackbar.show(window.__S.LOGGED_OUT)
    JBridge.setInSharedPrefs("logged_in","NO");
    JBridge.setInSharedPrefs("user_id", "__failed");
    JBridge.setInSharedPrefs("user_name",  "__failed");
    JBridge.setInSharedPrefs("user_token",  "__failed");


    window.__pressedLoggedOut=true;

    JBridge.keyCloakLogout(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/logout");

    window.__Logout();
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,24,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  setPermissions = () => {

   var callback = callbackMapper.map(function(data) {

      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_warning_grey",window.__S.STORAGE);
      }

    });

    JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");

  }

  overFlowCallback = (params) => {
    if(params == 0){
      this.logout();
    }
  }

  getDescription = () => {
    console.log("this.details", this.profileData.profileSummary);
    if(this.profileData.profileSummary){
      console.log("inside getDescription");
      return(
        <LinearLayout
          orientation = "vertical"
          height = "wrap_content"
          width = "match_parent">

            {this.getLineSeperator()}

            <CropParagraph
              height = "wrap_content"
              margin = "0,0,0,12"
              width = "match_parent"
              headText = { window.__S.DESCRIPTION }
              contentText = { this.profileData.profileSummary }/>

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
      window.__Snackbar.show(window.__S.COMING_SOON);
    } else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Profile" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_CommProfSearchActivity_Prof", contents: whatToSend}
      window.__runDuiCallback(event);
    }
  }

  afterRender = () => {
    if(!this.isAllFeildsPresent()){
      console.log("displaying nothing");
      var layout = (
        <LinearLayout
          width = "match_parent"
          height = "match_parent"
          gravity="center_horizontal"
          alpha="0.33"
          orientation = "vertical">
          {this.getLineSeperator()}

          <ImageView
          height="70"
          width="70"
          margin="0,150,0,0"
          gravity="center_horizontal"
          imageUrl="ic_blank_doc"/>


          <TextView
            height = "wrap_content"
            width = "wrap_content"
            margin="0,30,0,0"
            style={window.__TextStyle.textStyle.HEADING.DARK}
            text = {window.__S.MSG_NO_DETAILS_TO_SHOW}
            gravity = "center_horizontal" />
        </LinearLayout>
      )
      this.replaceChild(this.idSet.mainHolder, layout.render(), 0);
    } else {
      var callback = callbackMapper.map((data) => {
        console.log("createdBy data", JSON.parse(utils.decodeBase64(data[0])));
        _this.createdBy = JSON.parse(utils.decodeBase64(data[0]));
        var layout = (
          <ProfileCreations
            data = {_this.createdBy}
            editable = {_this.editable}
            onCardClick = {_this.handleCreatedCardClick}/>
        );
        _this.replaceChild(_this.idSet.createdByHolder, layout.render(), 0);
      });
      if (JBridge.isNetworkAvailable())
        JBridge.searchContent(callback, "userToken", window.__userToken, "Combined", "true", 10);
      else
        console.log("JBridge.searchContent failed, no internet");
    }
    window.__LoaderDialog.hide();    
  }
  getSkills=()=>{
     if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
      return;
    }
    var request = {
      "endorsedUserId": this.profileData.id,
  }
  var whatToSend = {
    "user_token" : window.__user_accessToken,
    "api_token" : window.__apiToken,
    "requestBody" : JSON.stringify(request)
  }
  var event= { "tag": "API_GetSkills1", contents: whatToSend };
  this.getSkillsResponseCame=false;
    var event= { "tag": "API_GetSkills", contents: whatToSend }; 
    setTimeout(() => {
      if (this.getSkillsResponseCame) return;
      this.getSkillsResponseCame = true;
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.ERROR_GETTING_SKILLS);
    }, window.__API_TIMEOUT);
  window.__runDuiCallback(event);
  }

  handleCreatedCardClick = (item) => {
    var itemDetails = JSON.stringify(item);
    if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook" || utils.checkEnrolledCourse(item.identifier)){
      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_EnrolledCourseActivity_Prof",contents:whatToSend}
        window.__runDuiCallback(event);
      }else{
        this.setPermissions();
      }
    }else if(item.contentType.toLowerCase() == "course"){
      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_CourseInfoActivity_Prof",contents:whatToSend}
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
      var event= {tag:"OPEN_ResourceDetailActivity_Prof",contents:whatToSend}
      window.__runDuiCallback(event);
    }
  }

  handleStateChange = (state) =>{
    if(this.getSkillsResponseCame) return;
    this.getSkillsResponseCame=true;
    var res = utils.processResponse(state);
    console.log("res in ProfileActivity ", res);
    var isErr = res.hasOwnProperty("err");
    switch (state.responseFor) {
      case "API_GetSkills1":
        if (isErr) {
          console.log("Error API_GetSkills1, responseCode: ", res.responseCode);
        } else {
          var data = res.data;
          if(data.hasOwnProperty("result") && data.result.hasOwnProperty("skills") && data.result.skills!=undefined){
            var layout=(
              <ProfileSkillTags
              id = {this.profileData.id}
              editable = {this.isEditable}
              data={data.result.skills}/>
            );
            this.replaceChild(this.idSet.skillTagComponent, layout.render(), 0);
          }
        }
        break;
      case "API_EndorseSkill1":
        if (isErr) {
          console.log("Error API_EndorseSkill1, responseCode: ", res.responseCode);
        } else {
          setTimeout(() => {
            window.__Snackbar.show(window.__S.SKILL_ENDORSED);          
            this.getSkills();          
          }, 1000);
        }
      default:
        break;
    }
    window.__LoaderDialog.hide();        
  }

  render() {
    window.__LoaderDialog.show();
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        background = {window.__Colors.WHITE}
        height="match_parent">

          <SimpleToolbar
            title={window.__S.PROFILE_LW}
            width="match_parent"
            menuData={this.menuData}
            popupMenu={this.popupMenu}
            overFlowCallback = {this.overFlowCallback}
            onMenuItemClick={this.handleMenuClick}
            onBackPress={this.onBackPressed}
            showMenu="true"
            invert="true"/>


          <ScrollView
            height="0"
            weight="1"
            width="match_parent">

              <LinearLayout
                height="match_parent"
                width="match_parent"
                padding="16,16,16,16"
                margin = "0,0,0,64"
                orientation="vertical">

                <ProfileHeader
                  data={this.profileData}/>

                <LinearLayout
                  width = "match_parent"
                  height = "wrap_content"
                  orientation = "vertical"
                  id = {this.idSet.mainHolder}>

                  {this.getDescription()}

                  <ProfileExperiences
                    editable = {this.isEditable}
                    data = {this.education}
                    popUpType = {window.__PROFILE_POP_UP_TYPE.EDUCATION}
                    heading = {window.__S.TITLE_EDUCATION}/>

                  <ProfileExperiences
                    editable = {this.isEditable}
                    data = {this.jobProfile}
                    popUpType = {window.__PROFILE_POP_UP_TYPE.EXPERIENCE}
                    heading = {window.__S.TITLE_EXPERIENCE}/>

                  <LinearLayout
                    height="wrap_content"
                    width="wrap_content"
                    id={this.idSet.skillTagComponent}>
                    <ProfileSkillTags
                      id = {this.profileData.id}
                      data = {this.profileData.skills}
                      editable = {this.isEditable}/>
                  </LinearLayout>
                    <LinearLayout
                      width = "match_parent"
                      id = {this.idSet.createdByHolder}>

                        <ProfileCreations
                          data = {_this.createdBy}
                          editable = {_this.editable}
                          onCardClick = {_this.handleCreatedCardClick}/>
                    </LinearLayout>

                  <ProfileAdditionalInfo
                    data={this.profileData}
                    editable = {this.isEditable}/>
                </LinearLayout>

              </LinearLayout>

         </ScrollView>

        </LinearLayout>
    )
    return this.layout.render();
  }
}
module.exports = Connector(ProfileActivity);
