var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var utils = require('../utils/GenericFunctions');
window.R = require("ramda");

class RoleSelectionActivity extends View {

    constructor(props, children, state) {
        super(props, children, state);
        this.setIds([
            "cardsContainer"
        ]);
        this.options = [{
            role: "Teacher",
            selected: true,
            desc: "1. Browse through courses\n2. Find relevant resources\n3. Browse through groups"
        }, {
            role: "Student",
            selected: false,
            desc: "1. Browse through resources"
        }];
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
                height={"48"}
                width={"match_parent"}
                orientation="horizontal"
                gravity="center_vertical"
                background={"#FF0076FE"}
                cornerRadius="4"
                margin={"0,0,0,0"}
                alignParentBottom = "true,-1"
                clickable="true">
                <RelativeLayout
                    height="match_parent"
                    width="match_parent"
                    gravity="center_vertical"
                    onClick={this.changeLang}>
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
        return this.options.map((item, i) => {
            return (
                <LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    background={"#f2f2f2"}
                    orientation="horizontal"
                    root="true"
                    margin="8,8,8,16"
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
                            circularImageUrl={"0," + "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"} />
                        
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
    }

    afterRender = () => {
    }

    render() {
        this.layout = (
            <RelativeLayout
                root="true"
                width="match_parent"
                height="match_parent"
                background={window.__Colors.WHITE}
                orientation="vertical">
            
                <LinearLayout
                    width = "match_parent"
                    height = "wrap_content"
                    orientation = "vertical">
                    <TextView
                        width = "wrap_content"
                        height = "wrap_content"
                        text = "You are a"
                        margin = "0,0,0,16" />
                    <LinearLayout
                        id = {this.idSet.cardsContainer}
                        width = "match_parent"
                        height = "wrap_content"
                        orientation="vertical"
                        gravity="center">
                        {this.getCards()}
                    </LinearLayout>
                </LinearLayout>
                {this.getContinueBtn()}
            </RelativeLayout>
        );

        return this.layout.render();
    }
}

module.exports = Connector(RoleSelectionActivity);
