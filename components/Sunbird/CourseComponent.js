var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var SearchToolbar = require('../Sunbird/core/SearchToolbar');
var CourseContainer = require('../Sunbird/CourseContainer');
var CommunityViewallList = require('../Sunbird/CommunityViewallList');
var CommunityInfoComponent = require('../Sunbird/CommunityInfoComponent');
var _this;
class CourseComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer"
    ]);
    _this=this;

    this.myCommunitySelected="";
    this.popularCommunitySelected="";
    this.recommendedCommunitySelected="";

    this.menuData = {
      url: [
        { imageUrl: "ic_notification_red" },
        { imageUrl: "ic_action_search"}
      ]
    }
  }


  getBody = () =>{
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        id={this.idSet.parentContainer}
        height="match_parent">

          <SearchToolbar
            hint="Enter your search"
            invert="true"
            hideBack="true"
            title="Explore courses"
            onMenuItemClick={this.handleMenuClick}
            menuData={this.menuData}
            onSearch={this.handleSearch}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  background={window.__Colors.WHITE}
                  orientation="vertical">

                  
                  <CourseContainer
                    title="New"/>

                  {this.getSpaceSeparator()}

                  <CourseContainer
                    title="Popular"/>

                  {this.getSpaceSeparator()}

                  <CourseContainer
                    title="Recommended"/>

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
      )
  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if(url=="ic_notification_red"){
        window.__runDuiCallback({tag:"StartNotificationFlow",contents:[]});
    }
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }

  

  
  getSpaceSeparator = () =>{
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }

  afterRender(){
  }


  render() {
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        height="match_parent">

        {this.getBody()}
        

        </LinearLayout>
    )

    return this.layout.render();
  }
}



module.exports = CourseComponent;
