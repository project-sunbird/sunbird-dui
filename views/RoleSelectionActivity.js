var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var utils = require('../utils/GenericFunctions');
window.R = require("ramda");
const Font = require('../res/Font');

class RoleSelectionActivity extends View {

    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            "cardsContainer",
            "continueBtn",
            "whiteArrow",
            "scrollViewContainer"
        ]);
        this.options = [{
            id: 1,
            role: window.__S.TEACHER_ROLE,
            selected: false,
            desc: window.__S.TEACHER_ROLE_DESC
        }, {
            id: 2,
            role: window.__S.STUDENT_ROLE,
            selected: false,
            desc: window.__S.STUDENT_ROLE_DESC
        }];
        this.shouldCacheScreen = false;
    }

    handleRoleSelect = () => {
        var role = "";
        this.options.map((item) => {
            if (item.selected) role = item.id == 1 ? "teacher" : "student";
        });
        if (role != "") {
            JBridge.setInSharedPrefs("role", role);
            JBridge.logUserTypeSelection(role);
            this.setAsGuestUser();
        }
    }

    handleCardClick = (index) => {
        this.options.map((item, i) => {
            if (index == i){
                item.selected = true;
            }else {
                item.selected = false;
            }
        });
        var layout = (
            <LinearLayout
                width="match_parent"
                height="match_parent"
                orientation="vertical"
                gravity="center">
                {this.getCards()}
            </LinearLayout>
        )
        this.replaceChild(this.idSet.cardsContainer, layout.render(), null);
    }

    getContinueBtn = () => {
        return (
            <LinearLayout
                id = {this.idSet.continueBtn}
                height={"48"}
                width={"match_parent"}
                orientation="horizontal"
                gravity="center_vertical"
                background={"#FF0076FE"}
                cornerRadius="4"
                alignParentBottom = "true,-1"
                margin="20,16,20,16"
                clickable="true"
                visibility="gone">
                <RelativeLayout
                    height="match_parent"
                    width="match_parent"
                    gravity="center_vertical"
                    onClick={this.handleRoleSelect}>
                    <TextView
                        width="match_parent"
                        textAllCaps="true"
                        text={window.__S.CONTINUE}
                        textSize={"14"}
                        color={"#FFFFFFFF"}
                        gravity="center" />
                    <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        padding="0,0,16,0"
                        gravity="right">
                        <ImageView
                            id={this.idSet.whiteArrow}
                            height="20"
                            width="20"
                            imageUrl="ic_white_arrow"
                            gravity="right" />
                    </LinearLayout>
                </RelativeLayout>
            </LinearLayout>
        );
    }

    getCards = () => {
        var flag = -1;
        var layout = this.options.map((item, i) => {
            if (item.selected) flag = 0;
            return (
                <LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    background={"#f2f2f2"}
                    orientation="horizontal"
                    root="true"
                    margin="20,8,20,8"
                    padding="16,16,16,16"
                    cornerRadius="5"
                    stroke={item.selected ? "4," + window.__Colors.PRIMARY_ACCENT : null}>

                    <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        onClick={() => { this.handleCardClick(i) }}>

                        <ImageView
                            height="90"
                            width="90"
                            margin="8,8,8,8"
                            layout_gravity="center"
                            circularImageUrl={"0,ic_anonymous"} />

                        <LinearLayout
                            width = "0"
                            weight = "1"
                            margin = "8,8,8,8"
                            height = "wrap_content"
                            orientation = "vertical">

                            <TextView
                                width="wrap_content"
                                height="wrap_content"
                                margin = "0,0,0,16"
                                text={item.role} />

                            <TextView
                                width="wrap_content"
                                height="wrap_content"
                                text={item.desc}/>
                        </LinearLayout>
                    </LinearLayout>
                </LinearLayout>
            );
        });
        if (flag != -1) {
            var cmd = this.set({
                id: this.idSet.continueBtn,
                visibility: "visible"
            });
            cmd += this.set({
                id: this.idSet.scrollViewContainer,
                margin: "0,0,0,80"
            });
            Android.runInUI(cmd, 0);
        }
        return layout;
    }

    onBackPressed = () => {
        var event = { tag: "BACK_RoleSelectionActivityAction", contents: [] };
        window.__runDuiCallback(event);
    }

    afterRender = () => {
        if (JBridge.getFromSharedPrefs("role") != "__failed") {
            this.setAsGuestUser();
        }
        JBridge.animateImageView(this.idSet.whiteArrow + "");
        JBridge.logUserTypeScreenEvent();
    }

    setAsGuestUser = () => {
        window.__loggedInState = "GUEST";
        JBridge.setInSharedPrefs("logged_in", "GUEST");
        utils.setLoginPreferences();
        var event = { tag: "OPEN_MainActivity_RoleSelection", contents: [] };
        window.__runDuiCallback(event);
    }

    render() {
        this.layout = (
            <RelativeLayout
                root="true"
                width="match_parent"
                height="match_parent"
                clickable="true"
                background={window.__Colors.WHITE}
                orientation="vertical">

                <LinearLayout
                    width = "match_parent"
                    height = "wrap_content"
                    orientation = "vertical"
                    gravity="center">

                    <SimpleToolbar
                        title=""
                        width="match_parent"
                        height="wrap_content"
                        onBackPress={this.onBackPressed} />

                    <ScrollView
                        height="0"
                        weight="1"
                        width="match_parent"
                        id={this.idSet.scrollViewContainer}>

                        <LinearLayout
                            width = "match_parent"
                            height = "wrap_content"
                            orientation = "vertical"
                            gravity="center">

                            <TextView
                                width="wrap_content"
                                height="wrap_content"
                                text={window.__S.ROLE_SELECTOR_QUERY}
                                textSize="16"
                                fontStyle={Font.fontStyle.SEMIBOLD}
                                margin="0,16,0,16" />
                            <LinearLayout
                                id = {this.idSet.cardsContainer}
                                width = "match_parent"
                                height = "wrap_content"
                                orientation="vertical"
                                gravity="center">
                                {this.getCards()}
                            </LinearLayout>
                        </LinearLayout>
                    </ScrollView>
                </LinearLayout>
                {this.getContinueBtn()}
            </RelativeLayout>
        );

        return this.layout.render();
    }
}

module.exports = Connector(RoleSelectionActivity);
