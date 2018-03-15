var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var CircularLoader = require('./core/CircularLoader');
var TextStyle = require("../../res/TextStyle.js");

class ShareFilePopup extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            "popUpContainer",
            "headerText",
            "linkShareIntents"
        ]);
        this.isVisible = false;
    }

    show = (headerText, cb) => {
        this.isVisible = true;
        this.setVisibility(headerText, "visible");
        cb(this.idSet.linkShareIntents);
    }

    hide = () => {
        this.isVisible = false;
        this.replaceChild(this.idSet.linkShareIntents, (<CircularLoader
            margin="0,0,0,0" />).render(), null);
        this.setVisibility("", "gone");
    }

    getVisibility = () => {
        return this.isVisible;
    }

    setVisibility = (headerText, data) => {
        var cmd = this.set({
            id: this.idSet.popUpContainer,
            visibility: data
        });
        cmd += this.set({
            id: this.idSet.headerText,
            text: headerText
        });
        Android.runInUI(cmd, 0);
    }

    render = () => {
        var layout = (
            <LinearLayout
                height="match_parent"
                width="match_parent"
                id={this.idSet.popUpContainer}
                visibility="gone"
                root="true"
                background={window.__Colors.PRIMARY_BLACK_44}
                orientation="vertical">

                <LinearLayout
                    height="0"
                    width="match_parent"
                    onClick={this.hide}
                    weight="1" />

                <LinearLayout
                    cornerRadius="2"
                    width="match_parent"
                    height="wrap_content"
                    root="true"
                    visibility="visible"
                    orientation="vertical"
                    clickable="true"
                    padding="16,18,16,16"
                    background="#ffffff">

                    <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        gravity="center_vertical"
                        margin="0,0,0,16">

                        <TextView
                            id={this.idSet.headerText}
                            width="wrap_content"
                            height="wrap_content"
                            gravity="center_vertical"
                            style={window.__TextStyle.textStyle.CARD.TITLE.DARK} />

                        <LinearLayout
                            width="0"
                            weight="1"
                            height="0" />

                        <ImageView
                            width="18"
                            height="18"
                            onClick={this.hide}
                            gravity="center_vertical"
                            imageUrl="ic_action_close" />
                    </LinearLayout>

                    <HorizontalScrollView
                        width="wrap_content"
                        height="wrap_content"
                        scrollBarX="false"
                        fillViewport="true">

                        <LinearLayout
                            margin="0,8,0,24"
                            width="wrap_content"
                            id={this.idSet.linkShareIntents}
                            height="match_parent">

                            <CircularLoader
                                margin="0,0,0,0" />
                        </LinearLayout>
                    </HorizontalScrollView>
                </LinearLayout>
            </LinearLayout>
        );
        return layout.render();
    }
}

module.exports = ShareFilePopup;