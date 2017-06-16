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
var SearchToolbar = require('../Sunbird/SearchToolbar');
var ProfileHeader = require('../Sunbird/ProfileHeader');
var ProfileExperiences = require('../Sunbird/ProfileExperiences');
var ProfileSkillTags = require('../Sunbird/ProfileSkillTags');
var ProfileAccomplishments = require('../Sunbird/ProfileAccomplishments');
var ProfileCreations = require('../Sunbird/ProfileCreations');
var ProfileBadges = require('../Sunbird/ProfileBadges');

var _this;
class ProfileComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([

    ]);
    _this = this;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_notification_blue" },
        { imageUrl: "ic_action_search" }
      ]
    }
  }

  handleMenuClick = (url) => {}

  handleSearch = (data) => {}

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,24,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
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

        <SearchToolbar
          hint="Enter your search"
          invert="true"
          hideBack="true"
          title=""
          onMenuItemClick={this.handleMenuClick}
          menuData={this.menuData}
          onSearch={this.handleSearch}/>


          <ScrollView
            height="0"
            weight="1"
            width="match_parent">

              <LinearLayout
                height="match_parent"
                width="match_parent"
                padding="16,16,16,0"
                orientation="vertical">

                <ProfileHeader/>

                <ProfileExperiences/>

                <ProfileSkillTags/>


                <ProfileAccomplishments/>


                <ProfileCreations/>

                <ProfileBadges/>

              </LinearLayout>

         </ScrollView>

        </LinearLayout>
    )

    return this.layout.render();
  }
}



module.exports = ProfileComponent;
