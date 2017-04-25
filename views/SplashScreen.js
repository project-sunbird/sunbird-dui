var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var Button = require('../components/HPCL/Button');
var FormField = require('../components/HPCL/FormFields');
var Progress = require('@juspay/mystique-backend').androidViews.ProgressBar;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var objectAssign = require('object-assign');

window.R = require("ramda");

class SplashScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
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
          text="ABCDF"
          margin="20,120,20,20"
          layout_gravity="center"
          height="wrap_content"/>
         
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreen);
