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
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class RecommendedCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "ratingBar",
    ]);
    console.log(this.props.item.hideRating, "rating hidden");
  }


  handleClick = () => {
    console.log("in card", this.props.item.content)
    this.props.onClick(this.props.item.content);
  }


  ratingChange = (data) => {
    console.log("RATING CHANGE :", data)
  }

  getCardIcon = () => {
    return (
      <RelativeLayout
              width="wrap_content"
              height="wrap_content"
            >
            <LinearLayout
            width="170"
            height="110"
            gravity="center"
            >
                  <ImageView
                    height="match_parent"
                    width="match_parent"
                    scaleType="fixXY"
                    imageFromUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
                  />
            </LinearLayout>

          <LinearLayout
            width="170"
            height="110"
            gravity="center"
            background={window.__Colors.BLACK}
            alpha="0.50"
            >

            </LinearLayout>
          <LinearLayout
            width="150"
            height="wrap_content"
            gravity="center"
            alignParentBottom="true,-1"
            padding = "10,10,10,10"

            >
                <TextView
                text= {this.props.item.moduleName ? this.props.item.moduleName : "Module Name"}
                style={window.__TextStyle.textStyle.HINT.WBOLD}


                />
           </LinearLayout>
          </RelativeLayout>)
  }

  getRatingSection = () => {
    return (<LinearLayout
            gravity="center"
            visibility = {this.props.item.hideRating}
            padding="6,0,6,0">
            <RatingBar
              id = {this.idSet.ratingBar}
              width="0"
              weight="1"
              height="50"
              setStars = "6"
              setRating = {this.props.item.moduleRating}
              scaleX="0.3"
              scaleY="0.3"
              onRatingChange = {this.ratingChange}
              fixedRating = {"true"}/>


            <TextView
                  text= {"("}
                  style={window.__TextStyle.textStyle.HINT.REGULAR}/>
            <TextView
                  text= {this.props.item.moduleUserCount ? this.props.item.moduleUserCount : "NIL"}
                  style={window.__TextStyle.textStyle.HINT.REGULAR}/>
            <TextView
                  text= {")"}
                  style={window.__TextStyle.textStyle.HINT.REGULAR}/>
          </LinearLayout>)
  }


  render() {


    this.layout = (
      <LinearLayout
        width="wrap_content"
        height="wrap_content"
        orientation = "vertical"
        padding="16,0,16,0"
        onClick={this.handleClick}
        >
            <LinearLayout
              width="170"
              height="110"
              >

              {
                this.getCardIcon()
              }

          </LinearLayout>

          <LinearLayout
            height="wrap_content"
            width="match_parent"
          >
          {this.getRatingSection()}

          </LinearLayout>

    </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = RecommendedCard;
