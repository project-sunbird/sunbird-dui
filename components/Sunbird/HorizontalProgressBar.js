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

class HorizontalProgressBar extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "progressContainer"

    ]);

    this.displayName = "horizontal_progress_card";

    this.currentProgress = this.props.currentProgress != undefined ? this.props.currentProgress : "0";
    this.totalProgress = this.props.totalProgress != undefined ? this.props.totalProgress : "100";

  }

  updateProgressBar = (pStatus) => {
    this.currentProgress = pStatus
    var progressBar = this.getProgressBar();
    this.replaceChild(this.idSet.progressContainer, progressBar.render(), 0)
  }

  getProgressBar = () => {
    var percentL = parseFloat(this.currentProgress) / parseFloat(this.totalProgress);
    var percentR = (1 - percentL);
    return (
      <LinearLayout
      height="2"
      root="true"
      width="match_parent">
        <ViewWidget
          width="0"
          weight={percentL}
          background={this.props.progressBarColor===undefined?window.__Colors.ORANGE:this.props.progressBarColor}
          height="2"/>
        <ViewWidget
          width="0"
          weight={percentR}
          background={window.__Colors.PRIMARY_BLACK_22}
          height="2"/>

      </LinearLayout>)
  }


  render() {


    this.layout = (

      <LinearLayout
          width="match_parent"
          id={this.idSet.progressContainer}
          height="wrap_content"
          root="true">

            {this.getProgressBar()}

        </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = HorizontalProgressBar;
