const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var Button = require("./Button")
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var Styles = require("../../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var _this;

class ForceUpgradePopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'parentContainer'
    ]);
    window.__ForceUpgradePopup = this;
    this.isVisible=false;
  }

  afterRender = () => {
  }

  show = () => {
    Android.runInUI(this.set({
      id: this.idSet.parentContainer,
      visibility: "visible"
    }), null);
  }

  hide = () => {
    Android.runInUI(this.set({
      id: this.idSet.parentContainer,
      visibility: "gone"
    }), null);
  }

  onUpgrade = () => {
    JBridge.updateApp();
  }

  render() {

    this.layout = (
      <LinearLayout
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        afterRender={this.afterRender}
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical"
        clickable="true">

          <LinearLayout
            height="0"
            width="match_parent"
            weight="1"/>

          <LinearLayout
            height="200"
            width="match_parent"
            background="#ffffff"
            margin="30, 0, 30, 0"
            gravity="center"
            orientation="vertical">

            <TextView
              height="wrap_content"
              width="wrap_content"
              margin="0,0,0,16"
              text={window.__S.UPGRADE_APP}/>

            <Button
              height="wrap_content"
              width="wrap_content"
              text={window.__S.UPGRADE}
              margin="16, 0, 16, 0"
              onClick={this.onUpgrade} />
          </LinearLayout>

          <LinearLayout
            height="0"
            width="match_parent"
            weight="1"/>
      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ForceUpgradePopup;
