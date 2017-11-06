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
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var utils = require('../../utils/GenericFunctions');
const Str = require("../../res/Strings") ;


var _this;
class ProfileFragment extends View {
  constructor(props, children) {
    super(props, children);
    console.log(props, "this.props");

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'createdByHolder'
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
    this.popupMenu=window.__S.CHANGE_LANGUAGE + "," + window.__S.LOGOUT;
    // this.popupMenu=window.__S.LOGOUT;
    window.__LanguagePopup.props.buttonClick = this.handleChangeLang;

    this.handleResponse();
    JBridge.logTabScreenEvent("PROFILE");
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

  handleResponse = () => {
    console.log("this.props.response", this.props.response);
    if (this.props.response) {
      var profileData = this.props.response;
      this.details = profileData.result.response;
      this.description = this.details.profileSummary ? this.details.profileSummary : ""
      this.createdBy = {}
      this.jobProfile = this.details.jobProfile;
      this.education = this.details.education;
      this.address = this.details.address;
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
            margin="0,16,0,16"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  overFlowCallback = (params) => {
    if(params == 0){
      window.__LanguagePopup.show();
    } else if (params == 1) {
      this.logout();
    }
  }


  afterRender() {
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
    window.__ContentLoadingComponent.hideLoader();
    window.__LoaderDialog.hide();
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
  }

  getDescription = () => {
    console.log("this.details", this.details.profileSummary);
    if(this.details.profileSummary){
      console.log("inside getDescription");
      return(
        <LinearLayout
          orientation = "vertical"
          height = "wrap_content"
          margin="0,0,0,0"
          width = "match_parent">

          {this.getLineSeperator()}
          {
          // <TextView
          //   text = "Description"
          //   style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
          }
            <CropParagraph
              height = "wrap_content"
              margin = "0,0,0,16"
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
    }
     else {
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
    var popUpdata = {
      negButtonText : "Cancel",
      posButtonText : "Change"
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
                padding="16,8,16,24"
                orientation="vertical"
                layoutTransition = "true">

                <ProfileHeader
                  data={this.details}
                  textStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
                <ProfileProgress
                editable={this.isEditable}
                data={this.details}/>

                {this.getDescription()}

                <ProfileExperiences
                  editable = {this.isEditable}
                  data = {this.education}
                  popUpType={window.__PROFILE_POP_UP_TYPE.EDUCATION}
                  heading = {window.__S.TITLE_EDUCATION} />

                <ProfileExperiences
                  editable = {this.isEditable}
                  data = {this.jobProfile}
                  popUpType={window.__PROFILE_POP_UP_TYPE.EXPERIENCE}
                  heading = {window.__S.TITLE_EXPERIENCES} />

                <ProfileExperiences
                  editable = {this.isEditable}
                  data = {this.address}
                  popUpType={window.__PROFILE_POP_UP_TYPE.ADDRESS}
                  heading = {window.__S.TITLE_ADDRESS} />

                <LinearLayout
                  width = "match_parent"
                  id = {this.idSet.createdByHolder}>

                    <ProfileCreations
                      data = {_this.createdBy}
                      editable = {_this.editable}
                      onCardClick = {_this.handleCreatedCardClick}/>
                </LinearLayout>


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
