var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;
var objectAssign = require('object-assign');
window.R = require("ramda");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');

var _this = this;

class ModuleDetailActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'ratingBar',
      "downloadProgressText",
      "descriptionContainer",
      "playButtonContainer",
      "simpleToolBarOverFlow"
    ]);
    this.state = state;
    this.screenName = "ModuleDetailActivity"
    this.shouldCacheScreen = false;

    _this=this;

    this.menuData = {
      url: [
        {}
      ]
    }

    this.menuData1 = {
      url: [
        {imageUrl:'ic_action_overflow'}
      ]
    }
    this.popupMenu = window.__S.DELETE;

    this.module = state.data.value0.moduleDetails;
    this.moduleName = state.data.value0.moduleName;

    this.module = JSON.parse(this.module)

    this.localStatus = this.module.isAvailableLocally;

  }

  formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  };


  changeOverFlow = () =>{
    var toolbar = (
      <SimpleToolbar
          width="match_parent"
          menuData={this.menuData1}
          popupMenu={this.popupMenu}
          onBackPress={onBackPressed}
          overFlowCallback = {this.overFlowCallback}
          showMenu="true"
          invert="true"
          />)

    this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
  }


  onPop = () => {
    window.__getDownloadStatus = this.getSpineStatus;
    Android.runInUI(
      this.animateView(),
      null
    );
  }


  getSpineStatus = (pValue) => {
    var cmd;

    var data = JSON.parse(pValue);

    if (data.identifier != this.module.identifier)
      return;

    var textToShow = ""
    data.downloadProgress= data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
    var downloadedPercent = data.downloadProgress;
    downloadedPercent =  downloadedPercent < 0 ? 0 : downloadedPercent;


    if (downloadedPercent == 100) {
      this.checkContentLocalStatus(this.module.identifier);

    } else {
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        text: window.__S.FETCHING_CONTENTS.format(downloadedPercent)
      })
      Android.runInUI(cmd, 0);
    }
  }

  checkContentLocalStatus = (identifier) => {
    var _this = this;
    var callback = callbackMapper.map(function(status) {

      if (status == "true") {

        _this.localStatus = true;
        var callback1 = callbackMapper.map(function(data) {

          _this.module = JSON.parse(data);
          _this.renderModuleChildren()
        });
        JBridge.getChildContent(identifier, callback1)
      } else {
        if(JBridge.isNetworkAvailable()){
          JBridge.importCourse(identifier,"false")
        }
        else
          JBridge.showSnackBar(window.__S.NO_INTERNET)
      }

    });

    if (!this.module.isAvailableLocally || this.module.isUpdateAvailable) {

      window.__getDownloadStatus = this.getSpineStatus;
      JBridge.getLocalContentStatus(identifier, callback);
    } else {

      this.renderModuleChildren();
    }
  }

  handleModuleClick = (moduleName, module) => {
    var eventAction = { "tag": "OPEN_AlternateModuleDetailActivity", contents: { "moduleName": moduleName, "moduleDetails": JSON.stringify(module) } };
    window.__runDuiCallback(eventAction);

  }


  renderModuleChildren = () => {
    var layout;

    if (this.module.children) {

      layout = (

        <CourseCurriculum
                  height="match_parent"
                  width="match_parent"
                  root="true"
                  margin="0,0,0,12"
                  brief={true}
                  title=""
                  onClick={this.handleModuleClick}
                  content= {this.module.children}/>
      )

      this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0);
    } else {
      var cmd = this.set({
        id: this.idSet.downloadProgressText,
        visibility: "gone"
      });
      Android.runInUI(cmd, 0);

      window.__ProgressButton.setVisibility("visible")

    }


  }

  afterRender = () => {
    this.checkContentLocalStatus(this.module.identifier);
  }


  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }



  getHeader = () => {
    var headerLayout = (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">

          <LinearLayout
            height="wrap_content"
            gravity="center_vertical"
            margin="0,12,0,12"
            width="match_parent">
            <TextView
              height="wrap_content"
              width="0"
              weight="1"
              style={window.__TextStyle.textStyle.HEADING.DARK}
              text={this.moduleName}/>

            <ImageView
              imageUrl="ic_share_black"
              visibility="gone"
              width="48"
              height="48"
              padding="12,12,12,12"/>

          </LinearLayout>


          <TextView
            height="wrap_content"
            margin="0,0,0,12"
            width="match_parent"
            text={this.module.contentData.hasOwnProperty("size")? window.__S.MODULE_SIZE.format(_this.formatBytes(_this.module.contentData.size)) : window.__S.MODULE_SIZE_UNAVAILABLE}/>


           <CropParagraph
                  height="wrap_content"
                  margin="0,0,0,12"
                  width="match_parent"
                  headText={this.module.contentData.description?window.__S.DESCRIPTION:undefined}
                  contentText={this.module.contentData.description}
                  />



        </LinearLayout>)



    return headerLayout;
  }



  getBody = () => {
    var bodyLayout = (<LinearLayout
                  id={this.idSet.descriptionContainer}
                  height="match_parent"
                  width="match_parent"
                  root="true"
                  orientation="vertical">


                     <TextView
                        id={this.idSet.downloadProgressText}
                        test={window.__S.LOADING_CONTENT}
                        height="match_parent"
                        gravity="center"
                        width="match_parent"/>

                </LinearLayout>)


    return bodyLayout;
  }

overFlowCallback = (params) => {
    if(params == 0){
      var callback = callbackMapper.map(function(response){
        if(response[0] == "successful"){
          _this.onBackPressed();
        }
      });
      JBridge.deleteContent(this.module.identifier,callback);
    }
  }


  onBackPressed = () => {
    var eventAction = { "tag": "BACK_ModuleDetailActivity", contents: [] };
    window.__runDuiCallback(eventAction);
  }

handleOverFlowClick = () => {

}

  render() {

    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        clickable="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

      <LinearLayout
        id = {this.idSet.simpleToolBarOverFlow}
        root = "true"
        width="match_parent"
        height="wrap_content">

        <SimpleToolbar
          width="match_parent"
          menuData={this.menuData}
          popupMenu={this.popupMenu}
          onBackPress={onBackPressed}
          overFlowCallback = {this.overFlowCallback}
          showMenu="true"
          invert="true"/>

        </LinearLayout>

              <ScrollView
                height="0"
                weight="1"
                width="match_parent"
                fillViewport="true">

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
                 id={this.idSet.playButtonContainer}
                 width="match_parent"
                 visibility="gone"
                 isCourse = "true"
                 buttonText={window.__S.DOWNLOAD}
                 changeOverFlowMenu = {this.handleOverFlowClick}
                 localStatus = {this.localStatus}
                 identifier = {this.module.identifier}
                 contentDetails = {this.module}
                 />

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ModuleDetailActivity);
