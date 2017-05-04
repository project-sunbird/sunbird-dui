var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');

window.R = require("ramda");

class ProfileAboutComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_ABOUT_SCREEN"
  }

  afterRender = () => {

  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <TextView
          text="Fully informed about the latest updates in the rules and regulations, our team works closely with you, helping choose the best foreign destination to work in, and preparing a well-presented error-free application."
          height="wrap_content"
          margin="16,12,16,16"
          style={window.__TextStyle.textStyle.HINT.BOLD}/>            
         
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ProfileAboutComponent;
