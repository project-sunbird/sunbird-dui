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
const Font = require('../../res/Font');

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
                    text={this.cardData.option}
                    style={window.__TextStyle.textStyle.TABBAR.SELECTED} />
            );
        } else {
            visibility = "visible";
            var dispText = this.cardData.selected.map((item, i) => {
                return item;
            });
            dispText = dispText.splice(0, 2).join(", ");
            dispText = dispText + (this.cardData.selected.length > 2 ? "..." : "");
            
            fLayout = (
                <TextView
                    textSize="14"
                    text={dispText} />
            );
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
                    margin = "8,8,0,0"
                    textSize = "14"
                    fontStyle={Font.fontStyle.REGULAR}
                    alignParentTop="true, -1"
                    text={this.cardData.question} />

                <LinearLayout
                    alignParentBottom="true, -1"
                    width="wrap_content"
                    padding="8,8,8,8"
                    onClick={this.props.onClick}
                    gravity = "center_vertical">
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
            "footerContainer",
            "progressContainer"
        ]);
        this.cardsArr = [];
        if (window.__questions.length == 0) {
            this.getNextQuestion();
        } else {
            this.cardsArr = window.__questions;
        }
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
        window.__GenericSelectorPopup.show(item, (data) => {
            return this.onCardAnswered(index, data);
        });
    }

    onCardAnswered = (index, data) => {
        console.log("updated data -> ", data);

        window.__questions[index] = data;
        window.__GenericSelectorPopup.hide();

        this.getNextQuestion();
        this.updateToCurrentState();
    }
    
    getNextQuestion = () => {
        var ele = window.__allQs.pop();
        if (ele) {
            window.__questions.push(ele);
            this.cardsArr = window.__questions;
        }
        this.renderCards = this.cardsArr.map((item, i) => {
            return (
                <Card
                    width={this.cardWidth + ""}
                    data={item}
                    onClick={() => { this.handleCardOptionClick(i, item) }} />
            );
        });
        console.log("window.__allQs -> ", window.__allQs);
        console.log("this.cardsArr -> ", this.cardsArr);        
    }

    getProgress = (pStatus) => {
        var completedProgress = pStatus;
        var remainingProgress = (100 - parseInt(pStatus)) + "";
        console.log("getProgress -> ", pStatus);
        return (
            <LinearLayout
                width="match_parent"
                height="5"
                orientation="horizontal"
                root="true">
                <LinearLayout
                    width="0"
                    height="5"
                    background={completedProgress == "100" ? window.__Colors.SUCCESS_GREEN : window.__Colors.LIGHT_BLUE}
                    weight={completedProgress} />
                <LinearLayout
                    width="0"
                    background={window.__Colors.PRIMARY_BLACK_22}
                    height="5"
                    weight={remainingProgress} />
            </LinearLayout>
        );
    }

    updateToCurrentState = () => {
        var nextCardIndex = undefined;
        var completed = 0;
        this.cardsArr.map((item, i) => {
            if (item.selected.length == 0) {
                if (nextCardIndex == undefined) nextCardIndex = i;
            } else {
                completed += 1;
            }
        });
        console.log("Completed -> ", completed);
        console.log("nextCardIndex -> ", nextCardIndex);

        this.Carousel.updateCards(nextCardIndex, this.renderCards);
        this.replaceChild(this.idSet.progressContainer, this.getProgress(Math.floor(completed / window.__total_questions * 100)).render(), 0);
    }

    afterRender = () => {
        this.updateToCurrentState();
    }

    render() {
        var flag = 0;
        window.__questions.map((item) => {
            if(item.selected.length == 0) flag = 1;
        });
        // var visibility = flag == 0 ? "gone" : "visible";
        //TODO remove when integrating with content framework
        var visibility = "visible;"
        this.Carousel = (
            <CarouselCards
                visibility = {this.props.visibility}
                cardPadding={this.cardPadding + ",0," + this.cardPadding + ",0"}
                cards={this.renderCards}
                totalCards={window.__total_questions}
                background={window.__Colors.WHITE_F2}
                header="Help us get you content thats relevant to you." />
        );

        var layout = (
            <LinearLayout
                width = "match_parent"
                height = "wrap_content"
                orientation = "vertical"
                visibility={this.props.visibility == "visible" ? visibility : "gone"}
                afterRender = {this.afterRender}>

                <LinearLayout
                    width = "match_parent"
                    height = "wrap_content"
                    id = {this.idSet.progressContainer}>
                    {this.getProgress(0)}
                </LinearLayout>

                {this.Carousel}
            </LinearLayout>
        );

        return layout.render();
    }
}

module.exports = QuestionsComponent;
