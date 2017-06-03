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


var SimpleToolbar = require('../Sunbird/SimpleToolbar');

var TodoContainer = require('../Sunbird/TodoContainer');
var RecommendedContainer = require('../Sunbird/RecommendedContainer');

class HomeComponent extends View {
  constructor(props, children) {
    super(props, children);


    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" }
      ]
    }
    this.recommendedData = {
        title: "Recommended",
        data: [
      {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      },
      {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      },
      {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      },
      {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      },
      {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      },
      {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      } 
    ]
  }
    
    // Todo Data
    this.todoData=[
      {
        name: "Mastering in Organic Chemistry",
        imageUrl: "ic_flask_black",
        class: "IX",
        pen_classes: "3"
      },
      {
        name: "Mastering in Physics",
        imageUrl: "ic_molecule_black",
        class: "IX",
        pen_classes: "3"
      },
      {
        name: "Mastering in Intermediate Metallurgy",
        imageUrl: "ic_flask_black",
        class: "IX",
        pen_classes: "3"
      },
      {
        name: "Mastering in Organic Chemistry",
        imageUrl: "ic_flask_black",
        class: "IX",
        pen_classes: "3"
      }
    ]

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
  handleTodoClick = (index) =>{
    console.log("Todo Clicked index is ",index);
  }

  handleViewAllTodoClick = () =>{
    console.log("View All todos in home");
  }

  render() {
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title=""
          invert="true"
          hideBack="true"
          menuData={this.menuData}
          width="match_parent"/>
        

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
                   />
                   <FeedComponent
                   feedData = {this.props.feedData}
                   voteClick = {this.props.voteClick}
                   answerClick={this.props.answerClick}
                   bookmarkClick={this.props.bookmarkClick}
                   />



               </LinearLayout>

            </ScrollView>


      </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = HomeComponent;
