var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

window.R = require("ramda");


var RecommendedContainer = require('../Sunbird/RecommendedContainer');

class HomeComponent extends View {
  constructor(props, children) {
    super(props, children);

  }

  getInfo = () => {

    var layout = (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="wrap_content">

        <TextView
          text= {"Hi " + this.props.data.name + "!"}
          margin="16,86,16,12"
          style={window.__TextStyle.textStyle.TITLE.DARK}
          />

        <TextView
          text= "Just 3 more classes to mastering Organic Chemistry for Std XI"
          margin="16,0,20,8"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}
          />

        <TextView
          text= "Take me there >>"
          margin="16,0,0,87"
          style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
          />

      </LinearLayout>
    )
    return layout;
  }


  render() {


    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">


        {this.getInfo()}

        <RecommendedContainer
        recommendedData = {this.props.recommendedData}
        imageUrls = {this.props.imageUrls}
       />




      </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = HomeComponent;
