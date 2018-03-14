var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
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
var GuestAdditionalInfo = require('../../components/Sunbird/GuestAdditionalInfo');
var HomeQuestionCardStyle = require('../../components/Sunbird/HomeQuestionCardStyle');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var CircularLoader = require('../../components/Sunbird/core/CircularLoader');
var utils = require('../../utils/GenericFunctions');
const Str = require("../../res/Strings") ;


var _this;
class ProfileFragment extends View {
  constructor(props, children) {
    super(props, children);
    console.log("this.props profile fragments",props);
    this.screenName = "ProfileFragment";
    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'createdByHolder',
      'skillTagComponent',
      "profileContainer",
      "scrollViewContainer"
    ]);
    this.profileDataTag = "savedProfile";
    _this = this;
    this.isEditable = this.props.editable;
    if (window.__loggedInState == "GUEST") {
      this.menuData = {
        url: [
          { imageUrl: "ic_action_notification" },
          { imageUrl: "ic_action_overflow" }
        ]
      }
      this.popupMenu = window.__S.SETTINGS;
    } else {
      this.menuData = {
        url: [
          { imageUrl: "ic_action_search" },
          { imageUrl: "ic_action_notification" },
          { imageUrl: "ic_action_overflow" }
        ]
      }
      this.popupMenu = window.__S.LOGOUT + "," + window.__S.SETTINGS;
    }
    window.__LanguagePopup.props.buttonClick = this.handleChangeLang;
    window.__refreshProfile = false; //Used to control when the profile fragment needs to be refreshed when the user updates any profile data from the app.
    JBridge.logTabScreenEvent("PROFILE");

    //Profile data for loggedin user
    this.details = {};
    this.description = "";
    this.createdBy = {}
    this.jobProfile;
    this.education;
    this.address;

    //Profile data for guest user
    this.details = {};
    this.profileData;
  }


  handleChangeLang = (lang) => {
    window.__LoaderDialog.show()
     window.setLanguage(lang);
     window.__S = Str.strings();
     window.__LanguagePopup.hide();
     window.__renderBNavBar(4);
     window.__reRender();
  }

  logout = () =>{
    JBridge.logLogoutInitiate(window.__userToken);
    window.__Logout();
  }

  handleStateChange = (state) => {
    var res = utils.processResponse(state);
    var status = res.status;
    var responseData = res.data;
    this.responseData = responseData;
    var responseCode = res.code;
    var responseUrl = res.url;
    var isErr = res.hasOwnProperty("err");

    console.log("responseData -> ", this.responseData);
    switch (state.responseFor) {
      case "API_ProfileFragment":
        if (isErr) {
          if (JBridge.getSavedData(this.profileDataTag) != "__failed") {
            var data = JSON.parse(utils.decodeBase64(JBridge.getSavedData(this.profileDataTag)));
            data.local = true;
            this.handleStateChange(data)
          } else {
            window.__LoaderDialog.hide();
          }
          this.details = {};
          this.description = "";
          this.createdBy = {};
        } else {
          console.log("profileData", responseData);
          window.__userName = responseData.result.response.userName;
          this.details = responseData.result.response;
          this.description = this.details.profileSummary ? this.details.profileSummary : ""
          this.createdBy = {}
          this.jobProfile = this.details.jobProfile;
          this.education = this.details.education;
          this.address = this.details.address;
          this.populateProfileData();
          this.getCreatedBy();
        }
        break;
      case "API_EndorseSkill":
        if (isErr) {
          window.__Snackbar.show(window.__S.SKILL_NOT_ADDED);
        } else {
          window.__Snackbar.show(window.__S.SKILLS_ADDED_SUCCESSFULLY);
          this.populateProfileData();
        }
        // window.__BNavFlowRestart();
        return;
      case "API_GetSkillsList":
        window.__PopulateSkillsList = [];
        if (isErr) {
        } else {
          try {
            console.log("skills ", responseData.result.skills);
            window.__PopulateSkillsList = responseData.result.skills;
          } catch (e) {
            console.log("Exception : ", e);
          }
        }
        window.__CustomPopUp.show();
        return;
      case "API_SetProfileVisibility":
        if (isErr) {
          if (responseCode == 504) {
            window.__LoaderDialog.hide();
            window.__Snackbar.show(window.__S.TIME_OUT);
          } else {
            window.__LoaderDialog.hide();
            window.__Snackbar.show("failed");
          }
        } else {
          this.populateProfileData();
          // window.__BNavFlowRestart();
        }
    }
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,16"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  overFlowCallback = (params) => {
    if(params == 0){
      if (window.__loggedInState == "GUEST")
        this.openSettingsScreen();
      else
        this.logout();
    } else if (params == 1) {
      this.openSettingsScreen();
    }
  }

  openSettingsScreen = () => {
    JBridge.logSettingsClickedEvent("Settings");
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
    var whatToSend = { "profile" : JSON.stringify("{}")}
    var event ={ tag: "OPEN_SettingsScreenActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  getUserProfileData = () => {
    if (JBridge.isNetworkAvailable() && window.__loggedInState != "GUEST") {
      window.__refreshProfile = false;
      var whatToSend = {
        user_token: window.__user_accessToken,
        api_token: window.__apiToken
      };
      var event = { tag: "API_ProfileFragment", contents: whatToSend };
      window.__runDuiCallback(event);
    } else if (JBridge.getSavedData(this.profileDataTag) != "__failed") {
      var data = JSON.parse(
        utils.decodeBase64(JBridge.getSavedData(this.profileDataTag))
      );
      data.local = true;
      this.handleStateChange(data);
    } else {
      console.log("__failed in getUserProfileData");
      window.__LoaderDialog.hide();
    }
    window.__LoaderDialog.hide();
  }

  getCreatedBy = () => {
    var callback = callbackMapper.map((data) => {
      console.log("searchContent data ", data);
      if (data[0] != "error") {
        console.log("createdBy data", JSON.parse(utils.decodeBase64(data[0])));
        _this.createdBy = JSON.parse(utils.decodeBase64(data[0]));
        var layout = (
          <ProfileCreations
            data = {_this.createdBy}
            editable = {_this.editable}
            onCardClick = {_this.handleCreatedCardClick}/>
        );
        _this.replaceChild(_this.idSet.createdByHolder, layout.render(), 0);
      }
    });
    if (JBridge.isNetworkAvailable())
      JBridge.searchContent(callback, "userToken", window.__userToken, "Combined", 10, null, false);
    else
      console.log("JBridge.searchContent failed, no internet");
    window.__ContentLoadingComponent.hideLoader();
    if(!JBridge.isNetworkAvailable()){
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
    window.__LoaderDialog.hide();
  }

  afterRender = () => {
    if (window.__loggedInState && window.__loggedInState == "GUEST") {
      this.populateGuestProfile();
    } else {
      this.getUserProfileData();
    }
  }

  getDescription = () => {
    console.log("this.details", this.details.profileSummary);
    if (this.details.profileSummary) {
      console.log("inside getDescription");
      return (
        <LinearLayout
          orientation="vertical"
          height="wrap_content"
          margin="0,0,0,0"
          width="match_parent">

          {this.getLineSeperator()}

          <CropParagraph
            height="wrap_content"
            margin="0,0,0,16"
            width="match_parent"
            headText={window.__S.DESCRIPTION}
            contentText={this.details.profileSummary}
            privacyStatus={this.checkPrivacy("profileSummary")}
            handleLock={this.handleLockClick}
            editable={this.isEditable} />

        </LinearLayout>
      )
    } else {
      return (
        <LinearLayout
          orientation="vertical"
          height="wrap_content"
          width="match_parent">
        </LinearLayout>
      )
    }
  }

  setPermissions = () => {
    var callback = callbackMapper.map(function (data) {
      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
      }
      if (data == "DeniedPermanently") {
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_warning_grey", window.__S.STORAGE);
      }
    });
    JBridge.setPermissions(callback, "android.permission.WRITE_EXTERNAL_STORAGE");

  }

  handleMenuClick = (url) => {
    if (url == "ic_action_notification") {
      window.__Snackbar.show(window.__S.COMING_SOON);
    } else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Profile" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_CommProfSearchActivity", contents: whatToSend}
      window.__runDuiCallback(event);
    }
  }

  handleCreatedCardClick = (item) => {
    item.isCreator = true;
    var itemDetails = JSON.stringify(item);
    if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook"){
      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_EnrolledCourseActivity",contents:whatToSend}
        window.__runDuiCallback(event);
      }else{
        this.setPermissions();
      }
    }else if(item.contentType.toLowerCase() == "course"){
      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_CourseInfoActivity",contents:whatToSend}
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

  addSkills = ()=>{
    if(!JBridge.isNetworkAvailable()){
          window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
          return;
       }
    window.__LoaderDialog.show();
    var whatToSend = {
      "user_token" : window.__user_accessToken,
      "api_token" : window.__apiToken,
    }
    var event= { "tag": "API_GetSkillsList", contents: whatToSend };
    setTimeout(() => {
             if (window.__CustomPopUp.customPopUpVisibility=="visible") return;
              window.__CustomPopUp.show();
              window.__LoaderDialog.hide();
            }, window.__API_TIMEOUT);
        window.__runDuiCallback(event);
    }

  checkPrivacy = (name) => {
    var privateFlag=false;
    if(this.details.hasOwnProperty("profileVisibility") && this.details.profileVisibility[name] && this.details.profileVisibility[name]=='private')
       privateFlag=true;
    return privateFlag;
  }

  handleLockClick = (name,locked,label) => {

    var whatToSend = {
      user_token : window.__user_accessToken,
      api_token : window.__apiToken,
      request:{ userId: window.__userToken }
    };
    if(locked){
      whatToSend.request['public']=[name];
    }
    else {
      whatToSend.request['private']=[name];
    }
    console.log("whatToSend",whatToSend);
    whatToSend.request=JSON.stringify(whatToSend.request);
    var event = { tag: "API_SetProfileVisibility", contents: whatToSend }
    if (JBridge.isNetworkAvailable()) {
      if(locked)
        window.__Snackbar.show("Showing "+label+" to all");
      else {
        window.__Snackbar.show("Hiding "+label+" from all");
      }
      window.__runDuiCallback(event);
    }
    else{
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
    }
  }

  populateGuestProfile = () => {
    this.profileData = JSON.parse(utils.decodeBase64(JBridge.getCurrentProfileData()));
    this.details = {};
    this.details.userName = this.profileData.handle;
    var layout = (
      <ScrollView
        height="0"
        weight="1"
        id={this.idSet.scrollViewContainer}
        width="match_parent">
        <LinearLayout
          height="match_parent"
          width="match_parent"
          padding="16,8,16,24"
          orientation="vertical"
          layoutTransition="true">
          <ProfileHeader
            editable={this.isEditable}
            data={this.details}
            textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
          <GuestAdditionalInfo
            profileData = {this.profileData} />
          {this.getSignInOverlay()}
        </LinearLayout>
      </ScrollView>);
    this.replaceChild(this.idSet.profileContainer, layout.render(), 0);
  }

  populateProfileData = () => {
    console.log("populate Profile data");

    var layout = (
      <ScrollView
        height="0"
        weight="1"
        id={this.idSet.scrollViewContainer}
        width="match_parent">
      <LinearLayout
        height="match_parent"
        width="match_parent"
        padding="16,8,16,24"
        orientation="vertical"
        layoutTransition="true">
        <ProfileHeader
          editable={this.isEditable}
          data={this.details}
          textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
        <ProfileProgress
          editable={this.isEditable}
          data={this.details} />

        {this.getDescription()}

        <ProfileExperiences
          editable={this.isEditable}
          data={this.education}
          popUpType={window.__PROFILE_POP_UP_TYPE.EDUCATION}
          heading={window.__S.TITLE_EDUCATION}
          privacyStatus={this.checkPrivacy("education")}
          handleLock={this.handleLockClick} />

        <ProfileExperiences
          editable={this.isEditable}
          data={this.jobProfile}
          popUpType={window.__PROFILE_POP_UP_TYPE.EXPERIENCE}
          heading={window.__S.TITLE_EXPERIENCE}
          privacyStatus={this.checkPrivacy("jobProfile")}
          handleLock={this.handleLockClick} />


        <ProfileExperiences
          editable={this.isEditable}
          data={this.address}
          popUpType={window.__PROFILE_POP_UP_TYPE.ADDRESS}
          heading={window.__S.TITLE_ADDRESS}
          privacyStatus={this.checkPrivacy("address")}
          handleLock={this.handleLockClick} />
        <LinearLayout
          height="wrap_content"
          width="wrap_content"
          id={this.idSet.skillTagComponent}>
          <ProfileSkillTags
            id={window.__userToken}
            editable={this.isEditable}
            onAddClicked={this.addSkills}
            data={this.details.skills}
            privacyStatus={this.checkPrivacy("skills")}
            handleLock={this.handleLockClick} />
        </LinearLayout>

        <LinearLayout
          width="match_parent"
          id={this.idSet.createdByHolder}>

          <ProfileCreations
            data={_this.createdBy}
            editable={_this.editable}
            onCardClick={_this.handleCreatedCardClick} />
        </LinearLayout>


        <ProfileAdditionalInfo
          data={this.details}
          editable={this.isEditable} />
      </LinearLayout>
      </ScrollView>
    );
    this.replaceChild(this.idSet.profileContainer, layout.render(), 0);
    // utils.addSwipeFunction(this.idSet.scrollViewContainer);
  }

  getSignInOverlay = () => {
    return(
    <LinearLayout
      height="match_parent"
      width="match_parent"
      orientation="vertical"
      background={window.__Colors.WHITE_F2}
      clickable="true"
      padding="16,16,16,16">
      <HomeQuestionCardStyle
          currComponentLocation={"PROFILE"}
        headerText={window.__S.OVERLAY_LABEL_COMMON}
        infoText={window.__S.OVERLAY_INFO_TEXT_COMMON}
        textSize="16"
        gravity="left" />
    </LinearLayout>);
  }

  render() {
    var popUpdata = {
      negButtonText: "Cancel",
      posButtonText: "Change"
    }
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
            overFlowCallback={this.overFlowCallback}
            onMenuItemClick={this.handleMenuClick}
            showMenu="true"
            hideBack="true" />

            <LinearLayout
              id={this.idSet.profileContainer}
              height="match_parent"
              width="match_parent"
              orientation="horizontal"
              layoutTransition="true">
              <CircularLoader />
            </LinearLayout>
        </LinearLayout>
      </RelativeLayout>
    )
    return this.layout.render();
  }
}

module.exports = ProfileFragment;
