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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;


var Button = require('../../Sunbird/Button');

var _this;

class ProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ProgressButton";
    this.setIds([
      "downloadingText",
      "downloadBarContainer",
      "downloadBar"
    ])

    this.isDownloaded = false;
    this.checkContentLocalStatus(this.props.identifier);
    _this = this;

  }

  handleClick = () => {
    window.__getDownloadStatus = this.updateProgress;
    this.props.onButtonClick();
  }


  checkContentLocalStatus = (identifier) => {
    var callback = callbackMapper.map(function(status) {


      if (status == "true") {
        _this.isDownloaded = true;
        _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons("100", "PLAY").render(), 0);

      }



    });
    JBridge.getLocalContentStatus(identifier, callback);
  }



  updateProgress = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.props.identifier)
      return;

    var textToShow = ""

    if (parseInt(data.downloadProgress) == 100) {

      _this.isDownloaded = true;
      textToShow = "PLAY"


    } else {
      _this.isDownloaded = false;
      textToShow = "DOWNLOADED " + data.downloadProgress + "%"

    }
    _this.replaceChild(_this.idSet.downloadBarContainer, _this.getButtons(data.downloadProgress, textToShow).render(), 0);




  }


  handleButtonClick = () => {
    console.log("dp", this.isDownloaded);
    if (this.isDownloaded) {
      console.log("play");
      JBridge.playContent(this.props.identifier);

    } else {
      console.log("download");
      JBridge.importCourse(this.props.identifier);

    }

  }






  getDownloadBackground = (value) => {

    value = (value < 0) ? 0 : value;

    var pLeft = parseFloat(value) / parseFloat(100);
    var pRight = (1 - pLeft);

    return (<LinearLayout
        width="match_parent"
        onClick={this.handleButtonClick}
        root="true"
        height="48">

            <LinearLayout
            width="0"
            height="match_parent"
            weight={pLeft}
            multiCorners={"8,0,0,8,"+window.__Colors.THICK_BLUE}/>

            <LinearLayout
            width="0"
            height="match_parent"
            weight={pRight}
            multiCorners={"0,8,8,0,"+window.__Colors.PRIMARY_DARK}/>

        </LinearLayout>)

  }



  getButtons = (value, text) => {
    var _this = this;
    var layout = (
      <RelativeLayout
        width="match_parent"
        height="48"
        root="true">

        
      { this.getDownloadBackground(value)}
        

        <TextView
        width="wrap_content"
        height="wrap_content"
        centerInParent="true,-1"
        id={this.idSet.downloadingText}
        style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
        text={text}/>

        </RelativeLayout>)

    return layout;
  }



  render() {
    var text = this.props.text;


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}
        id={this.idSet.downloadBar}
        >
        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>
        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="16,16,16,16"
          root="true"
          id={this.idSet.downloadBarContainer}>
       
            {this.getButtons(0,"DOWNLOAD COURSE")}
       
         </LinearLayout>     

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ProgressButton;
