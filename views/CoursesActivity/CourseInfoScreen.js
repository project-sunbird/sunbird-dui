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

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var CourseCurriculum = require('../../components/Sunbird/CourseCurriculum');

class CourseInfoScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "COURSE_INFO_SCREEN"
  }

  afterRender = () => {

  }

  handleItemSelect = (data) => {
    console.log("CLICKED :", data);
  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title="Arithematic-Advanced"
          width="match_parent"
          showMenu="true"/>

        <ScrollView 
          height="match_parent"
          width="match_parent"
          padding="16,24,16,16"
          fillViewPort="true">
          <LinearLayout
            height="match_parent"
            width="match_parent"
           
            orientation="vertical">

            <CropParagraph
              height="wrap_content"
              margin="0,0,0,24"
              width="match_parent"
              headText={"About the course"}
              contentText={"This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced. This is the course description, which will be created by someone who has advanced"}
              />

             <CourseCurriculum 
              height="match_parent"
              width="match_parent"/> 


           
           
            </LinearLayout>
              

         </ScrollView>   
         
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseInfoScreen);
