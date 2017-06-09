var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var FeedComponent = require('./FeedComponent');


window.R = require("ramda");


var SearchToolbar = require('../Sunbird/SearchToolbar');

var TodoContainer = require('../Sunbird/TodoContainer');
var RecommendedContainer = require('../Sunbird/RecommendedContainer');

class HomeComponent extends View {
  constructor(props, children) {
    super(props, children);


    this.menuData = {
      url: [
        { imageUrl: "ic_action_notification_blue" },
      ]
    }

    this.recommendedServerData = {
          "display": {
            "title": {
              "en": "Recommended",
              "hi": "लोकप्रिय"
            }
          },
          "count": 2,
          "course": [
            {
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
            },
            {
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
            }
          ]
        }

    //
    // this.recommendedData = {
    //   title: "Recommended",
    //   data: [{
    //     name: "Organic Chemistry for Standard VII",
    //     imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
    //     count: 55,
    //     rating: 5
    //   }, {
    //     name: "Molecular Reactions for Beginners",
    //     imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
    //     count: 25,
    //     rating: 5
    //   }, {
    //     name: "Intermediate Metallurgy",
    //     imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
    //     count: 65,
    //     rating: 5
    //   }, {
    //     name: "Organic Chemistry for Standard VII",
    //     imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
    //     count: 55,
    //     rating: 5
    //   }, {
    //     name: "Molecular Reactions for Beginners",
    //     imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
    //     count: 25,
    //     rating: 5
    //   }, {
    //     name: "Intermediate Metallurgy",
    //     imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
    //     count: 65,
    //     rating: 5
    //   }]
    // }

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

  }

  // getInfo = () => {

  //   var layout = (
  //     <LinearLayout
  //       orientation="vertical"
  //       width="match_parent"
  //       height="wrap_content">

  //       <TextView
  //         text= {"Hi " + this.props.data.name + "!"}
  //         margin="16,86,16,12"
  //         style={window.__TextStyle.textStyle.TITLE.DARK}
  //         />

  //       <TextView
  //         text= "Just 3 more classes to mastering Organic Chemistry for Std XI"
  //         margin="16,0,20,8"
  //         style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}
  //         />

  //       <TextView
  //         text= "Take me there >>"
  //         margin="16,0,0,87"
  //         style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
  //         />

  //     </LinearLayout>
  //   )
  //   return layout;
  // }


  handleAnswerClick = () => {
    console.log("answer clicked")
  }

  handleVoteClick = () => {
    console.log("vote clicked")
  }

  handleBookmarkClick = () => {
    console.log("bookmark clicked")
  }


  handleTodoClick = (index) => {
    console.log("Todo Clicked index is ", index);
  }

  handleViewAllTodoClick = () => {
    console.log("View All todos in home");
  }


  handleMenuClick = (url) => {
    console.log("url clicked", url);
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }


  render() {
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

          <SearchToolbar
            hint="Enter your search"
            invert="true"
            hideBack="true"
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
                  orientation="vertical">

                    <TodoContainer
                    onItemClick = {this.handleTodoClick}
                    todoData = {this.todoData}
                    onViewTodoClick={this.handleViewAllTodoClick}
                   />

                    <RecommendedContainer
                    hideRating = "visible"
                    recommendedData = {this.recommendedData}
                    Data ={this.recommendedServerData}
                   />
                   <FeedComponent
                   feedData = {this.props.feedData}
                   voteClick = {this.voteClick}
                   answerClick={this.answerClick}
                   bookmarkClick={this.bookmarkClick}
                   />



               </LinearLayout>

            </ScrollView>


      </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = HomeComponent;
