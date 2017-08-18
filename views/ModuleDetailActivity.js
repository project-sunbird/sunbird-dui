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
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');


var _this;

class ModuleDetailActivity extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            'ratingBar',
            "downloadProgressText",
            "descriptionContainer",
            "playButtonContainer",
            "simpleToolBarOverFlow",
            "renderPage"
        ]);
        this.state = state;
        this.screenName = "AlternateModuleDetailActivity"
        this.menuData = {
          url: [
            {}
          ]
        }
        this.menuData1 = {
            url: [
                { imageUrl: 'ic_action_overflow' }
            ]
        }
        this.popupMenu = "Delete"
        this.shouldCacheScreen = false;

        this.moduleName = state.data.value0.moduleName;
        this.module = state.data.value0.moduleDetails;
        this.module = JSON.parse(this.module)
        this.localStatus = this.module.isAvailableLocally;
        _this = this;

        //stack to maintain child traversal
        this.stack = [];
        this.stackPush(this.moduleName,this.module);
    }

    stackPush = (moduleName, module) => {
      this.stack.push({
        moduleName: moduleName,
        module: module
      });
    }

    stackPop = () => {
      if (this.stack.length > 0){
        var top = this.stack[0];
        if (this.stack.length == 1)
          this.stack.splice(0, 1);
        else
          this.stack = this.stack.splice(0, 1);
        return top;
      } else {
        return null;
      }
    }

    stackTop = () => {
      return this.stack[this.stack.length - 1];
    }

    formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + " Bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
        else return (bytes / 1073741824).toFixed(3) + " GB";
    };

    overFlowCallback = (params) => {
        if (params == 0) {
            var callback = callbackMapper.map(function(response) {
                if (response[0] == "successful") {
                    _this.onBackPressed();
                }
            });
            JBridge.deleteContent(this.module.identifier, callback);
        }
    }

    onPop = () => {
        window.__getDownloadStatus = this.getSpineStatus;
        Android.runInUI(
            this.animateView(),
            null
        );
    }

    getSpineStatus = (pValue) => {
        var data = JSON.parse(pValue);
        if (data.identifier != this.module.identifier)
            return;

        var textToShow = "";
        if(data.status == "NOT_FOUND"){
          window.__ContentLoaderDialog.hide();
          JBridge.showSnackBar(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
          this.onBackPressed();
          return;
        }
        data.downloadProgress = data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
        var downloadedPercent = data.downloadProgress;
        downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;
        if (downloadedPercent == 100) {
            this.checkContentLocalStatus(this.module.identifier);
        } else {
            var cmd = this.set({
                id: this.idSet.downloadProgressText,
                text: "Fetching Contents: " + downloadedPercent + "%"
            })
            Android.runInUI(cmd, 0);
        }
    }

    checkContentLocalStatus = (identifier) => {
        _this = this;
        var callback = callbackMapper.map(function(status) {
            if (status == "true") {
                var callback1 = callbackMapper.map(function(data) {
                    _this.module = JSON.parse(data);
                    _this.renderModuleChildren(_this.module)
                });
                JBridge.getChildContent(identifier, callback1)
            } else {
              if (JBridge.isNetworkAvailable()){
                JBridge.importCourse(identifier, "false")
              }
              else
                JBridge.showSnackBar(window.__S.NO_INTERNET)
            }
        });
        if (!this.module.isAvailableLocally || this.module.isUpdateAvailable) {
            window.__getDownloadStatus = this.getSpineStatus;
            JBridge.getLocalContentStatus(identifier, callback);
        } else {
            this.renderModuleChildren(_this.module);
        }
    }

    handleModuleClick = (moduleName, module) => {
        // var whatToSend = { "moduleName": moduleName, "moduleDetails": JSON.stringify(module) }
        // var event = { "tag": "OPEN_ModuleActivity", contents: whatToSend };
        // window.__runDuiCallback(event);
        // this.renderModuleChildren(module);
        this.stackPush(moduleName, module);
        this.reRender(moduleName, module);
    }

    reRender = (moduleName, module) => {
      this.moduleName = moduleName;
      this.module = module;
       var layout = (
        <LinearLayout height = "match_parent"
        width = "match_parent"
        orientation = "vertical">

            { this.getHeader() }
            { this.getBody() }

        </LinearLayout>
      )
      this.replaceChild(this.idSet.renderPage, layout.render(), 0);
      this.afterRender();
    }

    renderModuleChildren = (module) => {
        var layout;
        console.log("RENDRING BREKAUP", module.children)
        if (module.children) {
            layout = ( <CourseCurriculum
                height = "match_parent"
                width = "match_parent"
                root = "true"
                margin = "0,0,0,12"
                brief = { true } title = ""
                onClick = { this.handleModuleClick }
                content = { module.children }  />
            )
            this.replaceChild(this.idSet.descriptionContainer, layout.render(), 0);
        } else {
            var cmd = this.set({
                id: this.idSet.downloadProgressText,
                visibility: "gone"
            });
            cmd = this.set({
              id: this.idSet.descriptionContainer,
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
        return ( <LinearLayout width = "match_parent"
            height = "2"
            margin = "0,16,0,0"
            background = { window.__Colors.PRIMARY_BLACK_22 }/>
        )
    }

    getHeader = () => {
      var headerLayout = (
        <LinearLayout
          height = "wrap_content"
          width = "match_parent"
          orientation = "vertical">

          <LinearLayout
            height = "wrap_content"
            gravity = "center_vertical"
            margin = "0,12,0,12"
            width = "match_parent" >

            <TextView height = "wrap_content"
              width = "0"
              weight = "1"
              style = { window.__TextStyle.textStyle.CARD.TITLE.DARK }
              text = { this.moduleName }/>

          </LinearLayout>

          <TextView
            height = "wrap_content"
            margin = "0,0,0,12"
            width = "match_parent"
            text={this.module.contentData.hasOwnProperty("size")? window.__S.MODULE_SIZE.format(this.formatBytes(this.module.contentData.size)) : window.__S.MODULE_SIZE_UNAVAILABLE }/>

          <CropParagraph
            height = "wrap_content"
            margin = "0,0,0,12"
            width = "match_parent"
            headText = { this.module.contentData.description ? window.__S.DESCRIPTION : undefined }
            contentText = { this.module.contentData.description }/>

        </LinearLayout>)

      return headerLayout;
    }

    getBody = () => {
        var bodyLayout = (
            <LinearLayout
                height = "match_parent"
                width = "match_parent"
                root = "true"
                id = { this.idSet.descriptionContainer }
                orientation = "vertical">

                <TextView
                    id = { this.idSet.downloadProgressText }
                    test = "Fetching spine"
                    height = "match_parent"
                    gravity = "centerz"
                    width = "match_parent" />

            </LinearLayout>)


            return bodyLayout;
        }

    onBackPressed = () => {
        this.stackPop();
        var top = this.stackTop();
        if (top){
          this.reRender(top.moduleName, top.module);
        } else {
          var whatToSend = []
          var event = { "tag": "BACK_ModuleDetailActivity", contents: whatToSend };
          window.__runDuiCallback(event);
        }
    }

    changeOverFlow = () =>{
      var toolbar =  (<SimpleToolbar
        width="match_parent"
        menuData={this.menuData1}
        popupMenu={this.popupMenu}
        onBackPress={onBackPressed}
        overFlowCallback = {this.overFlowCallback}
        showMenu="true"
        invert="true"/>)

      this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
    }

    render() {

        this.layout = (
            <LinearLayout
            root = "true"
            width = "match_parent"
            height = "match_parent"
            background = { window.__Colors.WHITE }
            clickable="true"
            orientation = "vertical">
                <LinearLayout
                    root = "true"
                    width="match_parent"
                    height="wrap_content"
                    id = {this.idSet.simpleToolBarOverFlow}>
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
                    height = "0"
                    weight = "1"
                    width = "match_parent"
                    fillViewport = "true" >

                    <LinearLayout height = "match_parent"
                    width = "match_parent"
                    padding = "16,0,16,0"
                    orientation = "vertical"
                    id = {this.idSet.renderPage}>

                        { this.getHeader() }
                        { this.getBody() }

                    </LinearLayout>

                </ScrollView>

                <ProgressButton
                    id = { this.idSet.playButtonContainer }
                    width = "match_parent"
                    visibility = "gone"
                    isCourse = "true"
                    contentDetails = { this.module }
                    changeOverFlowMenu = {this.handleOverFlowClick}
                    buttonText = "DOWNLOAD"
                    localStatus = { this.localStatus }
                    identifier = { this.module.identifier }/>

            </LinearLayout>
            );

            return this.layout.render();
        }
}

module.exports = Connector(ModuleDetailActivity);
