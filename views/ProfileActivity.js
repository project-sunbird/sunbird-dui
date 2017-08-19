var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var ProfileFragment = require('./Fragments/ProfileFragment');
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

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

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
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

    this.popupMenu="Logout";

    _this = this;
    this.shouldCacheScreen = false;

    this.state = state;
    this.profileData = JSON.parse(this.state.data.value0.profile);
    console.log(this.profileData, "profileData in ProfileActivity");

    this.details = this.profileData.result.response;
    this.jobProfile = this.details.jobProfile;

  }

  handleStateChange = (state) => {
    console.log(state, "handleStateChange resData");

    var status = state.response.status[0];
    var responseData = state.response.status[1];
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];


    responseData = utils.decodeBase64(responseData);
    if(responseCode == 401){
      window.__LoaderDialog.hide();
      var callback  = callbackMapper.map(function(token){
        window.__apiToken = token;
        var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
        var event = { "tag": state.responseFor, contents: whatToSend };
        window.__runDuiCallback(event);
      });
      JBridge.getApiToken(callback);
      return;
    }else if(responseCode == 501 || status === "failure" || status=="f") {
      window.__LoaderDialog.hide();
      JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION)
      responseData=tmp;
    } else {
      window.__LoaderDialog.hide();
      responseData = JSON.parse(responseData);
    }

    if(responseData.result.response.content && responseData.result.response.content.length > 0){

    }else{

    }
  }

  onBackPressed = () => {
    var whatToSend = [];
    var event = {"tag": "BACK_ProfileActivity", contents: whatToSend};
    window.__runDuiCallback(event);
  }

  logout = () =>{
    JBridge.showSnackBar(window.__S.LOGGED_OUT)
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

  overFlowCallback = (params) => {
    if(params == 0){
      this.logout();
    }
  }

  getDescription = () => {
    return(
      <LinearLayout
        orientation = "vertical"
        height = "wrap_content"
        width = "match_parent">
        <TextView
          text = "Description"
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

      </LinearLayout>
    )
  }

  handleMenuClick = (url) => {
    if (url == "ic_action_notification") {
      JBridge.showSnackBar(window.__S.COMMING_SOON);
    } else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Profile" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_CommProfSearchActivity_Prof", contents: whatToSend}
      window.__runDuiCallback(event);
    }
  }

  afterRender = () => {
  }

  render() {
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
                padding={"0,0,0,50"}
                padding="16,16,16,0"
                orientation="vertical">

                <ProfileHeader
                  data={this.details}/>

                <LinearLayout
                  width = "match_parent"
                  height = "wrap_content"
                  orientation = "vertical"
                  visibility = {(this.description && this.description != "") ? "visible" : "gone"}>

                  {this.getLineSeperator()}
                  <CropParagraph
                    headText = "Description"
                    contentText = {(this.description && this.description != "") ? this.description : ""}/>
                </LinearLayout>

                <ProfileExperiences
                  editable = {this.isEditable}
                  data = {this.jobProfile}/>

                <ProfileAdditionalInfo
                  data={this.details}
                  editable = {this.isEditable}/>

              </LinearLayout>

         </ScrollView>

        </LinearLayout>
    )
    return this.layout.render();
  }
}
module.exports = Connector(ProfileActivity);
