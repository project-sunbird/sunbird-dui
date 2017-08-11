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

var _this;
class ProfileFragment extends View {
  constructor(props, children) {
    super(props, children);


    this.props.appendText = this.props.appendText || "";
    this.setIds([

    ]);
    console.log("profile api response", this.props);
    _this = this;
    this.isEditable = this.props.editable;
    this.menuData = {
      url: [
        { imageUrl: "ic_action_overflow" }
      ]
    }
    this.popupMenu="Logout";

    this.handleResponse();
  }


  logout = () =>{
    JBridge.showSnackBar("Logged out")
    JBridge.setInSharedPrefs("logged_in","NO");
    JBridge.setInSharedPrefs("user_id", "__failed");
    JBridge.setInSharedPrefs("user_name",  "__failed");
    JBridge.setInSharedPrefs("user_token",  "__failed");

    console.log("IN P1 ",window.__pressedLoggedOut)
    window.__pressedLoggedOut=true;
    console.log("IN P2 ",window.__pressedLoggedOut)
    JBridge.keyCloakLogout(window.__apiUrl + "/auth/realms/sunbird/protocol/openid-connect/logout");

    window.__Logout();
  }

  handleResponse = () => {

    console.log("response in CC", this.props.response)

    if (this.props.response) {
      console.log("SERVER GAVE RESPONSE", this.props.response)
      this.details = this.props.response.result.response;
      this.description = this.details.profileSummary ? this.details.profileSummary : ""
    } else {
      console.log("SERVER TOLD NULL")
      this.details = {};
    }
  }

  handleSearch = (data) => {}

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


  afterRender() {}

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin = "0, 10, 0, 10"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
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

  render() {
    this.layout = (




      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        height="match_parent">


          <SimpleToolbar
            title="Profile"
            width="match_parent"
            menuData={this.menuData}
            popupMenu={this.popupMenu}
            overFlowCallback = {this.overFlowCallback}
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

                <ProfileProgress
                  editable = {this.isEditable}/>

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
                  editable = {this.isEditable}/>

                <ProfileSkillTags
                  editable = {this.isEditable}/>

                <ProfileAccomplishments
                  editable = {this.isEditable}/>

                <ProfileCreations
                  editable = {this.isEditable}/>

                <ProfileBadges
                  editable = {this.isEditable}/>

                <ProfilAffiliations
                  editable = {this.isEditable}/>

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

module.exports = ProfileFragment;
