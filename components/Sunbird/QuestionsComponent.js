var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require("../../utils/GenericFunctions")
var _this;
var CardComponent = require('../Sunbird/core/CardComponent');
var CarouselCards = require('./CarouselCards');
var CircularLoader = require('../../components/Sunbird/core/CircularLoader');

class Card extends View {
    constructor(props, children) {
        super(props, children);
        this.setIds([
            "card"
        ]);
        this.height = this.props.height ? this.props.height : "106";
        this.width = this.props.width ? this.props.width : "200";
        this.cardData = this.props.data;
        this.id = this.idSet.card; //important feild
    }

    render() {
        var fLayout = "";
        var visibility = "gone";
        if (this.cardData.selected.length == 0) {
            fLayout = (
                <TextView
                    textColor={window.__Colors.PRIMARY_ACCENT}
                    text={this.cardData.option} />
            );
        } else {
            visibility = "visible";
            fLayout = this.cardData.selected.map((item, i) => {
                var appendText = ", ";
                if (i == this.cardData.selected.length - 1) appendText = "";
                return(
                    <TextView
                        textColor={window.__Colors.PRIMARY_ACCENT}
                        text={item + appendText} />
                );
            });
        }
        var layout = (
            <RelativeLayout
                id={this.idSet.card}
                height={this.height}
                width={this.width}
                background="#FFFFFF"
                margin="4,0,4,0"
                padding="8,8,8,8">

                <TextView
                    alignParentTop="true, -1"
                    text={this.cardData.question} />

                <LinearLayout
                    alignParentBottom="true, -1"
                    width="wrap_content"
                    padding="8,8,8,8"
                    onClick={this.props.onClick}>
                    {fLayout}
                    <ImageView 
                        width = "11"
                        height = "11"
                        visibility={visibility}
                        margin = "4,0,0,0"
                        imageUrl= "ic_action_edit_blue" />
                </LinearLayout>
            </RelativeLayout>
        );
        return layout.render();
    }
}


class QuestionsComponent extends View {
    constructor(props, children) {
        super(props, children);
        _this = this;
        this.setIds([
            "parentContainer",
            "scrollViewContainer",
            "footerContainer"
        ]);
        this.cardsArr = window.__questions;
        this.screenWidth = JBridge.getScreenWidth()
        this.cardWidth = this.screenWidth < 300 ? (this.screenWidth - 32) : 300;
        this.cardPadding = Math.floor((this.screenWidth - this.cardWidth) / 2);

        console.log("cardPadding -> ", this.cardPadding);

        this.renderCards = this.cardsArr.map((item, i) => {
            return (
                <Card
                    width={this.cardWidth + ""}
                    data={item}
                    onClick={() => { this.handleCardOptionClick(i, item) }} />
            );
        });

    }

    handleCardOptionClick = (index, item) => {
        console.log("cardOption clicked -> ", item);
        var onChangeCb = (data) => {
            console.log("updated data -> ", data);
            
            window.__questions[index] = data;
            window.__GenericSelectorPopup.hide();

            this.renderCards = this.cardsArr.map((item, i) => {
                return (
                    <Card
                        width={this.cardWidth + ""}
                        data={item}
                        onClick={() => { this.handleCardOptionClick(i, item) }} />
                );
            });
            var nextCardId = "";
            this.cardsArr.map((item, i) => {
                if (nextCardId == "" && item.selected.length == 0) nextCardId = this.renderCards[i].id;
            }); 
            this.Carousel.updateCards(nextCardId, this.renderCards);
        }
        window.__GenericSelectorPopup.show(item, onChangeCb);
    }

    afterRender = () => {
    }

    render() {
        this.Carousel = (
            <CarouselCards
                visibility = {this.props.visibility}
                cardPadding={this.cardPadding + ",0," + this.cardPadding + ",0"}
                cards={this.renderCards} />
        )

        return this.Carousel.render();
    }
}

module.exports = QuestionsComponent;
