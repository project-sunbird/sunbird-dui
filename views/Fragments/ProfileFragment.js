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
    window.__Logout();
  }

  handleResponse = () => {



    if (this.props.response) {

      this.details = this.props.response.result.response;
      this.description = this.details.profileSummary ? this.details.profileSummary : ""
    } else {

      this.details = {};
    }
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

  render() {
    this.layout = (




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
