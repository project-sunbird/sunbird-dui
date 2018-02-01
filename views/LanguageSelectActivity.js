
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var utils = require('../utils/GenericFunctions');
window.R = require("ramda");

class LanguageSelectActivity extends View {

    constructor(props, children, state) {
        super(props, children, state);
        this.languages = window.__RootScreen.languageMap;
        console.log("Default language -> ", JBridge.getLocalLang());
        this.defaultlang = JBridge.getLocalLang();
        this.setIds([
            "langContainer"
        ]);
        this.langArr = [];
        this.initLangArr();
    }

    initLangArr = () => {
        var i = 0;
        for (var property in this.languages) {
            if (this.languages.hasOwnProperty(property)) {
                this.langArr[i] = {
                    langCode: this.languages[property],
                    lang: property,
                    isSelected: (this.languages[property] == this.defaultlang ? true : false)
                };
                i++;
            }
        };
    }

    afterRender = () => {
    }

    changeLang = () => {
        this.langArr.map((item) => {
            if (item.isSelected) {
                window.__RootScreen.handleChangeLang(item.langCode);
            }
        });
        JBridge.setInSharedPrefs("isUserOnboarded", "true");
        var event = { tag: "OPEN_UserActivity_1", contents: [] }
        window.__runDuiCallback(event);
    }

    changeSelectedLang = (langCode) => {
        var newArr = [];
        this.langArr.map((item, i) => {
            newArr[i] = {};
            newArr[i].langCode = this.langArr[i].langCode;
            newArr[i].lang = this.langArr[i].lang;
            newArr[i].isSelected = this.langArr[i].isSelected;
            if (item.langCode == langCode) {
                newArr[i].isSelected = true;
            } else {
                newArr[i].isSelected = false;
            }
        });
        this.langArr = newArr;
        this.reRenderLang();
    }

    reRenderLang = () => {
        var layout = (
            <LinearLayout
                height="wrap_content"
                width="match_parent"
                orientation="vertical"
                background={"#FFF8F8F8"}
                cornerRadius="0">

                {this.getLanguageLabels()}

            </LinearLayout>
        );
        this.replaceChild(this.idSet.langContainer, layout.render(), 0);
    }

    getLanguageLabels = () => {
        console.log("getLanguageLabels -> ", this.langArr);
        
        var size = this.langArr.length;
        return this.langArr.map((item, i) => {
            return this.getLabels(item.lang, item.langCode, item.isSelected, (size - 1 - i)==0 );
        });
    }

    getLabels = (language, langCode, isSelected, isLast) => {
        console.log("label -> " + language, isSelected);
        
        return (
            <LinearLayout
                height="36"
                width="match_parent"
                orientation="vertical"
                margin={"0,16,0,0"}
                clickable="true"
                onClick={() => this.changeSelectedLang(langCode)}>
                <LinearLayout
                    height="22"
                    width="match_parent"
                    orientation="horizontal"
                    gravity="center_vertical"
                    margin="2,0,0,0"
                    weight="1">
                    <TextView
                        height="20"
                        weight="2"
                        text={language + (this.defaultlang == langCode ? " (" + window.__S.DETECTED + ")": "")}
                        gravity="left" />
                    <LinearLayout
                        weight="1" />
                    <ImageView
                        height="15"
                        width="13"
                        imageUrl="ic_blue_tick"
                        visibility={isSelected ? "visible" : "gone"} />
                </LinearLayout>
                <LinearLayout
                    visibility = {isLast ? "gone" : "visible"}
                    height="1"
                    width="match_parent"
                    background={"#979797"}
                    stroke="1,#979797"
                    margin="0,15,3,0"
                    alpha = "0.3"
                    cornerRadius="0" />
            </LinearLayout>
        );
    }

    getContinueBtn = () => {
        return (
            <LinearLayout
                height={"38"}
                width={"match_parent"}
                orientation="horizontal"
                gravity="center_vertical"
                background={"#FF0076FE"}
                stroke="1,#0076fe"
                cornerRadius="4"
                margin={"0,0,0,0"}
                clickable="true">
                <RelativeLayout
                    height="match_parent"
                    width="match_parent"
                    gravity="center_vertical"
                    onClick={this.changeLang}>
                    <TextView
                        width="match_parent"
                        text={ window.__S.CONTINUE }
                        textSize={"12"}
                        color={"#FFFFFFFF"}
                        gravity="center" />
                    <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        padding="0,0,16,0"
                        gravity="right">
                        <ImageView
                            height="20"
                            width="20"
                            imageUrl="ic_white_arrow"
                            gravity="right" />
                    </LinearLayout>
                </RelativeLayout>
            </LinearLayout>
        );
    }

    render() {
        this.layout = (
            <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="horizontal"
                gravity="center"
                root={true}
                clickable="true">
                <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    orientation="vertical"
                    gravity="center_horizontal"
                    padding="20,58,20,16"
                    background={"#FFFFFFFF"}
                    cornerRadius="0">
                    <TextView
                        height="22"
                        width="253"
                        margin="34,0,33,0"
                        text={window.__S.CHOOSE_LANGUAGE}
                        textSize={"16"}
                        color={"#FF333333"}
                        gravity="center" />
                    <LinearLayout
                        height="wrap_content"
                        width="match_parent"
                        orientation="vertical"
                        padding="16,16,16,16"
                        margin="0,18,0,0"
                        background={"#FFF8F8F8"}
                        id={this.idSet.langContainer}
                        cornerRadius="0">
                        
                            {this.getLanguageLabels()}
                        
                    </LinearLayout>
                    <LinearLayout
                        weight="1"/>
                    {this.getContinueBtn()}
                </LinearLayout>
            </LinearLayout>
        );

        return this.layout.render();
    }
}

module.exports = Connector(LanguageSelectActivity);
