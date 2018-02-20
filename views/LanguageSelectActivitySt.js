var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var utils = require('../utils/GenericFunctions');
window.R = require("ramda");

class LanguageSelectActivitySt extends View {

    constructor(props, children, state) {
        super(props, children, state);
        this.languages = window.__RootScreen.languageMap;
        console.log("Default language -> ", JBridge.getLocalLang());
        this.devicelang = JBridge.getLocalLang();
        this.defaultlang = window.__CurrentLanguage;
        this.setIds([
            "langContainer"
        ]);
        this.langArr = [];
        this.initLangArr();
        this.shouldCacheScreen = false;

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
        //JBridge.setInSharedPrefs("isUserOnboarded", "true");
        var whatToSend = { "profile" : JSON.stringify("{}")}
        var event = { tag: "BACK_LanguageSelectActivitySt", contents: whatToSend }
        window.__runDuiCallback(event);
    }

    onBackPressed = () => {
      var whatToSend = { "profile" : JSON.stringify("{}")}
      var event = { tag: "BACK_LanguageSelectActivitySt", contents: whatToSend }
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
        this.changeLang();
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
                        text={language + (this.devicelang == langCode ? " (" + window.__S.DETECTED + ")": "")}
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

    render() {
        this.layout = (
            <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="horizontal"
                root={true}
                clickable="true">
                <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    orientation="vertical"
                    background={"#FFF8F8F8"}
                    cornerRadius="0">
                    <SimpleToolbar
                      title={window.__S.SELECT_LANGUAGE}
                      afterRender={this.afterRender}
                      width="match_parent"
                      onBackPress={this.onBackPressed}/>
                    <LinearLayout
                        height="wrap_content"
                        width="match_parent"
                        orientation="vertical"
                        padding="16,0,16,16"
                        margin="0,0,0,0"
                        background={"#FFFFFFFF"}
                        id={this.idSet.langContainer}
                        cornerRadius="0">

                            {this.getLanguageLabels()}

                    </LinearLayout>
                </LinearLayout>
            </LinearLayout>
        );

        return this.layout.render();
    }
}

module.exports = Connector(LanguageSelectActivitySt);
