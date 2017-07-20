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
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var ProfileHeader = require('../Sunbird/ProfileHeader');
var ComingSoonComponent = require('../Sunbird/ComingSoonComponent');
var PersonalDetails = require('../Sunbird/PersonalDetails');
var ProfileExperiences = require('../Sunbird/ProfileExperiences');
var ProfileSkillTags = require('../Sunbird/ProfileSkillTags');
var ProfileAccomplishments = require('../Sunbird/ProfileAccomplishments');
var ProfileCreations = require('../Sunbird/ProfileCreations');
var ProfileBadges = require('../Sunbird/ProfileBadges');
var ProfileAdditionalInfo = require('../Sunbird/ProfileAdditionalInfo');

var _this;
class ProfileComponent extends View {
  constructor(props, children) {
    super(props, children);


    this.props.appendText = this.props.appendText || "";
    this.setIds([

    ]);
    console.log("profile api response", this.props);
    _this = this;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_overflow" }
      ]
    }
    this.popupMenu="logout";

    this.handleResponse();
  }


  logout = () =>{
    JBridge.showSnackBar("Logged out")
    JBridge.setInSharedPrefs("logged_in","NO");
    JBridge.setInSharedPrefs("user_id", "__failed");
    JBridge.setInSharedPrefs("user_name",  "__failed");
    JBridge.setInSharedPrefs("user_token",  "__failed");

    window.__Logout();
  }

  handleResponse = () => {

    console.log("response in CC", this.props.response)

    if (this.props.response) {
      console.log("SERVER GAVE RESPONSE", this.props.response)
      this.details = this.props.response.result.response;

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

                <PersonalDetails
                data={this.details}/>



                <ComingSoonComponent
                text="More details coming soon.."/>



              </LinearLayout>

         </ScrollView>

        </LinearLayout>



    )

    return this.layout.render();
  }
}
/*
add these later
 <ProfileExperiences/>
<ProfileSkillTags/>


                <ProfileAccomplishments/>


                <ProfileCreations/>

                <ProfileBadges/>

                <ProfileAdditionalInfo/>

*/


module.exports = ProfileComponent;
