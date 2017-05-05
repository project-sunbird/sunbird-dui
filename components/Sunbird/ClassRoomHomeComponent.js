var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var ModulesContainer = require('../../components/Sunbird/ModulesContainer');

var objectAssign = require('object-assign');

window.R = require("ramda");

var CourseInfoItemList = require('../Sunbird/CourseInfoItemList');


class ClassRoomHomeComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CLASS_HOME_SCREEN";

    this.moduleData = ["Button", "TextView", "EditText", "ImageView"];
    this.imageUrls = ["ic_action_overflow", "ic_action_close", "ic_action_completed", "ic_action_overflow"];
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

        <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical">

       <ModulesContainer
        moduleData = {this.moduleData}    
        imageUrls = {this.imageUrls}
       />
       </LinearLayout>

       <LinearLayout
       width = "match_parent"
       height = "wrap_content"
       margin = "16,24,0,0"
       >

       <TextView
        text = "Videos"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />

        <ViewWidget 
        height = "1"
        width = "0"
        weight = "1"/>

       <TextView
        text = "View All"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />
       </LinearLayout>
      
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ClassRoomHomeComponent;
