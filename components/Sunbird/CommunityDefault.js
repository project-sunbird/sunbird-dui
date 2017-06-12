var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/SimpleToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var FeedComponent = require('./FeedComponent');
var CommunityEventsContainer = require('./CommunityEventsContainer');


var _this;
class CommunityDefault extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount'
    ]);
    _this=this;

    this.feedData=[
      {
      	answerTitle : "Answer written in Chemistry",
      	question : "This is a 2-liner question in place. Can you tell which kind is it?",
      	answer : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."+
         "Lorem Ipsum has been the industry's "+
        "standard dummy text ever since the 1500s, when an unknown printer took a galley"+
        "I will write after this. This is the 2nd paragraph, which can lead to a long answer like it is… $#More#$",
      	imageUrl : "http://www.mens-hairstylists.com/wp-content/uploads/2015/10/Faux-Hawk-hairstyles-for-boys.jpg",
      	profileName : "Phani Bhushan Banerjee",
      	subject : "Level III Chemistry",
      	time : "23h ago",
      	votes : "163 votes"

      }]


  }



  getPinnedLabel(){
    return (<LinearLayout
             width="match_parent"
             height="33"
             gravity="center_vertical"
             orientation="horizontal">
                 <LinearLayout
                 width="match_parent"
                 height="1"
                 weight="1"
                 background={window.__Colors.PRIMARY_BLACK_22}/>

                 <LinearLayout
                 width="match_parent"
                 height="wrap_content"
                 gravity="center_vertical"
                 weight="1">

                     <ImageView
                     width="13"
                     height="13"
                     imageUrl="ic_action_pin"/>

                     <TextView
                     width="wrap_content"
                     height="wrap_content"
                     margin="5,0,0,0"
                     text= "Pinned by Admin"
                     style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                 </LinearLayout>

                 <LinearLayout
                 width="match_parent"
                 height="1"
                 weight="1"
                 background={window.__Colors.PRIMARY_BLACK_22}/>

             </LinearLayout>
           )
  }


  handleAnswerClick = () =>{
    console.log("answer clicked")
  }

  handleVoteClick = () =>{
    console.log("vote clicked")
  }

  handleBookmarkClick = () =>{
    console.log("bookmark clicked")
  }



  render() {
    this.layout = (
                <LinearLayout
                width="match_parent"
                height="wrap_content"
                orientation="vertical">

                {this.getPinnedLabel()}

                <FeedComponent
                feedData = {this.feedData}
                voteClick = {this.handleVoteClick}
                answerClick={this.handleAnswerClick}
                bookmarkClick={this.handleBookmarkClick}
                />
                <CommunityEventsContainer/>


              </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = CommunityDefault;
