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
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;

class ContentLoadingComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "content_loading_component"

    this.setIds([
      "holder"
    ])
    this.contentLayout = this.props.contentLayout == undefined ? this.getContent() : this.props.contentLayout;
  }

  getContent = () => {
    return (<LinearLayout
              height="match_parent"
              width="match_parent"
              root="true"
              gravity="center"
              orientation="vertical">

                <TextView
                  text="Layout Not Passed"
                  textSize="30"
                  width="match_parent"
                  />

            </LinearLayout>)
  }

  showContent = () => {
    console.log("Starting Rendering Content to holder")
    setTimeout(() => {
      console.log("Rendering Content to holder")
      this.replaceChild(this.idSet.holder, this.contentLayout.render(), 0);
    }, 300);
  }


  render() {
    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       gravity="center"
       root="true"
       afterRender={this.showContent}
       id={this.idSet.holder}
       width="match_parent">
          <ProgressBar
            height="70"
            width="70"/>
       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ContentLoadingComponent;
