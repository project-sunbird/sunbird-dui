var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");

class LineSpacer extends View {
    constructor(props, children, state) {
        super(props, children, state);
    }

    render() {
        this.layout = (
            <LinearLayout
                height={this.props.height ? this.props.height : "6"}
                orientation={this.props.width ? this.props.width : "vertical"}
                width="match_parent"
                background={window.__Colors.WHITE_F2} />
        );

        return this.layout.render();
    }
}

module.exports = LineSpacer;