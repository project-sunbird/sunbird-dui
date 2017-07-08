/*
Copyright (c) 2012-2017 "JUSPAY Technologies"
JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]

This file is part of JUSPAY Platform.

JUSPAY Platform is free software: you can redistribute it and/or modify
it for only educational purposes under the terms of the GNU Affero General
Public License (GNU AGPL) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
For Enterprise/Commerical licenses, contact <info@juspay.in>.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
be liable for all damages without limitation, which is caused by the
ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
damages, claims, cost, including reasonable attorney fee claimed on Juspay.
The end user has NO right to claim any indemnification based on its use
of Licensed Software. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.


*/

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
var SearchToolbar = require('../Sunbird/core/SearchToolbar');
var ProfileHeader = require('../Sunbird/ProfileHeader');
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
    _this = this;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_notification_blue" },
        { imageUrl: "ic_action_search" }
      ]
    }
  }

  handleMenuClick = (url) => {

    if(url=="ic_action_notification_blue"){
        window.__runDuiCallback({tag:"StartNotificationFlow",contents:[]});
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

                <ProfileAdditionalInfo/>

              </LinearLayout>

         </ScrollView>

        </LinearLayout>
    )

    return this.layout.render();
  }
}



module.exports = ProfileComponent;
