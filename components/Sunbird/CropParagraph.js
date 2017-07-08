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
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;


class CropParagraph extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "paraContainerCroped",
      "showMoreButton",
    ]);
  }

  handleMoreClick = (data) => {
    var cmd = this.set({
      id: this.idSet.showMoreButton,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.paraContainerCroped,
      maxLines: "100"
    })

    Android.runInUI(cmd, 0);
  }


  getMoreButton = () => {
    return (
      <LinearLayout
            height="wrap_content"
            layoutTransition="true"
            id={this.idSet.showMoreButton}
            width="match_parent">
              <ViewWidget 
                height="1"
                width="0"
                weight="1"/>
               <TextView
                margin="0,0,8,0"
                text="more"
                layoutTransition="true"
                onClick={this.handleMoreClick}
                style = {window.__TextStyle.textStyle.CARD.BODY.BLUE_R}
                color={window.__Colors.PRIMARY_ACCENT} />
           
          </LinearLayout>);
  }


  render() {


    this.layout = (
      <LinearLayout
      background={window.__Colors.WHITE}
      width="match_parent"
      height="match_parent"
      visibility = {(this.props.headText==undefined || this.props.headText.length == 0) ? "gone":"visible"}
      layoutTransition="true"
      orientation="vertical">

        <TextView
          text = {this.props.headText}
          style= {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          margin="0,0,0,8"/>

       

          <TextView
              id={this.idSet.paraContainerCroped}
              text = {this.props.contentText}
              width="match_parent"
              height="match_parent"
              maxLines="2"
               layoutTransition="true"
              style= {window.__TextStyle.textStyle.CARD.BODY.REGULAR}/>
          
          {this.getMoreButton()}


      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CropParagraph;
