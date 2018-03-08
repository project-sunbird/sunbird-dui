var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../components/Sunbird/CropParagraph');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');
var CourseCurriculum = require('../components/Sunbird/CourseCurriculum');
var utils = require('../utils/GenericFunctions');


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
            "renderPage",
            "progressButtonContainer",
            "downloadAllButtonContainer",
            "ratingBar",
            "ratingContainer"
        ]);
        this.state = state;
        this.screenName = "ModuleDetailActivity"
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
        this.simpleData = {
            title: window.__S.DOWNLOAD_CONFIRMATION_TEXT,
            content: "",
            negButtonText: window.__S.NO,
            posButtonText: window.__S.YES
        }
        this.popupMenu = "Delete"
        this.shouldCacheScreen = false;

        this.moduleName = state.data.value0.moduleName;
        this.module = state.data.value0.moduleDetails;
        this.module = JSON.parse(this.module); //global content details for the current module being shown
        this.localStatus = this.module.isAvailableLocally;
        this.localContent = null;
        _this = this;
        this.downloadList = [];
        // array of all the children content ids
        this.subContentArray = [];
        //stack to maintain child traversal
        this.isPoped = false;
        this.stack = [];
        this.stackPush(this.moduleName, this.module); //the current content is always on the top of the stack
    }

    stackPush = (moduleName, module) => {
        this.isPoped = false;
        this.stack.push({
            moduleName: moduleName,
            module: module
        });
    }

    stackPop = () => {
        this.isPoped = true;
        if (this.stack.length > 0) {
            var top = this.stack[0];
            if (this.stack.length == 1)
                this.stack.splice(0, 1);
            else
                this.stack.splice(this.stack.length - 1, 1);
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
            var callback = callbackMapper.map(function (response) {
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
        console.log("data in download", data)
        var textToShow = "";
        if (data.status == "NOT_FOUND") {
            window.__ContentLoaderDialog.hide();
            window.__Snackbar.show(window.__S.ERROR_COLLECTION_IS_EMPTY);
            this.onBackPressed();
            return;
        }
        data.downloadProgress = data.downloadProgress == undefined || isNaN(data.downloadProgress) ? 0 : data.downloadProgress;
        var downloadedPercent = data.downloadProgress;
        downloadedPercent = downloadedPercent < 0 ? 0 : downloadedPercent;
        if (downloadedPercent == 100) {
            this.renderChildren(this.module.identifier);
        } else {
            var cmd = this.set({
                id: this.idSet.downloadProgressText,
                text: "Fetching Contents: " + downloadedPercent + "%"
            })
            Android.runInUI(cmd, 0);
        }
    }

    //check whether the current content has any children
    hasChildren = (mimeType) => {
        if (mimeType.toLowerCase() == "application/vnd.ekstep.content-collection")
            return true;
        else
            return false;
    }

    getSubcontentIds = (content) => {
        content.map((item, i) => {
            if (item.children == undefined) _this.subContentArray.push(item.identifier);
            else if (item.children != undefined) {
                _this.getSubcontentIds(item.children)

            }
        })
    }

    handleDownloadAllClick = () => {
        this.getSubcontentIds(this.courseContent.children);
        console.log("children", this.subContentArray);
        this.downloadContentCount = 0;
        this.childrenCount = this.subContentArray.length;
        window.__DownloadAllProgressButton.childrenCount = this.childrenCount;
        window.__DownloadAllProgressButton.childrenArray = this.subContentArray;
        JBridge.downloadAllContent(this.subContentArray);
        this.subContentArray = [];
        window.__DownloadAllPopup.hide();
    }

    showDownloadAllPopUp = () => {
        window.__DownloadAllPopup.props.totalSize = 0;
        window.__DownloadAllPopup.props.buttonClick = this.handleDownloadAllClick;
        window.__DownloadAllPopup.show();
    }

    checkContentLocalStatus = (module) => {
        _this = this;
        console.log('module', module);
        if (!this.hasChildren(module.mimeType)) {
            //if the current content is the leaf node content, display the button which checks whether the content is locally available,
            //display 'PLAY' or 'DOWNLOAD', and handle download or play.
            var cb = callbackMapper.map((data) => {
                if (data[0] != "__failed") {
                    _this.localContent = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
                    if (_this.localContent.hasOwnProperty("contentData") && _this.localContent.contentData.hasOwnProperty("me_averageRating")) {
                        _this.updateRatings(_this.localContent.contentData.me_averageRating);
                    } else {
                        _this.updateRatings(0);
                    }
                    if (_this.localContent.hasOwnProperty("contentFeedback") && _this.localContent.contentFeedback.length != 0) {
                        window.__RatingsPopup.initData(_this.localContent.identifier, "content-detail", _this.localContent.contentData.pkgVersion, _this.localContent.contentFeedback[0].rating, _this.localContent.contentFeedback[0].comments);
                    } else {
                        window.__RatingsPopup.initData(_this.localContent.identifier, "content-detail", _this.localContent.contentData.pkgVersion);
                    }
                }
            });
            JBridge.getContentDetails(module.identifier, cb, true);
            var _ = this.isPoped ? "" : JBridge.startEventLog(module.contentType, module.identifier, module.contentData.pkgVersion);
            this.localStatus = false;
            window.__ProgressButton.setLocalStatus(false);
            window.__ProgressButton.setVisibility("visible");
            window.__ProgressButton.setContentDetails(module);
            window.__ProgressButton.checkContentLocalStatus(this.localStatus);
        } else {
            //if the current content had children, get the children data and render the children
            var _ = this.isPoped ? "" : JBridge.startEventLog(module.contentType, module.identifier, module.contentData.pkgVersion);
            var callback = callbackMapper.map(function (data) {
                if (data == "__failed") {
                    window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
                    this.onBackPressed();
                    return;
                }
                _this.localContent = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
                console.log("renderModuleChildren -> ", _this.localContent);
                if (_this.localContent.hasOwnProperty("contentData") && _this.localContent.contentData.hasOwnProperty("me_averageRating")) {
                    _this.updateRatings(_this.localContent.contentData.me_averageRating);
                } else {
                    _this.updateRatings(0);
                }
                if (_this.localContent.hasOwnProperty("contentFeedback") && _this.localContent.contentFeedback.length != 0) {
                    window.__RatingsPopup.initData(_this.localContent.identifier, "content-detail", _this.localContent.contentData.pkgVersion, _this.localContent.contentFeedback[0].rating, _this.localContent.contentFeedback[0].comments);
                } else {
                    window.__RatingsPopup.initData(_this.localContent.identifier, "content-detail", _this.localContent.contentData.pkgVersion);
                }
                if (_this.localContent.isAvailableLocally == true) {
                    _this.renderModuleChildren(module);
                } else {
                    if (JBridge.isNetworkAvailable()) {
                        if (_this.downloadList.indexOf(module.identifier) == -1) {
                            _this.downloadList.push(module.identifier)
                            console.log("module", module);
                            JBridge.importCourse(module.identifier, "true", _this.downloadProgressCb());
                        } else {
                            window.__Snackbar.show(window.__S.ERROR_CONTENT_NOT_AVAILABLE);
                            _this.onBackPressed();
                            return;
                        }
                    } else {
                        window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
                    }
                }
            });// end of callback

                window.__getDownloadStatus = this.getSpineStatus;
                JBridge.getContentDetails(module.identifier, callback, true);
        }
    }

    downloadProgressCb = () => {
        return callbackMapper.map((data) => {
            console.log("downloadProgressCb in MDA -> ", data);

        });
    }

    renderChildren = (identifier) => {
        var callback1 = callbackMapper.map(function (data) {
            _this.module = JSON.parse(utils.jsonifyData(utils.decodeBase64(data[0])));
            _this.renderModuleChildren(_this.module);
        });
        JBridge.getChildContent(identifier, callback1);
    }

    handleModuleClick = (moduleName, module) => {
        console.log("handleModuleClick -> moduleName: " + moduleName + ", module: ", module);
        console.log("this.details", this.details);
        console.log("this.courseDetails", this.courseDetails);
        this.stackPush(moduleName, module);
        this.reRender(moduleName, module);
    }

    reRender = (moduleName, module) => {
        console.log("inside reRender, index : " + module.index);
        this.moduleName = moduleName;
        this.module = module;
        var layout = (
            <LinearLayout
                height="match_parent"
                root="true"
                width="match_parent"
                orientation="vertical">

                {this.getHeader()}
                {this.getBody()}

            </LinearLayout>
        )
        this.replaceChild(this.idSet.renderPage, layout.render(), 0);
        this.replaceChild(this.idSet.progressButtonContainer, this.getProgressButton().render(), 0);
        this.checkContentLocalStatus(module);
        var levels = this.getBottomThreeElements();
        JBridge.logRollupEvent("COURSE",window.__currCourseDetails.moduleName,levels[0] ,levels[1] ,levels[2] );

    }

    renderModuleChildren = (module) => {
        var layout;

        if (module.mimeType.toLowerCase() == "application/vnd.ekstep.content-collection") {
            if (module.children) {
                layout = (<CourseCurriculum
                    height="match_parent"
                    width="match_parent"
                    root="true"
                    margin="0,0,0,12"
                    brief={true} title=""
                    currIndex={module.index}
                    onClick={this.handleModuleClick}
                    content={module.children} />
                )
            } else {
                layout = (
                    <TextView
                        width="match_parent"
                        height="match_parent"
                        padding="0,20,0,0"
                        gravity="center"
                        text={window.__S.ERROR_CONTENT_NOT_AVAILABLE} />
                );
            }

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
            window.__ProgressButton.setButtonFor(module.identifier);
            window.__ProgressButton.setVisibility("visible");
        }
    }

    afterRender = () => {
        JBridge.setRating(this.idSet.ratingBar, 0);//this.details.content.me_averageRating);
        window.__ProgressButton.setButtonFor(this.module.identifier);
        JBridge.logContentDetailScreenEvent(this.module.identifier, this.module.contentData.pkgVersion);
        this.checkContentLocalStatus(this.module);
        var levels = this.getBottomThreeElements();
        JBridge.logRollupEvent("COURSE",window.__currCourseDetails.moduleName,levels[0] ,levels[1] ,levels[2]);

    }

    getBottomThreeElements = () => {
      var result = [];
      var count = 0;
      while(count<4){
        var moduleName = this.stack[count] ? this.stack[count].moduleName : null;
        result.push(moduleName);
        count++;
      }
      return result;
    }

    getLineSeperator = () => {
        return (<LinearLayout width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22} />
        )
    }

    updateRatings = (rating) => {
        var r = rating ? rating : 0;
        var layout = (
            <LinearLayout
                width="wrap_content"
                height="wrap_content"
                onClick={() => { window.__RatingsPopup.show() }}>
                <RatingBar
                    id={this.idSet.ratingBar}
                    width="wrap_content"
                    height="wrap_content" />
            </LinearLayout>
        );
        _this.replaceChild(_this.idSet.ratingContainer, layout.render(), 0);
        JBridge.setRating(this.idSet.ratingBar, r);
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
                    width="match_parent" >

                    <TextView
                        height="wrap_content"
                        width="0"
                        weight="1"
                        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
                        text={this.moduleName} />

                </LinearLayout>

                <TextView
                    height="wrap_content"
                    margin="0,0,0,12"
                    width="match_parent"
                    text={this.module.contentData.hasOwnProperty("size") ? window.__S.MODULE_SIZE.format(this.formatBytes(this.module.contentData.size)) : window.__S.MODULE_SIZE_UNAVAILABLE} />

                <LinearLayout
                    width="wrap_content"
                    height="wrap_content"
                    id={this.idSet.ratingContainer} />

                <CropParagraph
                    height="wrap_content"
                    margin="0,0,0,12"
                    width="match_parent"
                    headText={this.module.contentData.description ? window.__S.DESCRIPTION : undefined}
                    contentText={this.module.contentData.description} />

            </LinearLayout>)

        return headerLayout;
    }

    getBody = () => {
        var bodyLayout = (
            <LinearLayout
                height="match_parent"
                width="match_parent"
                root="true"
                id={this.idSet.descriptionContainer}
                orientation="vertical">

                <TextView
                    id={this.idSet.downloadProgressText}
                    test="Fetching spine"
                    height="match_parent"
                    gravity="center"
                    width="match_parent" />

            </LinearLayout>)


        return bodyLayout;
    }

    onBackPressed = () => {
        JBridge.endEventLog(this.module.contentType, this.module.identifier, this.module.contentData.pkgVersion);
        this.stackPop();
        var top = this.stackTop();
        if (!this.stack.length < 1 || top) {
            this.reRender(top.moduleName, top.module);
            window.__ProgressButton.setVisibility("gone")
        } else {
            var whatToSend = []
            var event = { "tag": "BACK_ModuleDetailActivity", contents: whatToSend };
            window.__runDuiCallback(event);
        }
    }

    changeOverFlow = () => {
        var toolbar = (<SimpleToolbar
            width="match_parent"
            menuData={this.menuData1}
            popupMenu={this.popupMenu}
            onBackPress={onBackPressed}
            overFlowCallback={this.overFlowCallback}
            showMenu="true" />)

        this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
    }

    handleOverFlowClick = () => {
        console.log("overflow")
    }

    getProgressButton = () => {
        return (
            <ProgressButton
                id={this.idSet.playButtonContainer}
                width="match_parent"
                visibility="gone"
                isCourse="true"
                playContent={this.props.localContent}
                contentDetails={this.module}
                changeOverFlowMenu={this.handleOverFlowClick}
                buttonText={window.__S.DOWNLOAD}
                localStatus={this.localStatus}
                identifier={this.module.identifier} />
        );
    }

    render() {

        this.layout = (
            <RelativeLayout
                width="match_parent"
                height="match_parent"
                clickable="true"
                root="true">
                <LinearLayout
                    root="true"
                    width="match_parent"
                    height="match_parent"
                    background={window.__Colors.WHITE}
                    clickable="true"
                    orientation="vertical">
                    <LinearLayout
                        root="true"
                        width="match_parent"
                        height="wrap_content"
                        id={this.idSet.simpleToolBarOverFlow}>
                        <SimpleToolbar
                            width="match_parent"
                            menuData={this.menuData}
                            popupMenu={this.popupMenu}
                            onBackPress={onBackPressed}
                            overFlowCallback={this.overFlowCallback}
                            showMenu="true" />
                    </LinearLayout>

                    <ScrollView
                        height="0"
                        weight="1"
                        width="match_parent"
                        fillViewport="true" >

                        <LinearLayout height="match_parent"
                            width="match_parent"
                            padding="16,0,16,0"
                            orientation="vertical"
                            id={this.idSet.renderPage}>

                            {this.getHeader()}
                            {this.getBody()}

                        </LinearLayout>

                    </ScrollView>

                    <LinearLayout
                        id={this.idSet.progressButtonContainer}
                        width="match_parent">
                        {this.getProgressButton()}
                    </LinearLayout>

                    <LinearLayout
                        id={this.idSet.downloadAllButtonContainer}
                        width="match_parent" />
                </LinearLayout>
            </RelativeLayout>
        );

        return this.layout.render();
    }
}

module.exports = Connector(ModuleDetailActivity);
