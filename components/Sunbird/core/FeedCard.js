var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");

var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
window.R = require("ramda");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var Button = require('../../Sunbird/Button');
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var _this;

var Styles = require("../../../res/Styles");
let IconStyle = Styles.Params.IconStyle;


class FeedCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "ratingBar",
      "voteContainer",
      "answerUnclicked",
      "answerClicked",
      "answersContainer"
    ]);

    _this = this;
    this.answer= "";
    this.feedData = this.props.feedData;
  }

  afterRender(){
  }


  getProfileLabel = () =>{
      return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              orientation="horizontal"
              afterRender={this.afterRender}
              gravity="center_vertical"
              padding="0,15,0,0"
              >
                <ImageView
                width="50"
                height="50"
                circularImageUrl={"0," + this.feedData.imageUrl}
                />

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


  answerUnclicked = () =>{
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            visibility="visible"
            id={this.idSet.answerUnclicked}
            margin="0,0,0,0">
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
                onClick={()=>{this.handleAnswerClick()}}
                imageUrl="ic_action_edit"/>
            <TextView
                width="wrap_content"
                height="wrap_content"
                margin="2,0,0,0"
                text={window.__S.ANSWER}
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


            </LinearLayout>)
    }




    answerClicked = () =>{
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            visibility="gone"
            id={this.idSet.answerClicked}
            margin="0,0,0,0">

            <EditText
            margin="0,0,0,0"
            height="wrap_content"
            width="match_parent"
            hint="answer here"
            maxWidth="400"
            onChange={data=>_this.answer=data}
            layoutTransition="true"
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>

            <ViewWidget
            weight="1"
            height="0"/>

            <Button
            type="SmallButton_Secondary_WB"
            width="wrap_content"
            height="wrap_content"
            margin="0,10,0,0"
            onClick={this.handleAnswerSubmit}
            text={window.__S.BTN_SUBMIT}/>

            <ImageView
            style={IconStyle}
            onClick={()=>{this.handleAnswerClose()}}
            visibility={"visible"}
            imageUrl = {"ic_action_close"}/>

            </LinearLayout>)
    }


    getAnswers(data){
      return (
          <LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical">

            <TextView
              width="match_parent"
              height="wrap_content"
              text= {data}
              orientation="vertical"/>

          </LinearLayout>)

    }



    handleAnswerOpen(){
          var cmd = "";
          cmd += this.set({
          id: this.idSet.answerUnclicked,
          visibility: "gone"
          })
          cmd += this.set({
            id: this.idSet.answerClicked,
            visibility: "visible"
          })

        Android.runInUI(cmd, 0);
    }

    handleAnswerClose(){
          var cmd = "";
            cmd += _this.set({
            id: _this.idSet.answerUnclicked,
            visibility: "visible"
            })
            cmd += _this.set({
              id: _this.idSet.answerClicked,
              visibility: "gone"
            })

          Android.runInUI(cmd, 0);
    }

    handleAnswerSubmit(){
      _this.replaceChild(_this.idSet.answersContainer,_this.getAnswers(_this.answer).render(),null);
    }



  getFooter = () =>{
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              orientation="horizontal"
              gravity="center_vertical"
              margin="0,20,0,0"
              >

              {this.answerUnclicked()}
              {this.answerClicked()}


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
              text={window.__S.TOPIC_YOU_MIGHT_LIKE }
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

             <LinearLayout
             id={this.idSet.answersContainer}
             width="match_parent"
             height="wrap_content"
             orientation="vertical"/>

             {this.getFooter()}


        </LinearLayout>);
  }

  handleVoteClick = () =>{
    this.props.voteClick();
  }

  handleAnswerClick = () =>{
    // this.props.answerClick();
    this.handleAnswerOpen();
  }

  handleBookmarkClick = () =>{
    this.props.bookmarkClick();
  }




  render() {

    this.layout = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
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
