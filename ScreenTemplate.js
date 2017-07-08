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
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var ListView = require("@juspay/mystique-backend").androidViews.ListView;

class Screen extends View {
  constructor(props, children, state) {
    super(props, children);
    this.state = state;

    var _this = this;
    setTimeout(() => {
      Android.runInUI(
        _this.animateView(),
        null
      );
    });
  }

  onPop = (type) => {
    var _this = this;
    Android.runInUI(
      _this.animateView(),
      null
    );
  }

  render() {
    this.layout = (
      <LinearLayout
         background="#ffff00"
         root="true"
         width="match_parent" 
         height="match_parent">
          
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(Screen);
