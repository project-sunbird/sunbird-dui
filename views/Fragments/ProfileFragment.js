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

    this.jobProfile = [
      {
        "jobName": "jobName",
        "orgName": "AP ORG",
        "role": "teacher",
        "updatedBy": null,
        "address": {
          "country": "India",
          "updatedBy": null,
          "city": "Bangalore1",
          "updatedDate": null,
          "userId": "7d086e8c-68ac-4aaa-8b91-d75ff922bae5",
          "zipcode": "560135",
          "addType": "permanent1",
          "createdDate": "2017-07-07 07:18:38:611+0530",
          "createdBy": "7d086e8c-68ac-4aaa-8b91-d75ff922bae5",
          "addressLine1": "2121 winding hill dr",
          "addressLine2": "Frazer town1",
          "id": "0122833794922004481",
          "state": "Karnataka1"
        },
        "endDate": "1992-10-12",
        "isVerified": null,
        "subject": [
          "Physics",
          "Chemistry"
        ],
        "joiningDate": "1998-10-12",
        "updatedDate": null,
        "verifiedBy": null,
        "userId": "7d086e8c-68ac-4aaa-8b91-d75ff922bae5",
        "boardName": null,
        "orgId": "123",
        "addressId": "0122833753304186887",
        "createdDate": "2017-07-07 07:18:38:695+0530",
        "createdBy": "7d086e8c-68ac-4aaa-8b91-d75ff922bae5",
        "verifiedDate": null,
        "isRejected": null,
        "id": "0122833760735477766"
      },
      {
        "jobName": "jobName1",
        "orgName": "AP ORG1",
        "role": "teacher1",
        "address": {
          "country": "India",
          "updatedBy": null,
          "city": "Bangalore11",
          "zipcode": "560135",
          "addType": "permanent1",
          "addressLine1": "2121 winding hill dr1",
          "addressLine2": "Frazer town1",
          "state": "Karnataka1"
        },
        "endDate": "1994-10-12",
        "isVerified": null,
        "subject": [
          "Physics",
          "Chemistry"
        ],
        "joiningDate": "1992-10-12",
        "updatedDate": null,
        "verifiedBy": null,
        "boardName": "AP BOARD12",
        "orgId": "123",
        "verifiedDate": null,
        "isRejected": null
      }
    ];

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
    JBridge.keyCloakLogout(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/logout");

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
                  editable = {this.isEditable}
                  data = {this.jobProfile}/>

                <ProfileBadges
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
