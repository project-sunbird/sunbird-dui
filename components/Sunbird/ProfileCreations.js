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
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this=this;
    this.data=[
      {
        "type":"course",
        "moduleText":"Organic Chemistry for Standard VII",
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg"
      },
      {
        "type":"course",
        "moduleText":"Atomic Physics for Standard VII",
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg"
      }
    ]

  }


  getHeader = () => {
    return (  <LinearLayout
              margin="0,0,0,16"
              width="match_parent"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Creator of"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="View all"
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }



  getCards = () => {
    var cards = this.data.map((item, i) => {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,0,12,6"
              orientation="vertical">

                <RelativeLayout
                 width="200"
                 height="110">

                <ImageView
                  height="match_parent"
                  width="match_parent"
                  scaleType="fixXY"
                  gravity="center"
                  circularImageUrl={"10,"+item.imageUrl}/>

                <LinearLayout
                  width="match_parent"
                  height="match_parent"
                  gravity="center"
                  cornerRadius="4"
                  background={window.__Colors.BLACK}
                  alpha="0.50"/>

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  padding = "10,10,10,10"
                  text= {item.type}
                  padding="5,3,5,3"
                  cornerRadius="4"
                  background={window.__Colors.PRIMARY_BLACK}
                  style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>

                <TextView
                  width="match_parent"
                  height="wrap_content"
                  padding = "10,10,10,10"
                  alignParentBottom="true,-1"
                  text= {item.moduleText}
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

              </RelativeLayout>

              </LinearLayout>);

            });

      return cards;
  }


  getBody = () =>{
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,16,0,0"
            >

            {this.getCards()}

            </LinearLayout>
    )
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  render() {
    this.layout= (
              <LinearLayout
                margin="0,24,0,0"
                orientation="vertical">

                {this.getLineSeperator()}

                {this.getHeader()}

                <HorizontalScrollView
                 width = "wrap_content"
                 height = "wrap_content"
                 scrollBarX="false"
                 fillViewport="true">

                {this.getBody()}

                </HorizontalScrollView>

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileCreations;
