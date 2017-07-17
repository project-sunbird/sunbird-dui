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
      "viewallContainer",
      "fetchingHolder"
    ]);
    _this = this;

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" }
      ]
    }


    this.enrolledCourses = []

    window.setEnrolledCourses = this.setEnrolledCourses;
  }


  setEnrolledCourses = (list) => {
    this.enrolledCourses = list;

    window.__UpdateUserCourses(this.enrolledCourses);
  }


  checkIfEnrolled = (identifier) => {
    var enrolled = false;

    this.enrolledCourses.map((item) => {
      console.log("CHECKING", item)
      if (item.identifier === identifier) {
        enrolled = true;
      } else if (item.contentId === identifier) {
        enrolled = true;
      } else if (item.courseId === identifier) {
        enrolled = true;
      }
    })
    return enrolled;
  }




  handleResponse = () => {
      console.log("handleResponse");
      console.log("SERVER GAVE RESPONSE", this.props.response)     
      if(this.props.response===undefined) {
        return;
      }
      console.log("SERVER GAVE RESPONSE", this.props.response)
      this.details = this.props.response.result.response;
      if (!this.details.hasOwnProperty("name")) {
        JBridge.showSnackBar("Error Fetching Data");
        return;
      }

      if(this.details.sections==undefined && this.details.sections.length==0){
          JBridge.showSnackBar("Error Fetching Data");
          return;
      } 

      Android.runInUI(this.set({
        id :this.idSet.fetchingHolder,
        visibility : "gone"
      }),0);
      var emptyBody =(<LinearLayout
                          layoutTransition="true"
                          height="match_parent"
                          width="match_parent"/>)
      this.replaceChild(this.idSet.parentContainer, emptyBody.render(), 0) 

      this.details.sections.map((item,index) => {
          this.appendChild(this.idSet.parentContainer,this.getCourseCardLayout(item).render(),index);
      })


  
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
    var eventAction;
    console.log("CHECKING ->", content.identifier);
    if (this.checkIfEnrolled(content.identifier)) {
      console.log("\n\n\nENROLLED")
      eventAction = { tag: 'StartEnrolledCourseFlow', contents: { "course": tmp } }
    } else {
      console.log("\n\n\nNOT ENROLLED")
      eventAction = { tag: 'StartCourseInfoFlow', contents: { "course": tmp } }
    }


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
        height="match_parent">

          <SimpleToolbar
            title="Courses"
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
                    title="Courses In Progress"
                    onCourseClick={this.handleUserCoursesClick}/>
                   

                  <LinearLayout
                    height="wrap_content"
                    width="match_parent"
                    afterRender={this.handleResponse}
                    id={this.idSet.parentContainer}
                    layoutTransition="true"
                    orientation="vertical"
                    root="true">

                      <TextView
                        id={this.idSet.fetchingHolder}
                        text="Fetching .."
                        height="100"
                        width="200"
                        gravity="center"/>
                      
                    </LinearLayout>

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {
      JBridge.showSnackBar("Comming Soon")
        // window.__runDuiCallback({ tag: "StartNotificationFlow", contents: [] });
    }
    if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Course" }
      window.__runDuiCallback({ tag: "StartSearchFlow", contents: { filterDetails: JSON.stringify(searchDetails) } });

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
