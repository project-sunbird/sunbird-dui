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
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');

var CourseContainer = require('../Sunbird/CourseContainer');
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
    _this = this;

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.menuData = {
      url: [
        { imageUrl: "ic_notification_red" },
        { imageUrl: "ic_action_search" }
      ]
    }

    this.progressData = [{
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Organic Chemistry",
      footerTitle: "30% done",
      footerSubTitle: "(1350) votes",
      actionText: "RESUME",
      isProgress: "true",
    }, {
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Chemical Chemistry",
      footerTitle: "60% done",
      footerSubTitle: "(2350) votes",
      actionText: "RESUME",
      isProgress: "true",
    }];


    this.data = [{
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Organic Chemistry for Std VII",
      footerSubTitle: "(2350) votes",
      stars: "4",
      actionText: "OPEN",
    }, {
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Physics",
      stars: "4",
      footerSubTitle: "Saved on 10 May ‘17",
      actionText: "OPEN"
    }];

  }


  handleCourseClick = (content, type) => {
    //console.log("content is", content);
    //console.log("type is", type);
    //console.log("data is", tmp);

    var tmp = JSON.stringify(content)
    var eventAction = { tag: 'StartCourseInfoFlow', contents: { "course": tmp } }
      //var eventAction = { tag: 'StartEnrolledCourseFlow', contents: { "course": tmp } }


    window.__runDuiCallback(eventAction);


  }


  getBody = () => {
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        id={this.idSet.parentContainer}
        height="match_parent">

          <SimpleToolbar
            title=""
            width="match_parent"
            showMenu="true"
            invert="true" 
            hideBack="true" 
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}/>


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
                    transparent="true"
                    isViewAllExist="true"
                    title="Courses In Progress"
                    onCourseClick={this.handleCourseClick}
                    data = {this.progressData} />
                   

                  {this.getSpaceSeparator()}

                  <CourseContainer
                    title="Popular"
                    data = {this.data}
                    onCourseClick={this.handleCourseClick}/>
                    

                  {this.getSpaceSeparator()}

                  <CourseContainer
                    title="Recommended"
                    data = {this.data}
                    onCourseClick={this.handleCourseClick}/>

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {
      window.__runDuiCallback({ tag: "StartNotificationFlow", contents: [] });
    }
    if(url=="ic_action_search"){
        window.__runDuiCallback({tag:"StartSearchFlow",contents:[]});

    }
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }




  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }

  afterRender() {}


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
