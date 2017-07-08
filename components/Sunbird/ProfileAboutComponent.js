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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');

window.R = require("ramda");
var PageOption = require('../../components/Sunbird/core/PageOption');
class ProfileAboutComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_ABOUT_SCREEN"

    this.setIds([
      "pageOption",
    ]);
  }

  afterRender = () => {

  }
  handleEnrollClick = (data) => {
    if (data === "ENROLL NOW") {
      console.log(data)

      this.replaceChild(this.idSet.parentContainer, this.getEnrolledContent().render(), 0);



    }
  }

  render() {
    var buttonList = ["EDIT PROFILE"];
    this.layout = (
    
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        alignParentTop="true"
        >

        <TextView
          text="Fully informed about the latest updates in the rules and regulations, our team works closely with you, helping choose the best foreign destination to work in, and preparing a well-presented error-free application."
          height="wrap_content"
          margin="16,12,16,16"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>            
      


      <ViewWidget
        weight="1"
        />
       <PageOption
           width="match_parent"
           id={this.idSet.pageOption}
           buttonItems={buttonList}
           hideDivider="true"

           onButtonClick={this.handleEnrollClick}/>
      
    </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ProfileAboutComponent;
