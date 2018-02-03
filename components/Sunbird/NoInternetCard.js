var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");


class NoInternetCard extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.width = this.props.width ? this.props.width : "match_parent";
        this.height = this.props.height ? this.props.height : "400";
        this.padding = this.props.padding ? this.props.padding : "0,0,0,0";
        this.margin = this.props.margin ? this.props.margin : "0,0,0,0";
        this.weight = this.props.weight ? this.props.weight : null;
    }

    render() {
        this.layout = (
            <LinearLayout
                background={window.__Colors.WHITE}
                height={this.height}
                width={this.width}
                padding={this.padding}
                margin={this.margin}
                weight={this.weight}
                orientation="vertical"
                gravity="center_horizontal"
                clickable="true">

                <ImageView
                    width="100"
                    height="100"
                    margin="0,58,0,0"
                    alpha="0.55"
                    gravity="center_horizontal"
                    imageUrl="ic_no_internet" />

                <TextView
                    width="wrap_content"
                    height="wrap_content"
                    gravity="center_horizontal"
                    alpha="0.55"
                    padding="0,16,0,0"
                    style={window.__TextStyle.textStyle.CARD.HEADING}
                    text={window.__S.ERROR_OFFLINE_MODE} />
            </LinearLayout>
        );

        return this.layout.render();
    }
}

module.exports = NoInternetCard;