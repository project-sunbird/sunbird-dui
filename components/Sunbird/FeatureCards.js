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
        var layout = (
            <RelativeLayout
                id={this.idSet.card}
                height={this.height}
                width={this.width}
                background="#FFFFFF"
                margin="0,0,0,0"
                gravity="center"
                padding="24,0,24,0">

                <LinearLayout
                    height = "match_parent"
                    width="match_parent"
                    gravity="center_horizontal"
                    orientation = "vertical">

                    <LinearLayout
                        width = "match_parent"
                        height="0"
                        weight = "1"
                        gravity="center">
                        <TextView
                            width="wrap_content"
                            margin="0,32,0,24"
                            textSize="16"
                            fontStyle={Font.fontStyle.SEMIBOLD}
                            text={this.cardData.heading} />
                    </LinearLayout>

                    <LinearLayout
                        height= "wrap_content"
                        width="match_parent"
                        padding="0,8,0,8"
                        gravity="center">
                        <ImageView
                            width="match_parent"
                            height="match_parent"
                            margin="0,0,0,0"
                            imageUrl={this.cardData.illustration} />
                    </LinearLayout>

                    <LinearLayout
                        width="match_parent"
                        height="0"
                        weight="1"
                        gravity="center">
                        <TextView
                            gravity="center"
                            width="wrap_content"
                            margin="0,24,0,0"
                            padding="24,0,24,0"
                            textSize="14"
                            fontStyle={Font.fontStyle.REGULAR}
                            text={this.cardData.desc} />
                    </LinearLayout>
                </LinearLayout>
            </RelativeLayout>
        );
        return layout.render();
    }
}


class FeatureCards extends View {
    constructor(props, children) {
        super(props, children);
        _this = this;
        this.setIds([
            "parentContainer",
            "scrollViewContainer",
            "footerContainer",
            "progressContainer"
        ]);
        this.cardsArr = [
            {
                heading: "Get Content On-the-Go",
                illustration: "ic_content_otg",
                desc: "Browse and consume content from our growing collection of free courses and resources."
            }, {
                heading: "Scan QR Codes for Quick Access",
                illustration: "ic_scan_qr",
                desc: "Scan QR Codes using the Sunbird app to quickly get access to related content and resources."
            }, {
                heading: "Connect with Peers and Experts",
                illustration: "ic_connect_with_peers",
                desc: "Join communities and speak to peers and experts. Learn and share your knowledge."
            }
        ];
        this.cardWidth = JBridge.getScreenWidth();
        this.cardHeight = JBridge.getScreenHeight() - 200;
        this.cardPadding = Math.floor((this.screenWidth - this.cardWidth) / 2);

        console.log("cardPadding -> ", this.cardPadding);

        this.renderCards = this.cardsArr.map((item, i) => {
            return (
                <Card
                    height={this.cardHeight + ""}
                    width={this.cardWidth + ""}
                    data={item} />
            );
        });

    }

    afterRender = () => {
    }

    render() {
        var visibility = "visible;"
        this.Carousel = (
            <CarouselCards
                height="match_parent"
                cardPadding={"0,0,0,0"}
                cards={this.renderCards}
                cardWidth={this.cardWidth}
                totalCards={this.cardsArr.length} />
        );
        return this.Carousel.render();
    }
}

module.exports = FeatureCards;
