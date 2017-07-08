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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;
var objectAssign = require('object-assign');
window.R = require("ramda");
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var ProgressButton = require('../../components/Sunbird/core/ProgressButton');
var CourseCurriculum = require('../../components/Sunbird/CourseCurriculum');


class ModuleDetailScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'ratingBar',
      "downloadProgressText",
      "descriptionContainer"
    ]);
    this.state = state;
    this.screenName = "ModuleDetailScreen"
    this.menuData = {
      url: [
        { imageUrl: "ic_action_share" },
        { imageUrl: "ic_action_bookmark" },
        { imageUrl: "ic_action_overflow" },
      ]
    }

    this.shouldCacheScreen = false;


    //to get geneie callback for download of spine
    window.__getDownloadStatus = this.getSpineStatus;



    this.module = state.data.value0.moduleDetails;
    this.moduleName = state.data.value0.moduleName;


    console.log("ModueDetail ", this.module)
    this.module = JSON.parse(this.module)
    console.log("Module Title", this.moduleName)
    console.log("ModueContentDetials ", this.module)
    this.checkContentLocalStatus(this.module.identifier);


  }

  formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  };





  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }


  getSpineStatus = (pValue) => {
    var cmd;
    console.log("--->\t\t\t\n\n\n", pValue);

    var data = JSON.parse(pValue);

    if (data.identifier != this.module.identifier)
      return;

    var textToShow = ""
    console.log("DATA -> ", data)

    var downloadedPercent = parseInt(data.downloadProgress);
    downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;

    if (downloadedPercent == 100) {

      console.log("SPINE IMPORTED -> ")
      this.checkContentLocalStatus(this.module.identifier);

    } else {
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        text: "Downloaded " + downloadedPercent + "%"
      })
      Android.runInUI(cmd, 0);
    }
  }

  checkContentLocalStatus = (identifier) => {
    var _this = this;
    var callback = callbackMapper.map(function(status) {

      if (status == "true") {
        console.log("Spine Found")
        var callback1 = callbackMapper.map(function(data) {
          console.log("module details;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;", JSON.parse(data));
          _this.module = JSON.parse(data);
          _this.renderModuleChildren()
        });
        JBridge.getChildContent(identifier, callback1)
      } else {
        console.log("Spine Not Found, IMPORTING ")
        JBridge.importCourse(identifier)
      }



    });
    JBridge.getLocalContentStatus(identifier, callback);
  }


  renderModuleChildren = () => {
    var layout;
    console.log("RENDRING BREKAUP", this.module.children)
    if (this.module.children) {
      layout = (<CourseCurriculum
                  height="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  content= {this.module.children}
                  width="match_parent"/>)
    } else {
      layout = (<TextView 
        height="50"
        width="match_parent"
        text="NO CHILD"/>)
    }
    this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0)
  }


  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }



  getHeader = () => {
    var headerLayout = (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">

          <LinearLayout
            height="wrap_content"
            gravity="center_vertical"
            margin="0,0,0,12"  
            width="match_parent">
            <TextView
              height="wrap_content"
              width="0"
              weight="1"
              text={this.moduleName}/>

            <ImageView
              imageUrl="ic_action_share"
              width="48"
              height="48"
              padding="12,12,12,12"/>

          </LinearLayout>  


          <TextView
            height="wrap_content"
            margin="0,0,0,12"
            width="match_parent"
            text={"Module Size "+this.formatBytes(this.module.contentData.size)}/>


          <CropParagraph
                  height="wrap_content"
                  margin="0,0,0,12"
                  width="match_parent"
                  contentText={this.module.contentData.description}
                  />


           {this.getLineSeperator()}       

        </LinearLayout>)



    return headerLayout;
  }



  getBody = () => {
    var bodyLayout = (<LinearLayout
                  height="match_parent"
                  width="match_parent"
                  gravity="center"
                  root="true"
                  orientation="vertical"
                  id={this.idSet.descriptionContainer}>
                     <TextView
                        id={this.idSet.downloadProgressText}
                        test="Fetching spine"
                        height="300"
                        gravity="center"
                        width="match_parent"/>
                </LinearLayout>)


    return bodyLayout;
  }

  onBackPressed = () => {
    var eventAction = { "tag": "BackToParent", contents: [] };
    window.__runDuiCallback(eventAction);
  }


  render() {
    var buttonList = ["DOWNLOAD THIS MODULE"];
    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          afterRender={this.afterRender}
          width="match_parent"
          menuData={this.menuData}
          onBackPress={onBackPressed}
          showMenu="true"
          invert="true"/>

              <ScrollView
                height="0"
                weight="1"
                width="match_parent"
                fillViewport="true"
                >

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  padding="16,0,16,0"
                  orientation="vertical">


                  {this.getHeader()}

                 
                  {this.getBody()}
                  

                </LinearLayout>

                </ScrollView>

               <ProgressButton
                 width="match_parent"
                 buttonItems={buttonList}
                 identifier = {this.module.identifier}/>
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ModuleDetailScreen);
