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


class ResourceViewAllCard extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
      'leftProgress',
      'rightProgress'
    ]);
    console.log("download card contetn",this.props.content);
    console.log("subtitle i gotISSSSS",this.props.data.footerSubTitle);

    
  }




  afterRender = () => {

  }

   getRemainingProgress = (progress) =>{
    var remainingProgress = 100 - parseInt(progress);
    return remainingProgress;
  }


  getFooter = () =>{
    return (    <LinearLayout
                  width="wrap_content"
                  height="wrap_content"
                  padding = "12,27,16,12">


                  <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical">

                  <TextView
                    width="wrap_content"
                    height="wrap_content"
                    style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                    text={this.props.data.footerTitle}/>

                  <TextView
                    width="wrap_content"
                    height="wrap_content"
                    style={window.__TextStyle.textStyle.HINT.REGULAR}
                    text={this.props.data.footerSubTitle}/>

                  </LinearLayout>

                  <ViewWidget
                      height="0"
                      weight="1"/>

                    <Button
                    type="SmallButton_Secondary_BT"
                    width="wrap_content"
                    height="wrap_content"
                    onClick={()=>this.handleCardClick()}
                    text={this.props.data.actionText? this.props.data.actionText : "OPEN"}/>

                </LinearLayout>);
  }




  getBody = () =>{
    console.log("data in card content",this.props.data);
    return(
            <LinearLayout
              width = "match_parent"
              height = "match_parent"
              margin = "16,16,16,0"
              padding = "1,1,1,1"
              multiCorners={"10,10,10,10,"+window.__Colors.SHADOW_BLACK}>
           
            
              <LinearLayout
                width="match_parent"
                height="match_parent"
                multiCorners={"10,10,10,10,"+window.__Colors.WHITE}>
              
              <LinearLayout
                onClick={()=>this.handleCardClick()}>
                

                <RelativeLayout
                  width = "100"
                  height = "100">


                <LinearLayout
                width="match_parent"
                height="match_parent"
                scaleType="fixXY"
                alpha="0.5"
                multiCorners={"10,0,0,10,"+window.__Colors.BLACK}/>
      
                <ImageView
                  width="match_parent"
                  height="match_parent"
                  gravity="center"
                  circularImageUrl={"25,"+ "https://images.fineartamerica.com/images-medium-large-5/sunflower-abstract-by-nature-square-lee-craig.jpg"}/>
               
                </RelativeLayout>


                <LinearLayout
                  orientation = "vertical">

                  <LinearLayout
                  visibility={this.props.data.isProgress?"visible":"gone"}
                  width="match_parent"
                  height="wrap_content">

                  <LinearLayout
                  width="0"
                  weight={this.props.data.isProgress?this.props.data.footerTitle.split('%')[0]:"0"}
                  height="3"
                  id={this.idSet.leftProgress}
                  multiCorners={"0,0,0,0,"+window.__Colors.SAFFRON}/>

                  <LinearLayout
                  width="0"
                  weight={this.props.data.isProgress?this.getRemainingProgress(this.props.data.footerTitle.split('%')[0]):"0"}
                  height="3"
                  alpha="0.5"
                  id={this.idSet.rightProgress}
                  multiCorners={"0,6,0,0,"+window.__Colors.PRIMARY_BLACK}/>

                  </LinearLayout>
                
                  
                  <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={this.props.data.name}
                    margin = "12,9,12,0"
                    style={window.__TextStyle.textStyle.CARD.HEADING}/>

                {this.getFooter()}

            </LinearLayout>

          </LinearLayout>
        </LinearLayout>
      </LinearLayout> )

  }


  
    handleCardClick = () =>{
      console.log("click card",this.props.content);
        this.props.onResourceClick(this.props.content);
    }

   

   

  render() {
      this.layout = (
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          >

          
           {this.getBody()}

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ResourceViewAllCard;
