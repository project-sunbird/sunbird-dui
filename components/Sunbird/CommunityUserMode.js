var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var FeedComponent = require('./FeedComponent');
var CommunityEventsContainer = require('./CommunityEventsContainer');

var SearchToolbar = require('../Sunbird/SearchToolbar');
var _this;
class CommunityUserMode extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'feedContainer'
    ]);

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



    this.menuData = {
      url: [
        { imageUrl: "ic_action_notification_blue" },
      ]
    }
  }


  afterRender = () => {
  }

  handleMenuClick = (url) =>{
    console.log("url clicked",url);
  }

  handleSearch=(data)=>{
    console.log("searched",data);
  }

  getLogo(){
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              orientation="horizontal"
              padding="14,18,14,18"
              background={window.__Colors.PRIMARY_BLACK_44}>

                  <ImageView
                  width="42"
                  height="32"
                  imageUrl="ic_action_group"/>

              </LinearLayout>)
  }

  getGroupInfo(){
    return (<LinearLayout
            width="200"
            height="wrap_content"
            orientation="vertical"
            margin="10,0,0,0"
            >
                <TextView
                width="wrap_content"
                height="wrap_content"
                text="Maharashtra Teachers Association"
                margin="0,0,0,8"
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                <TextView
                width="wrap_content"
                height="wrap_content"
                text="(250 members)"
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>


            </LinearLayout>)

  }

  getGroupActions(){
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              orientation="vertical"
              gravity="center_horizontal"
              >
                  <ImageView
                  width="15"
                  height="15"
                  margin="0,0,0,33"
                  imageUrl="ic_action_down"/>

                  <TextView
                  width="wrap_content"
                  height="wrap_content"
                  text="JOIN"
                  style={window.__TextStyle.textStyle.CLICKABLE.SEMI_BLUE}/>
              </LinearLayout>
            )
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

  getHeader(){
      return (<LinearLayout
                height="match_parent"
                width="match_parent"
                padding="0,0,0,1"
                background={window.__Colors.PRIMARY_BLACK_22}
                orientation="vertical">

                    <LinearLayout
                      width="wrap_content"
                      height="wrap_content"
                      padding="16,16,16,16"
                      background={window.__Colors.WHITE}
                      orientation="horizontal">

                            {this.getLogo()}

                        <LinearLayout
                          width="wrap_content"
                          height="wrap_content"
                          orientation="horizontal">

                            {this.getGroupInfo()}

                            <ViewWidget
                             weight="1"
                             height="0"/>

                             {this.getGroupActions()}
                        </LinearLayout>
                    </LinearLayout>
          </LinearLayout>)
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
        root="true"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE_F7}
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

                  {this.getHeader()}

                  {this.getPinnedLabel()}

                  <FeedComponent
                  feedData = {this.feedData}
                  voteClick = {this.handleVoteClick}
                  answerClick={this.handleAnswerClick}
                  bookmarkClick={this.handleBookmarkClick}
                  />
                  <CommunityEventsContainer/>

                </LinearLayout>
           </ScrollView>
      </LinearLayout>

    )

    return this.layout.render();
  }
}



module.exports = CommunityUserMode;
