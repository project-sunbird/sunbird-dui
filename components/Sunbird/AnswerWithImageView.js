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


class AnswerWithImageView extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "selectorContainer",
      "picassoImageView"
    ]);
    //this.displayName = "answer_view" + (this.props.index != undefined ? ("_" + this.props.index) : "")
    this.displayName = "answer_view";

    this.containsImage = (this.props.item.imageUrl === undefined ? true : false)
    this.selectedStatus = false;

  }


  setStatus = (status) => {
    this.selectedStatus = status;
    var content;
    if (!status) {
      content = this.getIndexHolder();
    } else {
      content = this.getSelectedImage();
    }
    this.replaceChild(this.idSet.selectorContainer, content.render(), 0);
  }


  getIndexHolder = () => {
    return (<ImageView
              width="156"
              height="156"
              imageFromUrl={this.props.item.imageUrl}
              id={this.idSet.picassoImageView}
              margin="0,0,0,0"/>)
      // imageFromUrl={this.props.item.imageUrl}
  }

  getSelectedImage = () => {
    return (<ImageView
            width="40"
            height="40"
            imageUrl={"ic_action_completed"}
            margin="0,0,0,0"/>)
  }

  handleSelectionEvent = () => {
    this.setStatus(!this.selectedStatus);
    this.props.onItemSelected(this.props.index, this.selectedStatus);

  }

  afterRender = () => {
    //setTimeout(() => { JBridge.setImageFromUrl(this.idSet.picassoImageView, this.props.item.imageUrl); }, 500);
  }

  render() {


    this.layout = (
      <LinearLayout
      width="156"
      cornerRadius="5"
      margin="0,0,0,12"
      afterRender={this.afterRender}
      stroke ={"2," + window.__Colors.PRIMARY_BLACK_66}
      height="180">
        <LinearLayout
      width="match_parent"
      orientation="vertical"
      gravity="center_horizontal"
      padding="1,1,1,1"
      allowMultipleClicks="true"
      onClick={this.handleSelectionEvent}
      height="match_parent">

              
              {this.getIndexHolder()}
             
            <TextView
            width="match_parent"
            height="wrap_content"
            gravity="center"
            text={this.props.item.key}
            margin="0,0,0,0"
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

         </LinearLayout> 
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = AnswerWithImageView;
