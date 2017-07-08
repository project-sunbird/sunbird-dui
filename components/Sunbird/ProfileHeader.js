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

var _this;
class ProfileHeader extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);

    this.userName = JBridge.getFromSharedPrefs("user_name")
    this.userName = (this.userName == "__failed") ? "Harish Bookwalla" : this.userName;


  }

  profileBody = () => {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              gravity="center_horizontal"
              orientation="vertical">

              <ImageView
              width="80"
              height="80"
              circularImageUrl={"0,"+"https://s-media-cache-ak0.pinimg.com/originals/b7/fd/99/b7fd9903db658b1a2d9824d17cdefd6b.jpg"}/>
              />

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={this.userName}
              padding="0,10,0,2"
              style={window.__TextStyle.textStyle.HEADING.DARK}/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Jawahar Vidya Mandir, Pune"
              padding="0,0,0,8"
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

              <TextView
              padding="40,0,40,0"
              height="wrap_content"
              spanText="Lorem Ipsum is simply dummy text of the printing and typesetting industry… $#Read more#$"
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>


              </LinearLayout>)
  }


  render() {
    return this.profileBody().render();
  }
}



module.exports = ProfileHeader;
