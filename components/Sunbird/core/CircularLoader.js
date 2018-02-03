var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ProgressBar = require("@juspay/mystique-backend/src/android_views/ProgressBar");

class CircularLoader extends View {
    constructor(props, children, state) {
        super(props, children, state);
        this.width = this.props.width ? this.props.width : "match_parent";
        this.height = this.props.height ? this.props.height : "match_parent";
        this.padding = this.props.padding ? this.props.padding : "0,0,0,0";
        this.margin = this.props.margin ? this.props.margin : "0,0,0,0";
        this.size = this.props.size ? this.props.size : "20";
    }

    render() {
        this.layout = (
            <LinearLayout
                width={this.width}
                height={this.height}
                gravity="center"
                padding={this.padding}
                margin={this.margin}>
                <LinearLayout
                    height={this.size}
                    weight="1"
                    gravity="center" />
                <ProgressBar
                    weight="1"
                    height={this.size}
                    width={this.size}
                    gravity="center" />
                <LinearLayout
                    height={this.size}
                    weight="1"
                    gravity="center" />
            </LinearLayout>
        );

        return this.layout.render();
    }
}

module.exports = CircularLoader;