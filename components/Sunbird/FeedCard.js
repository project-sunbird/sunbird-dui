var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;

window.R = require("ramda");
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

class FeedCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "ratingBar",
    ]);

    this.feedData = this.props.feedData;
  }


  getProfileLabel = () =>{
      return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              orientation="horizontal"
              gravity="center_vertical"
              padding="0,15,0,0"
              >
                <ImageView
                width="32"
                height="32"
                imageFromUrl={this.feedData.imageUrl}/>

                <LinearLayout
                  width="wrap_content"
                  height="wrap_content"
                  orientation="vertical"
                  padding="12,0,0,0">
                   <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={this.feedData.profileName}
                    style={window.__TextStyle.textStyle.CARD.HEADING}/>

                    <LinearLayout
                      width="wrap_content"
                      height="wrap_content"
                      orientation="horizontal"
                      gravity="center_vertical"
                      padding="0,0,0,0">
                        <TextView
                        width="wrap_content"
                        height="wrap_content"
                        text={this.feedData.subject}
                        gravity="center_vertical"
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>
                        <LinearLayout
                         width="4"
                         height="4"
                         margin="8,0,0,0"
                         gravity="center_vertical"
                         background={window.__Colors.PRIMARY_BLACK_66}
                         cornerRadius="5"/>
                        <TextView
                        width="wrap_content"
                        height="wrap_content"
                        padding="8,0,0,0"
                        text={this.feedData.time}
                        gravity="center_vertical"
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>
                    </LinearLayout>

                </LinearLayout>

             <ViewWidget 
                weight="1"
                height="0"/>
                            
             <ImageView
                width="24"
                height="24"
                gravity="center_vertical"
                imageUrl="ic_person_add_blue"/>

    
            </LinearLayout>);
  }


  getFooter = () =>{
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              orientation="horizontal"
              gravity="center_vertical"
              margin="0,20,0,0"
              >

            <ImageView
                width="18"
                height="18"
                onClick={this.handleVoteClick}
                imageUrl="ic_action_up"/>
            <TextView
                width="wrap_content"
                height="wrap_content"
                margin="2,0,0,0"
                text={this.feedData.votes}
                style={window.__TextStyle.textStyle.HINT.SEMI_BLUE}/>
            <ImageView
                width="18"
                height="18"
                margin="22,0,0,0"
                onClick={this.handleAnswerClick}
                imageUrl="ic_action_edit"/>
            <TextView
                width="wrap_content"
                height="wrap_content"
                margin="2,0,0,0"
                text="Answer"
                style={window.__TextStyle.textStyle.HINT.SEMI}/>
            <ViewWidget 
                weight="1"
                height="0"/>
            <ImageView
                width="20"
                height="28"
                padding="5,5,5,5"
                onClick={this.handleBookmarkClick}
                imageUrl="ic_action_bookmark"/>

            </LinearLayout>);
  }

  getBody = () =>{
    return (<LinearLayout
          width="match_parent"
          height="wrap_content"
          margin="16,11,16,11"
          orientation="vertical"
          gravity="center_vertical"
          >

          <LinearLayout
          width="wrap_content"
          height="wrap_content"
          gravity="center_vertical"
          >
              <TextView
              width="match_parent"
              height="wrap_content"
              gravity="center_vertical"
              text={this.feedData.answerTitle}
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>

              <LinearLayout
               width="4"
               height="4"
               margin="8,0,0,0"
               gravity="center_vertical"
               background={window.__Colors.PRIMARY_BLACK_66}
               cornerRadius="5"/>

              <TextView
              width="match_parent"
              height="wrap_content"
              margin="8,0,0,0"
              gravity="center_vertical"
              text="Topic you might like"
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>

          </LinearLayout> 

          <TextView
          width="match_parent"
          height="wrap_content"
          margin="0,8,0,0"
          gravity="center_vertical"
          text={this.feedData.question}
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>


            {this.getProfileLabel()}

             <TextView
                width="wrap_content"
                height="wrap_content"
                margin="0,18,0,0"
                text={this.feedData.answer}
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

             {this.getFooter()}


        </LinearLayout>);
  }

  handleVoteClick = () =>{
    this.props.voteClick();
  }

  handleAnswerClick = () =>{
    this.props.answerClick();
  }

  handleBookmarkClick = () =>{
    this.props.bookmarkClick();
  }


  render() {

    this.layout = (
      <LinearLayout
        width="match_parent"
        height="239"
        margin="0,0,0,10"
        root="true"
        orientation="vertical"
        background={window.__Colors.WHITE}
        >
          {this.getBody()}
     </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = FeedCard;