var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');

window.R = require("ramda");

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var Space = require('@juspay/mystique-backend').androidViews.Space;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;

var HomeComponent = require('../../components/Sunbird/HomeComponent');


class ClassTestScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CLASS_TEST_SCREEN"

    this.menuData={
      url:[
      {imageUrl: "ic_action_search", title: "sample"}
      ]
    }

    this.data={
      name: "Vinay"
    }
    this.recommendedData = ["Organic Chemistry for Standard VII", "Molecular Reactions for Beginners", "Intermediate Metallurgy", "ImageView"];
    this.imageUrls = ["ic_account", "ic_action_close", "ic_action_completed", "ic_account"];

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

        <SimpleToolbar
            width="match_parent"
            showMenu="true"
            invert="true"
            menuData={this.menuData}
            hideBack="true"
            />

        <HomeComponent
          recommendedData={this.recommendedData}
          imageUrls={this.imageUrls}
          data={this.data}
          />




      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ClassTestScreen);
