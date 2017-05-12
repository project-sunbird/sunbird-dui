var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var objectAssign = require('object-assign');

window.R = require("ramda");

class SplashScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {
    setTimeout(() => {
      window.__runDuiCallback({ action: "showMainFlow" });
    }, 1000);
  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        width="match_parent"
        height="match_parent">
        <LinearLayout
          height="match_parent"
          width="match_parent"
          gravity="center"
          orientation="vertical">

            <ImageView
              height="300"
              width="300"
              layout_gravity="center"
              imageUrl="ic_launcher"/>
            <TextView
              text="Project SUNBIRD"
              margin="20,120,20,20"
              layout_gravity="center"
              height="wrap_content"/>
         </LinearLayout>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreen);
