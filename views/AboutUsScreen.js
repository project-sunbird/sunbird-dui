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

class AboutUsScreen extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            "parentId"
        ]);
        //this.title = window.__aboutTheApp ? window.__aboutTheApp : ""
        this.shouldCacheScreen = false;
        window.__AboutUsScreen = this;
        this.visible = true;
        this.screenName = "AboutUsScreen";
        _this = this;
    }

    onBackPressed = () => {
        var whatToSend = [];
        var event = { tag: "BACK_AboutUsScreen", contents: whatToSend };
        window.__runDuiCallback(event);
    }

    getBody = () => {
        return (<LinearLayout
            background="#ffffff"
            width="match_parent"
            height="wrap_content"
            padding="16,16,16,16">
            <TextView
                height="match_parent"
                width="wrap_content"
                text={window.__S.ABOUT_US_DATA}
                textSize={"14"}
                color={"#FF000000"}
                lineHeight="20px"
                gravity="left" />
        </LinearLayout>);
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
                height="match_parent">
                <SimpleToolbar
                    title={window.__S.ABOUT_APPLICATION}
                    afterRender={this.afterRender}
                    width="match_parent"
                    onBackPress={this.onBackPressed} />
                <LinearLayout
                    width="match_parent"
                    height="4"></LinearLayout>
                {this.getBody()}
            </LinearLayout>
        );
        return this.layout.render();
    }
}
module.exports = Connector(AboutUsScreen);
