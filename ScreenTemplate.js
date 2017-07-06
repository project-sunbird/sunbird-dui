var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var ListView = require("@juspay/mystique-backend").androidViews.ListView;

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
