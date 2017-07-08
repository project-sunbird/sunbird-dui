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

var CourseInProgressContainer = require('../Sunbird/CourseInProgressContainer');
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

    this.handleResponse();
  }


  handleResponse = () => {



    if (this.props.response) {
      console.log("SERVER GAVE RESPONSE")
      this.details = this.props.response.result.response;

      var cardsContent = this.details.sections.map((item) => {
        return (this.getCourseCardLayout(item))
      })
      this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">

            {cardsContent}

          </LinearLayout>)
    } else {
      console.log("SERVER TOLD NULL")
      this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">

            <TextView
              text="Empty Body"
              height="100"
              width="200"
              gravity="center"/>
            
          </LinearLayout>)
    }
  }


  getCourseCardLayout = (item) => {

    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        root="true"
        orientation="vertical">
          {this.getSpaceSeparator()}

                  <CourseContainer
                    title={item.name}
                    data = {item.contents}
                    onCourseClick={this.handleCourseClick}/>


        </LinearLayout>)
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

  handleUserCoursesClick = (content, type) => {
    var tmp = JSON.stringify(content)
    var eventAction = { tag: 'StartEnrolledCourseFlow', contents: { "course": tmp } }
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

                  
                  <CourseInProgressContainer
                    transparent="true"
                    isViewAllExist="true"
                    title="Courses In Progress"
                    onCourseClick={this.handleUserCoursesClick}
                    data = {this.progressData} />
                   

                  {this.cards}

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
    if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Course" }
      window.__runDuiCallback({ tag: "StartSearchFlow", contents: { filterDetails: JSON.stringify(searchDetails) } });
      // window.__runDuiCallback({tag:"StartSearchFlow",contents:{filterDetails:""}});

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
