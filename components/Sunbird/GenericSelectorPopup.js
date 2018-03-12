var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var RadioButton = require("./core/RadioButton");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var PageOption = require("./core/PageOption");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require("../../utils/GenericFunctions")
var _this;
var FeatureButton = require("../../components/Sunbird/FeatureButton");
var CardComponent = require('../Sunbird/core/CardComponent');
var CircularLoader = require('../../components/Sunbird/core/CircularLoader');

class GenericSelectorPopup extends View {
    constructor(props, children) {
        super(props, children);
        this.setIds([
            "parentContainer",
            "bodyContainer"
        ]);

        this.data = {};
        this.onChange;
        window.__GenericSelectorPopup = this;
    }

    afterRender = () => {
    }

    show = (data, onChangeCb) => {
        this.data = data;
        this.onChangeCb = onChangeCb;
        this.replaceChild(this.idSet.bodyContainer, this.getBody().render(), null);
        this.setVisibility("visible");
    }

    hide = () => {
        this.data = {};
        this.onChangeCb = undefined;
        this.setVisibility("gone");
    }

    setVisibility = (data) => {
        var cmd = this.set({
            id: this.idSet.parentContainer,
            visibility: data
        });
        Android.runInUI(cmd, 0);
    }

    handleDismissClick = () => {
        this.hide();
    }

    checkSelected = (item, list) => {
        if (list.indexOf(item) > -1){
            return true;
        }
        return false;
    }

    onConfirm = () => {
        this.onChangeCb(this.data);
    }

    handleCheckBoxValueChange = (item, value) => {
        console.log("checkbox -> " + item + " " + value);
        if (value == "true") {
            if (this.data.selected.indexOf(item) == -1) this.data.selected.push(item);
        } else {
            this.data.selected = this.removeFromArr(this.data.selected, item);
        }
        console.log("handleCheckBoxValueChange -> ", this.data);
        
    }

    handleRadioButtonClick = () => {
        if (window.__RadioButton != undefined && window.__RadioButton.hasOwnProperty("currentIndex")) {
            console.log("radio -> ", window.__RadioButton.currentIndex);
            this.data.selected = [this.data.values[window.__RadioButton.currentIndex]];
        }
    }

    removeFromArr = (array, element) => {
        return array.filter(e => e !== element);
    }

    getHeader = () => {
        return (
            <LinearLayout
                width="match_parent"
                height="wrap_content"
                gravity="center_vertical"
                margin="16,0,16,16">

                <TextView
                    width="wrap_content"
                    height="wrap_content"
                    gravity="center_vertical"
                    text={this.data.question}
                    style={window.__TextStyle.textStyle.CARD.TITLE.DARK} />

                <ViewWidget
                    width="0"
                    weight="1"
                    height="0" />

                <ImageView
                    width="18"
                    height="18"
                    onClick={this.handleDismissClick}
                    gravity="center_vertical"
                    imageUrl="ic_action_close" />

            </LinearLayout>
        )
    }

    getBody = () => {
        return (<LinearLayout
            cornerRadius="2"
            width="match_parent"
            height={Math.floor(JBridge.getScreenHeight() * 0.6) + ""}
            root="true"
            visibility="visible"
            orientation="vertical"
            clickable="true"
            padding="0,18,0,0"
            background="#ffffff">

            {this.getHeader()}

            {this.getContent()}
        </LinearLayout>)
    }

    getFeatureButton = () => {
        var cancelBtnState = {
            text: window.__S.CANCEL.toUpperCase(),
            isClickable: "true",
            onClick: this.hide,
            visibility: "visible",
        };
        var applyBtnState = {
            text: window.__S.SAVE.toUpperCase(),
            isClickable: "true",
            onClick: this.onConfirm,
            visibility: "visible",
        };
        var buttonList = [cancelBtnState, applyBtnState];
        return (<LinearLayout
            height="wrap_content"
            width="match_parent"
            alignParentBottom="true, -1">

            <PageOption
                width="match_parent"
                buttonItems={buttonList}
                hideDivider={false}
                onButtonClick={this.handlePageOption} />
        </LinearLayout>
        );
    }

    getCheckboxes = () => {
        var checkBoxes = this.data.values.map((item, index) => {
            return (<CheckBox
                onCheckChange={(value) => { this.handleCheckBoxValueChange(item, value) }}
                checked={this.checkSelected(item, this.data.selected)}
                text={item}
                index={index} />)
        });
        this.totalBar = (
            <LinearLayout
                orientation="vertical"
                width="match_parent"
                root="true"
                margin="8,0,16,0"
                height="match_parent">
                    {checkBoxes}
            </LinearLayout>
        )

        return this.totalBar;
    }

    getRadioBtns = () => {
        var leftBar = [];
        leftBar = this.data.values.map((item, index) => {
            var op = this.checkSelected(item, this.data.selected) ? "1" : "0";
            return { name: item, select: op, icon: "ic_action_radio" };
        });
        console.log("radio btns -> ", leftBar);
        
        this.totalBar = (
            <LinearLayout
                orientation="horizontal"
                width="match_parent"
                height="wrap_content"
                margin="16,0,16,0">
                <RadioButton
                    orientation="vertical"
                    height="wrap_content"
                    width="match_parent"
                    gravity="center_vertical"
                    items={leftBar}
                    onClick={this.handleRadioButtonClick} />
            </LinearLayout>
        )

        return this.totalBar;
    }

    getContent = () => {
        var layouts = (<LinearLayout />);
        switch (this.data.selectorType) {
            case "checkbox":
                layouts = this.getCheckboxes();
                break;
            case "radio":
                layouts = this.getRadioBtns();
                break;
            case "selector":
                break;
        }

        return (<RelativeLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical">

            <ScrollView
                height="match_parent"
                width="match_parent"
                margin = "0,0,0,90">

                {layouts}
            </ScrollView>
            {this.getFeatureButton()}
        </RelativeLayout>);
    }

    render() {
        this.layout = (
            <LinearLayout
                height="match_parent"
                width="match_parent"
                id={this.idSet.parentContainer}
                visibility="gone"
                afterRender={this.afterRender}
                root="true"
                background={window.__Colors.PRIMARY_BLACK_44}
                orientation="vertical">

                <LinearLayout
                    height="0"
                    width="match_parent"
                    onClick={this.handleDismissClick}
                    weight="1" />

                <LinearLayout
                    id = {this.idSet.bodyContainer}
                    width = "match_parent"/>
            </LinearLayout>
        )

        return this.layout.render();
    }
}

module.exports = GenericSelectorPopup;
