var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");

var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var TextInputView = require("../components/Sunbird/core/TextInputView");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var TextStyle = require("../res/TextStyle.js");

window.R = require("ramda");
var _this;

class AboutUsActivity extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            "parentId"
        ]);
        this.shouldCacheScreen = false;
        window.__AboutUsActivity = this;
        this.state = state;
        this.visible = true;
        this.screenName = "AboutUsActivity";
        _this = this;
    }

    handleClick = () => {
        window.__Snackbar.show(window.__S.COMING_SOON);
    }

    onBackPressed = () => {
        var whatToSend = { "profile": JSON.stringify("{}") }
        var event = { tag: "BACK_AboutUsActivity", contents: whatToSend };
        window.__runDuiCallback(event);
    }

    nextScreen = (section) => {
        var whatToSend = { "sectionData": JSON.stringify({
            "name": section,
        }) }
        var event = { tag: "OPEN_AboutUsScreen", contents: whatToSend };
        window.__runDuiCallback(event);
    }

    getLineSeperator() {
        return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,1,0,0"
            background={window.__Colors.PRIMARY_BLACK_22} />)
    }

    getBody = (mainStr, substr) => {
        return (<LinearLayout
            height="wrap_content"
            width="match_parent"
            orientation="vertical"
            background="#ffffff">
            <LinearLayout
                width="wrap_content"
                height="wrap_content"
                padding="16,16,16,16"
                orientation="vertical">
                <TextView
                    height="wrap_content"
                    width="wrap_content"
                    text={mainStr}
                    textSize={"14"}
                    color={"#FF000000"}
                    gravity="left" />
                <TextView
                    height="wrap_content"
                    width="wrap_content"
                    padding="0,4,0,0"
                    text={substr}
                    textSize={"14"}
                    color={"#FF969696"}
                    gravity="left" />
            </LinearLayout>
        </LinearLayout>)
    }

    getBody2 = (mainStr, fun) => {
        return (<LinearLayout
            height="wrap_content"
            width="match_parent"
            orientation="vertical"
            background="#ffffff">
            <LinearLayout
                width="match_parent"
                onClick={fun}
                height="wrap_content"
                clickable="true"
                background="#ffffff"
                orientation="horizontal">
                <TextView
                    height="wrap_content"
                    width="wrap_content"
                    padding="16,16,16,16"
                    text={mainStr}
                    textSize={"14"}
                    color={"#FF000000"}
                    gravity="left" />
                <LinearLayout
                    height="match_parent"
                    weight="1" />
                <ImageView
                    width="10"
                    height="10"
                    imageUrl={"ic_action_arrow_right"}
                    margin="0,25,8,0" />
            </LinearLayout>
        </LinearLayout>);
    }

    checkUpdates = () => {
        return (<LinearLayout
            height="wrap_content"
            width="match_parent"
            orientation="vertical"
            background="#ffffff">
            <LinearLayout
                width="wrap_content"
                height="wrap_content"
                padding="16,16,16,16"
                orientation="vertical">
                <TextView
                    width="wrap_content"
                    textSize="14"
                    height="wrap_content"
                    color="#000000"
                    text={window.__S.APP_VERSION} />
                <TextView
                    height="wrap_content"
                    width="wrap_content"
                    padding="0,4,0,0"
                    text={JBridge.getAppName() + " v" + JBridge.getAppVersion()}
                    textSize={"14"}
                    color={"#FF969696"}
                    gravity="left" />
                <TextView
                    height="match_parent"
                    width="wrap_content"
                    text={window.__S.CHECK_FOR_UPDATES}
                    textSize={"12"}
                    padding="0,4,0,0"
                    color={"#FF0079FF"}
                    gravity="left" />
            </LinearLayout>
        </LinearLayout>)
    }

    render = () => {
        this.layout = (
            <LinearLayout
                id={this.idSet.parentId}
                root="true"
                clickable="true"
                height="match_parent"
                width="match_parent"
                orientation="vertical"
                background={window.__Colors.WHITE_F2}>
                <SimpleToolbar
                    title={window.__S.ABOUT_US}
                    afterRender={this.afterRender}
                    width="match_parent"
                    onBackPress={this.onBackPressed} />
                <LinearLayout
                    width="match_parent"
                    height="4"></LinearLayout>
                {this.getBody(window.__S.DEVICE_ID, JBridge.getDeviceId())}
                {this.getLineSeperator()}
                {this.checkUpdates()}
                <LinearLayout
                    width="match_parent"
                    height="8"></LinearLayout>
                {this.getBody2(window.__S.PRIVACY_POLICY, () => this.nextScreen("PRIVACY_POLICY"))}
                {this.getLineSeperator()}
                {this.getBody2(window.__S.TERMS_OF_SERVICE, () => this.nextScreen("TERMS_OF_SERVICE"))}
                {this.getLineSeperator()}
                {this.getBody2(window.__S.ABOUT_APPLICATION, () => this.nextScreen("ABOUT"))}
            </LinearLayout>
        );
        return this.layout.render();
    }
}
module.exports = Connector(AboutUsActivity);
