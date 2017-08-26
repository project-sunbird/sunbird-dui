var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var CourseInProgressContainer = require('../../components/Sunbird/CourseInProgressContainer');



window.R = require("ramda");


var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');



var HomeRecommendedContainer = require('../../components/Sunbird/HomeRecommendedContainer');
var HomeTodoContainer = require('../../components/Sunbird/HomeTodoContainer');


class HomeFragment extends View {
  constructor(props, children) {
    super(props, children);


    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" },
      ]
    }

    window.setEnrolledCourses = this.setEnrolledCourses;

  }


  setEnrolledCourses = (list) => {
    this.enrolledCourses = list;

    window.__UpdateUserCourses(this.enrolledCourses);
  }




  handleTodoClick = (index) => {
    console.log("Todo Clicked index is ", index);
  }

  handleViewAllTodoClick = () => {
    console.log("View All todos in home");
  }
  handleUserCoursesClick = (content, type) => {
    var whatToSend = { "course": JSON.stringify(content) }
    var event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    window.__runDuiCallback(event);
  }




  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {

    }
    if (url == "ic_action_search") {

      var searchDetails = { filterDetails: "", searchType: "Combined" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      window.__runDuiCallback(event);
    }
  }


  handleSearch = (data) => {
    console.log("searched", data);
  }

  handleAnswerClick = () => {
    console.log("answer clicked")
  }

  handleVoteClick = () => {
    console.log("vote clicked")
  }

  handleBookmarkClick = () => {
    console.log("bookmark clicked")
  }

  handleAnswerClick = () => {
    console.log("answer clicked")
  }

  handleVoteClick = () => {
    console.log("vote clicked")
  }

  handleBookmarkClick = () => {
    console.log("bookmark clicked")
  }

  handleResourceOpen = (data) => {
    console.log("resourceDetails");
    var whatToSend={ "resourceDetails": "nothing" }
    var event ={ tag: "OPEN_ResourceDetailActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleCourseOpen = (data) => {
    var whatToSend = { "course": "something" }
    var event = { tag: "OPEN_CourseInfoActivity", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleRecommendedClick = (content) => {
    console.log("Recommended clicked :", content.downloadUrl)



  }
  getLocalData = (data) => {
    console.log("data from android ", JSON.parse(data));
  }

  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }



  render() {
    var imgUrl = "ic_launcher";
    if (JBridge.getFromSharedPrefs("logo_url") != "__failed" && JBridge.getFromSharedPrefs("logo_file_path") != "__failed"){
      imgUrl = "file://" + JBridge.getFromSharedPrefs("logo_file_path");
    }
    this.layout = (

      <LinearLayout
        orientation="vertical"
        width="match_parent"
        root="true"
        height="match_parent">


         <SimpleToolbar
            title=""
            width="match_parent"
            showMenu="true"
            logo={imgUrl}
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
                  orientation="vertical">


                   <CourseInProgressContainer
                    transparent="true"
                    title={window.__S.TO_DO}
                    onCourseClick={this.handleUserCoursesClick}/>


                   {this.getSpaceSeparator()}

                    <HomeRecommendedContainer
                         title= {window.__S.RECOMMENDED}
                         onCourseOpenClick = {this.handleCourseOpen}
                         onResourceOpenClick = {this.handleResourceOpen}/>


               </LinearLayout>

            </ScrollView>


      </LinearLayout>




      )


    return this.layout.render();
  }
}


module.exports = HomeFragment;
