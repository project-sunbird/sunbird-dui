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

class ChooseCourseScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CHOOSE_COURSE"
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

        <ScrollView 
          height="match_parent"
          width="match_parent"
          fillViewPort="true">
          <LinearLayout
            height="match_parent"
            width="match_parent"
            background="#2D61FF"
            padding="20,170,20,20"
            orientation="vertical">
            <TextView
              text="Your learning Tracks"
              height="wrap_content"
              margin="0,0,0,24"
              style={window.__TextStyle.textStyle.HEADING.LIGHT}/> 
           
            <CourseInfoItemList
              height="match_parent"
              width="match_parent"/>
           
            </LinearLayout>
              

         </ScrollView>   
         
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ChooseCourseScreen);
