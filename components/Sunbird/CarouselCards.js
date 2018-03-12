var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require("../../utils/GenericFunctions")
var _this;
var CardComponent = require('../Sunbird/core/CardComponent');
var CircularLoader = require('../../components/Sunbird/core/CircularLoader');
const Font = require('../../res/Font');

class CarouselCards extends View {
    constructor(props, children) {
        super(props, children);
        _this = this;
        this.setIds([
            "parentContainer",
            "scrollViewContainer",
            "footerContainer",
            "cardsContainer"
        ]);
        console.log("this.props.cards -> ", this.props.cards);
        
        this.screenWidth = JBridge.getScreenWidth()
        this.cardWidth = this.props.cardWidth ? this.props.cardWidth : this.screenWidth < 300 ? (this.screenWidth - 32) : 300;
        this.cardPadding = this.props.cardPadding ? this.props.cardPadding : Math.floor((this.screenWidth - this.cardWidth) / 2);
        this.cards = this.props.cards ? this.props.cards : [(<LinearLayout />)];
        this.currCardIndex = 0;
        this.totalCards = Array.from('0'.repeat(this.props.totalCards)); //always this.cards.length >= this.totalCards.length

        console.log("cardPadding -> ", this.cardPadding);
        
    }

    getHeader() {
        return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="0,16,0,16"
            orientation="horizontal"
            gravity="center">

            <TextView
                width="wrap_content"
                height="wrap_content"
                textSize="14"
                fontStyle={Font.fontStyle.REGULAR}
                text={"Help us get you content thats relevant to you."}/>
        </LinearLayout>)
    }

    getCards = () => {
        console.log("HSV -> ", this.idSet.scrollViewContainer);
        return (
            <HorizontalScrollView
                width="match_parent"
                height="wrap_content"
                scrollBarX="false"
                margin = "0,0,0,0"
                fillViewport="true"
                id = {this.idSet.scrollViewContainer}>

                <LinearLayout
                    id={this.idSet.parentContainer}
                    width="wrap_content"
                    height="match_parent"
                    orientation="horizontal"
                    padding={this.cardPadding}
                    layoutTransition="true">
                    {this.cards}
                </LinearLayout>
            </HorizontalScrollView>
        );
    }

    getFooter = (pos) => {
        var position = pos ? pos : 0;
        var width = Math.floor(JBridge.getScreenWidth()/2);
        var dots = this.totalCards.map((item, i) => {
            if (i == position){
                this.cards[i] ? this.cards[i].isCurr = true : "";
                return (
                    <LinearLayout
                        height="10"
                        width="10"
                        cornerRadius="5"
                        margin="2,0,2,0"
                        background={"#9B9B9B"} />
                )
            } else {
                this.cards[i] ? this.cards[i].isCurr = false : "";
                return (
                    <LinearLayout
                        height="10"
                        width="10"
                        cornerRadius="5"
                        margin="2,0,2,0"
                        background={"#D8D8D8"} />
                )
            }
        });
        return (
            <LinearLayout
                height = "wrap_content"
                width = "match_parent"
                margin = "0,16,0,16"
                gravity = "center">
                <LinearLayout
                    height="10"
                    width={ width + "" }
                    gravity = "center">
                    {dots}
                </LinearLayout>
            </LinearLayout>
        );
    }

    updateCards = (nextIndex, cards) => {
        console.log("updateCards -> ", nextIndex);
        this.cards = cards ? cards : this.cards;
        this.replaceChild(this.idSet.cardsContainer, this.getCards().render(), null);
        JBridge.addScrollListener(this.idSet.scrollViewContainer, this.getOnScrollStopCb());
        setTimeout(()=>{
            this.snapToCard(nextIndex);
        }, 100); 
    }

    getOnScrollStopCb = () => {
        return callbackMapper.map((data) => {
            console.log("onstop -> ", data);
            var delta = parseInt(data[0]);
            if (delta > 0) {
                var nextCardIndex = (this.currCardIndex + 1) % this.cards.length;
                _this.snapToCard(nextCardIndex);
            } else if (delta < 0) {
                var prevCardIndex = (this.currCardIndex - 1) % this.cards.length;
                _this.snapToCard(prevCardIndex);
            }
        });
    }

    afterRender = () => {
        JBridge.addScrollListener(this.idSet.scrollViewContainer, this.getOnScrollStopCb());
        this.replaceChild(this.idSet.footerContainer, this.getFooter().render(), null);
    }

    snapToCard = (cardIndex) => {
        var index = (cardIndex && cardIndex < this.cards.length && cardIndex >= 0) ? cardIndex : 0;
        index = parseInt(index);
        JBridge.scrollTo(this.idSet.scrollViewContainer, (index * (this.cardWidth + 8)));
        this.currCardIndex = index;
        console.log("scrollTo pixel -> ", index * (this.cardWidth + 8));
        this.replaceChild(this.idSet.footerContainer, this.getFooter(index).render(), null);
        // if (cardId == "") {
        //     this.replaceChild(this.idSet.footerContainer, this.getFooter().render(), null);
        // } else {
        //     this.cards.map((item, i) => {
        //         if (cardId == (item.id + "")) {
        //             console.log("cardId - " + cardId + ", item.id - " + item.id);
        //             JBridge.scrollTo(this.idSet.scrollViewContainer, (i * (this.cardWidth + 8)));
        //             console.log("true pixel -> ", i * (this.cardWidth + 8));
        //             this.replaceChild(this.idSet.footerContainer, this.getFooter(i).render(), null);
        //             return;
        //         }
        //     });
        // }
    }

    render() {
        this.layout = (
            <LinearLayout
                height="200"
                width="match_parent"
                visibility={this.props.visibility ? this.props.visibility : "visible"}
                background={window.__Colors.WHITE_F2}
                orientation="vertical"
                afterRender = {this.afterRender}>

                {this.getHeader()}

                <LinearLayout
                    width = "match_parent"
                    id = {this.idSet.cardsContainer}>
                    {this.getCards()}
                </LinearLayout>

                <LinearLayout
                    id = {this.idSet.footerContainer}
                    height="wrap_content"
                    width="match_parent"
                    gravity="center"
                    margin="0,16,0,16" />
            </LinearLayout>
        )

        return this.layout.render();
    }
}

module.exports = CarouselCards;
