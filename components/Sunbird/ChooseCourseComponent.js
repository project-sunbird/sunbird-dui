var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var CollapsingToolbarLayout = require('@juspay/mystique-backend').androidViews.CollapsingToolbarLayout;
var AppBarLayout = require('@juspay/mystique-backend').androidViews.AppBarLayout;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var objectAssign = require('object-assign');

window.R = require("ramda");

var CourseInfoItemList = require('../Sunbird/CourseInfoItemList');


class ChooseCourseComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.setIds([
      "collapsingToolbar",
    
    ]);
    this.screenName = "CHOOSE_COURSE"
    this.state = state;
    
    console.log("GOT SSTATE", this.state);
    
  }

  afterRender = () => {

  }

  handleItemSelect = (data) => {
    console.log("window.__runDuiCallback( --->showCourseInfo)");
    window.__runDuiCallback({ action: "showCourseInfo" , type: "completed"});
  }

  handleExploreClick = () =>{
    console.log("explore clicked");
    window.__runDuiCallback({ action: "showExplore" });
  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <AppBarLayout
          height="170"
          width="match_parent"
          padding="16,16,16,16"
          fillViewPort="true"
          background="#2D61FF">
          <LinearLayout
            width="match_parent"
            height="wrap_content"
          >
          <LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="2,24,24,0"
            >
            <Space
              width="0"
              weight="1"/>
          <ImageView
                height="18"
                width="18"
                
                imageUrl= "ic_explore"
                onClick={this.handleExploreClick}
              />

                  <TextView
                    text="Explore"
                    height="wrap_content"
                    margin="4,0,0,0"
                    style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                    onClick={this.handleExploreClick}
                    />
          </LinearLayout>
          </LinearLayout>
                  <TextView
                    text="Your learning Tracks"
                    height="wrap_content"
                    margin="0,56,0,8"
                    style={window.__TextStyle.textStyle.HEADING.LIGHT}/>


           </AppBarLayout>

        <ScrollView
          height="match_parent"
          width="match_parent"
          fillViewPort="true">
          <LinearLayout
            height="match_parent"
            width="match_parent"
            background="#2D61FF"
            padding="20,20,20,20"
            orientation="vertical">

            <CourseInfoItemList
              onItemSelected={this.handleItemSelect}
              height="match_parent"
              width="match_parent"/>

            </LinearLayout>


         </ScrollView>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ChooseCourseComponent;
