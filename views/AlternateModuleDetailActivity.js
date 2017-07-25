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




class AlternateModuleDetailActivity extends View {
    constructor(props, children, state) {
        super(props, children, state);

        this.setIds([
            'ratingBar',
            "downloadProgressText",
            "descriptionContainer",
            "playButtonContainer"
        ]);
        this.state = state;
        this.screenName = "AlternateModuleDetailActivity"
        this.menuData = {
            url: [

            ]
        }
            this.menuData = {
              url: [
                
              ]
            }
            this.menuData1 = {
              url: [
                {imageUrl:'ic_action_overflow'}
              ]
            }
            this.popupMenu = "Delete"


        this.shouldCacheScreen = false;


        //to get geneie callback for download of spine




        this.module = state.data.value0.moduleDetails;
        this.moduleName = state.data.value0.moduleName;


        console.log("ModueDetail ", this.module)
        this.module = JSON.parse(this.module)
        console.log("module local statuws", this.module.isAvailableLocally)
        this.localStatus = this.module.isAvailableLocally;
        console.log("Module Title", this.moduleName)
        console.log("ModueContentDetials ", this.module)



    }

    formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + " Bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
        else return (bytes / 1073741824).toFixed(3) + " GB";
    };

overFlowCallback = (params) => {
    console.log("ITEM CLICKED",params);
    if(params == 0){
      var callback = callbackMapper.map(function(response){
        console.log("repsonse for delete",response)
        if(response[0] == "successful"){
          console.log("back to resource");
          _this.onBackPressed();
        }
      }); 
      JBridge.deleteContent(this.module.identifier,callback);
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
        var cmd;
        console.log("--->\t\t\t\n\n\n", pValue);

        var data = JSON.parse(pValue);

        if (data.identifier != this.module.identifier)
            return;

        var textToShow = ""
        console.log("DATA -> ", data)

        var downloadedPercent = parseInt(data.downloadProgress);
        downloadedPercent = (downloadedPercent == undefined ||  downloadedPercent < 0 )? 0 : downloadedPercent;
        if (downloadedPercent == 100) {

            console.log("SPINE IMPORTED -> ")
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
                JBridge.importCourse(identifier, "false")
            }



        });
        if (!this.module.isAvailableLocally || this.module.isUpdateAvailable) {
            window.__getDownloadStatus = this.getSpineStatus;
            JBridge.getLocalContentStatus(identifier, callback);
        } else {
            console.log("ALREADY PRESENT")
            this.renderModuleChildren();
        }
    }

    handleModuleClick = (moduleName, module) => {
        var whatToSend = { "moduleName": moduleName, "moduleDetails": JSON.stringify(module) }
        var event = { "tag": "OPEN_ModuleActivity", contents: whatToSend };
        window.__runDuiCallback(event);

    }


    renderModuleChildren = () => {
        var layout;
        console.log("RENDRING BREKAUP", this.module.children)
        if (this.module.children) {

            layout = ( <
                CourseCurriculum height = "match_parent"
                root = "true"
                margin = "0,0,0,12"
                brief = { true } title = ""
                onClick = { this.handleModuleClick } content = { this.module.children } width = "match_parent" / >
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

                <LinearLayout height = "wrap_content"
                gravity = "center_vertical"
                margin = "0,12,0,12"
                width = "match_parent" >
                    <TextView height = "wrap_content"
                        width = "0"
                        weight = "1"
                        style = { window.__TextStyle.textStyle.CARD.TITLE.DARK } text = { this.moduleName }/>

                </LinearLayout>  


                <TextView height = "wrap_content"
                margin = "0,0,0,12"
                width = "match_parent"
                text = { "Module Size " + this.formatBytes(this.module.contentData.size) }/>


                <CropParagraph height = "wrap_content"
                margin = "0,0,0,12"
                width = "match_parent"
                headText = { this.module.contentData.description ? "Description" : undefined } contentText = { this.module.contentData.description }/>


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
        var whatToSend = []
        var event = { "tag": "BACK_AlternateModuleDetailActivity", contents: whatToSend };
        window.__runDuiCallback(event);
    }


    render() {

        this.layout = ( 
            <LinearLayout 
            root = "true"
            background = { window.__Colors.WHITE } 
            orientation = "vertical"
            width = "match_parent"
            height = "match_parent" >
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

                <ScrollView height = "0"
                weight = "1"
                width = "match_parent"
                fillViewport = "true" >

                    <LinearLayout height = "match_parent"
                    width = "match_parent"
                    padding = "16,0,16,0"
                    orientation = "vertical" >


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
                    buttonText = "DOWNLOAD"
                    localStatus = { this.localStatus }
                    identifier = { this.module.identifier }/>

            </LinearLayout>
            );

            return this.layout.render();
        }
    }

module.exports = Connector(AlternateModuleDetailActivity);