var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var objectAssign = require('object-assign');

window.R = require("ramda");

var CourseInfoItemList = require('../../components/Sunbird/CourseInfoItemList');


class ClassHomeScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CLASS_HOME_SCREEN";
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
              text="Your learning Tracks"
              height="wrap_content"
              margin="0,0,0,24"
              style={window.__TextStyle.textStyle.HEADING.LIGHT}/> 
           
           
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ClassHomeScreen);
