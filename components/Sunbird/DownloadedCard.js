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
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var StarComponent = require('../Sunbird/StarComponent');
var _this;


class DownloadedCard extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);
    console.log("download card contetn",this.props.content);

    
  }




  afterRender = () => {

  }

  getBody = () =>{
    return(
            <LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="16,0,0,22"
            onClick={()=>{this.handleCardClick(this.props.data.moduleText)}}
            orientation="vertical">

              <RelativeLayout
               width="200"
               background={window.__Colors.WHITE_FO}
               cornerRadius="4"
               height="110">

              <TextView
                width="200"
                height="wrap_content"
                padding = "10,10,10,10"
                alignParentBottom="true,-1"
                text= {this.props.data.moduleText}
                style={window.__TextStyle.textStyle.HINT.DULL}/>

                <LinearLayout
                width="200"
                height="110"
                gravity="center_horizontal"
                margin="0,22,0,0">

                <ImageView
                width="46"
                height="58"
                scaleType="fixXY"
                imageUrl={"ic_action_pdf"}/>

                </LinearLayout>

              

            </RelativeLayout>

            {this.getFooter()}

            </LinearLayout>)

  }

  getFooter= ()=>{
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
            text={this.props.data.stars}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={this.props.data.votes}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            </LinearLayout>

            <ViewWidget
            height="0"
            weight="1"/>

            <Button
            type="SmallButton_Secondary_BT"
            width="wrap_content"
            height="wrap_content"
             onClick={()=>{this.handleCardClick()}}
            text="OPEN"/>


            </LinearLayout>
        )
    }

  
    handleCardClick = () =>{
        this.props.onResourceClick(this.props.content);
    }

   

   

  render() {
      this.layout = (
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical">

          
           {this.getBody()}

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = DownloadedCard;
