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
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextStyle = require("../res/TextStyle.js");

window.R = require("ramda");
var _this;

class AboutUsScreen extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            "parentId",
            "webViewContainer"
        ]);
        this.section = JSON.parse(state.data.value0.sectionData).name;
        console.log("AboutUsScreen -> ", this.section);
        this.shouldCacheScreen = false;
        window.__AboutUsScreen = this;
        this.visible = true;
        this.screenName = "AboutUsScreen";
        _this = this;
        this.initData();
    }

    initData = () => {
        this.title = "";
        switch(this.section) {
            case "PRIVACY_POLICY":
                this.title = window.__S.PRIVACY_POLICY;
                break;
            case "TERMS_OF_SERVICE":
                this.title = window.__S.TERMS_OF_SERVICE;
                break;
            case "ABOUT":
                this.title = window.__S.ABOUT_APPLICATION;
                break;
        }
    }

    afterRender = () => {
        JBridge.displayHTML(this.idSet.webViewContainer, this.section);
    }

    onBackPressed = () => {
        var whatToSend = [];
        var event = { tag: "BACK_AboutUsScreen", contents: whatToSend };
        window.__runDuiCallback(event);
    }

    render = () => {
        this.layout = (
            <LinearLayout
                id={this.idSet.parentId}
                background={window.__Colors.WHITE_F2}
                clickable="true"
                root="true"
                orientation="vertical"
                width="match_parent"
                height="match_parent"
                afterRender = {this.afterRender}>
                <SimpleToolbar
                    title={this.title}
                    afterRender={this.afterRender}
                    width="match_parent"
                    onBackPress={this.onBackPressed} />
                <LinearLayout
                    width="match_parent"
                    height="4"></LinearLayout>
                <LinearLayout
                    width="match_parent"
                    id = {this.idSet.webViewContainer} />
            </LinearLayout>
        );
        return this.layout.render();
    }
}
module.exports = Connector(AboutUsScreen);
