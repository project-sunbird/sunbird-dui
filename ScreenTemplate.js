
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");

class Screen extends View {
  constructor(props, children, state) {
    super(props, children);
    this.state = state;

    var _this = this;
    setTimeout(() => {
      Android.runInUI(
        _this.animateView(),
        null
      );
    });
  }

  onPop = (type) => {
    var _this = this;
    Android.runInUI(
      _this.animateView(),
      null
    );
  }

  render() {
    this.layout = (
      <LinearLayout
         background="#ffff00"
         root="true"
         width="match_parent" 
         height="match_parent">
          
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(Screen);
