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
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;


class MyCommunities extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);

    this.data = [
      {
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        "moduleText":"All India Teachers Association",
        "members":"(250 members)",
        "lastSeen":"4 unread posts"
      },
      {
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        "moduleText":"All India Teachers Association",
        "members":"(250 members)",
        "lastSeen":"4 unread posts"
      },
      {
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        "moduleText":"All India Teachers Association",
        "members":"(250 members)",
        "lastSeen":"4 unread posts"
      }
    ]
  }


  

  getRows(){
    var rows = this.data.map((item, i) => {
              return(
                    <LinearLayout
                    width="wrap_content"
                    height="wrap_content"
                    margin="16,0,0,22"
                    onClick={()=>{this.handleMyCommunityClick(item.moduleText)}}
                    orientation="vertical">

                      <RelativeLayout
                       width="wrap_content"
                       height="wrap_content">

                      <ImageView
                        height="110"
                        width="200"
                        scaleType="fixXY"
                        gravity="center"
                        circularImageUrl={"10,"+item.imageUrl}/>

                      <LinearLayout
                        width="200"
                        height="110"
                        gravity="center"
                        cornerRadius="4"
                        background={window.__Colors.BLACK}
                        alpha="0.50"/>

                      <TextView
                        gravity="center"
                        width="150"
                        height="wrap_content"
                        padding = "10,10,10,10"
                        centerInParent="true,-1"
                        text= {item.moduleText}
                        style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

                    </RelativeLayout>

                    {this.getFooter(item)}

                    </LinearLayout>

                  )
    });

    var layout =  (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="horizontal">

            {rows}

          </LinearLayout>)

    return layout;

  }

  getFooter(item){
    return (<LinearLayout
            margin="0,8,0,0"
            width="200"
            height="wrap_content">

            <LinearLayout
            width="wrap_content"
            height="wrap_content"
            orientation="vertical">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={item.members}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>            

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={item.lastSeen}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            </LinearLayout>

            <ViewWidget
            height="0"
            weight="1"/>

            <Button
            type="SmallButton_Secondary_WB"
            width="wrap_content"
            height="wrap_content"
            onClick={this.handleAnswerSubmit}
            text="VIEW"/>


            </LinearLayout>
        )
    }

  getHeader(){
    return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="16,16,16,16"
            orientation="horizontal">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="My Communities"
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            <ViewWidget
            weight="1"
            height="0"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="View all"
            onClick={()=>{this.handleViewAllClick()}}
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

            </LinearLayout>)
  }


    handleMyCommunityClick (communityName){
        this.props.onMyCommunityClick(communityName);
        console.log("community selected",communityName);
    }

    handleViewAllClick(){
        this.props.onViewAllClick();
    }


  

  render() {
      this.layout = (
        <LinearLayout
          height="match_parent"
          width="match_parent"
          afterRender={this.afterRender}
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           {this.getRows()}


          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = MyCommunities;
