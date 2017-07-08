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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class ProfileBadges extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "badgeContainer",
      "viewAll"
    ]);

    this.showMore = false;

    this.data = [{
      badgeName: "First finisher in 4 courses",

    }, {
      badgeName: "Created 5 courses",

    }, {
      badgeName: "First finisher in 10 courses",

    }, {
      badgeName: "Created 10 courses",

    }, {
      badgeName: "First finisher in 20 courses",

    }, {
      badgeName: "Created 20 courses",

    }]

  }

  getRows = (input) => {
    var rows = this.data.map((item, i) => {
      if (i > 1 && !this.showMore)
        return (<LinearLayout
              width="0"
              height="0"/>);

      return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,0,0,8">

              <ImageView
              width="48"
              height="48"
              padding="12,12,12,12"
              imageUrl="ic_profile_badge"
              />

              <TextView
              width="0"
              weight="1"
              height="match_parent"
              gravity="center"
              text={item.badgeName}
              style={window.__TextStyle.textStyle.CARD.HEADING}/>

              </LinearLayout>)
    });

    var dummyRow = (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">

        {rows}

        </LinearLayout>)
    return dummyRow;
  }

  getBody() {
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,24,0,0"
            root="true"
            layoutTransition="true"
            id={this.idSet.badgeContainer}
            orientation="vertical">

            {this.getRows()}

            </LinearLayout>)
  }

  handleViewAllClick = () => {
    this.showMore = !this.showMore;
    this.replaceChild(this.idSet.badgeContainer, this.getRows().render(), 0);

    var cmd = "";
    if (this.showMore) {
      cmd = this.set({
        id: this.idSet.viewAll,
        text: "Show Less"
      })
    } else {
      cmd = this.set({
        id: this.idSet.viewAll,
        text: "Show More"
      })
    }

    Android.runInUI(cmd, 0);

  }


  getViewAll = () => {

    if (this.data.length <= 1)
      return (<TextView
              width="0"
              height="0"/>)

    return (<TextView
              width="wrap_content"
              height="wrap_content"
              text="View All"
              id={this.idSet.viewAll}
              onClick={this.handleViewAllClick}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>)

  }

  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Badges"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              
              {this.getViewAll()}

              </LinearLayout>)
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  render() {
    this.layout = (
      <LinearLayout
                width="wrap_content"
                height="wrap_content"
                margin="0,16,0,0"
                layoutTransition="true"
                orientation="vertical">

                {this.getLineSeperator()}

                {this.getHeader()}

                {this.getBody()}

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileBadges;
