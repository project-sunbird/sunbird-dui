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
    console.log("home component api token",window.__apiToken)
    
    this.recommendedServerData = {
      "display": {
        "title": {
          "en": "Recommended",
          "hi": "लोकप्रिय"
        }
      },
      "count": 2,
      "content": [{
        "identifier": "course1",
        "contentId": "do_3122025632538951681225",
        "pkgVersion": 1,
        "organization": [
          "org1"
        ],
        "faculty": [
          "faculty1"
        ],
        "tutors": [
          "tutor1"
        ],
        "name": "Course 1",
        "description": "Description of course 1",
        "appIcon": "https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122025623654973442202/artifact/00642360c44e576a1c5886410ca1ed78_1489570574295.jpeg",
        "language": [
          "English"
        ],
        "gradeLevel": [
          "Grade 1"
        ],
        "subject": [
          "Maths"
        ],
        "tocUrl": "",
        "downloadUrl": "https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122025632538951681225/level-1-english-workbook_1489725405559_do_3122025632538951681225_2.0.ecar",
        "variants": "{\"spine\":{\"ecarUrl\":\"https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122025632538951681225/level-1-english-workbook_1489725408214_do_3122025632538951681225_2.0_spine.ecar\",\"size\":140939.0}}"
      }, {
        "identifier": "course2",
        "contentId": "do_3122027498453483521235",
        "pkgVersion": 1,
        "organization": [
          "org1"
        ],
        "faculty": [
          "faculty1"
        ],
        "tutors": [
          "tutor1"
        ],
        "name": "Course 2",
        "description": "Description of course 2",
        "appIcon": "https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122027498453483521235/artifact/9112e63fd2a3c4383b6d8ece55b8783d_1489593501735.thumb.jpeg",
        "language": [
          "English"
        ],
        "gradeLevel": [
          "Grade 1"
        ],
        "subject": [
          "Maths"
        ],
        "tocUrl": "",
        "downloadUrl": "https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122027498453483521235/1st-grade-lessons_1492496229137_do_3122027498453483521235_1.0.ecar",
        "variants": "{\"spine\":{\"ecarUrl\":\"https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122027498453483521235/1st-grade-lessons_1492496249327_do_3122027498453483521235_1.0_spine.ecar\",\"size\":1931251.0}}",
        "posterImage": "https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122027497444966401234/artifact/9112e63fd2a3c4383b6d8ece55b8783d_1489593501735.jpeg"
      }]
    }


    // Todo Data
    this.todoData = [{
      name: "Mastering in Organic Chemistry",
      imageUrl: "ic_flask_black",
      class: "IX",
      pen_classes: "3"
    }, {
      name: "Mastering in Physics",
      imageUrl: "ic_molecule_black",
      class: "IX",
      pen_classes: "3"
    }, {
      name: "Mastering in Intermediate Metallurgy",
      imageUrl: "ic_flask_black",
      class: "IX",
      pen_classes: "3"
    }, {
      name: "Mastering in Organic Chemistry",
      imageUrl: "ic_flask_black",
      class: "IX",
      pen_classes: "3"
    }]

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

    var callback = callbackMapper.map((params) => {
      this.getLocalData([params[0]])
      console.log("darta from android", params);
    });

    JBridge.getAllLocalContent(callback);

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
            logo="ic_launcher"
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
                    title="To-Do"
                    onCourseClick={this.handleUserCoursesClick}/>


                   {this.getSpaceSeparator()}

                   <HomeRecommendedContainer
                   title= "Recommended"
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

//To be added
//  <LinearLayout
//                    width="match_parent"
//                    height="wrap_content"
//                    background={window.__Colors.WHITE_F2}>

//                    <TextView
//                    width="wrap_content"
//                    height="wrap_content"
//                    text="Feed"
//                    padding="16,7,0,7"
//                    style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
//                    </LinearLayout> 
// <FeedComponent
// feedData = {this.props.feedData}
// voteClick = {this.handleVoteClick}
// answerClick={this.handleAnswerClick}
// bookmarkClick={this.handleBookmarkClick}
// />





// <SearchToolbar
//             hint="Enter your search"
//             invert="true"
//             hideBack="true"
//             showAppIcon = "true"
//             onMenuItemClick={this.handleMenuClick}
//             menuData={this.menuData}
//             onSearch={this.handleSearch}/>


// <TodoContainer
//                     onItemClick = {this.handleTodoClick}
//                     todoData = {this.todoData}
//                     onViewTodoClick={this.handleViewAllTodoClick}
//                    />
//  <RecommendedContainer
//  hideRating = "visible"
//  recommendedData = {this.recommendedData}
//  Data ={this.recommendedServerData}
//  onClick={this.handleRecommendedClick}
// />
