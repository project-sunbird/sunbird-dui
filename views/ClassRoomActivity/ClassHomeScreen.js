var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;

var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var ModulesContainer = require('../../components/Sunbird/ModulesContainer');
var ChooseItem = require('../../components/Sunbird/ChooseItem');

var objectAssign = require('object-assign');

window.R = require("ramda");

var CourseInfoItemList = require('../../components/Sunbird/CourseInfoItemList');


class ClassHomeScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CLASS_HOME_SCREEN";

    this.moduleData = ["Button", "TextView", "EditText", "ImageView"];
<<<<<<< HEAD:views/ClassActivity/ClassHomeScreen.js
    this.imageUrls = ["ic_action_overflow","ic_action_close","ic_action_completed","ic_action_overflow"];
  

    this.radioList = [{ title : "Class I"},
                      { title : "Class II"},
                      { title : "Class III"},
                      { title : "Class IV"},
                      { title : "Class V"},
                      { title : "Class VI"},
                      { title : "Class VII"},
                      { title : "Class VIII"},
                      { title : "Class IX"},
                      { title : "Class X"},
                      { title : "Class XI"},
                      { title : "Class XII"},
                      ]
=======
    this.imageUrls = ["ic_action_overflow", "ic_action_close", "ic_action_completed", "ic_action_overflow"];
>>>>>>> 0b00c9a9666e49ab61be8bb403be510bf0834380:views/ClassRoomActivity/ClassHomeScreen.js
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
        style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
        margin = "0,0,16,0"
        />
       </LinearLayout>
       <LinearLayout
       width = "match_parent"
       height = "wrap_content">
       <ChooseItem
       items = {this.radioList}
       heading  = ""
       />

       </LinearLayout>
      
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ClassHomeScreen);
