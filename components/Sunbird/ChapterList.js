var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");

var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");

class ChapterItem extends View {
  constructor(props, children) {
    super(props, children);
    this.setUpUI();

  }

  setUpUI = () => {
    switch (this.props.item.type) {
      case "PLAY":
        this.imageIcon = "ic_action_video"
        break;
      case "QUIZ":
        this.imageIcon = "ic_action_quiz"
        break;
      case "ASSIGNMENT":
        this.imageIcon = "ic_action_assignment"
        break;
      default:
        this.imageIcon = "ic_action_video"
        break;
    }

    this.showExtraContent = this.props.enrolledStatus != undefined ? this.props.enrolledStatus : false;
    this.showResumeContent = false;
    this.color = window.__Colors.DARK_GRAY;

    if (this.showExtraContent) {
      switch (this.props.item.status) {

        case "DONE":
          this.imageIcon = "ic_action_completed"
          this.color = window.__Colors.SUCCESS_GREEN;
          break;
        case "PROGRESS":
          this.imageIcon += "_resume"
          this.color = window.__Colors.ORANGE;
          this.showResumeContent = true;
          break;
        case "PENDING":
          this.color = window.__Colors.DARK_GRAY;
          break;

        default:
          this.color = window.__Colors.DARK_GRAY;
          break;
      }
    }

  }
  handleResume = () => {
    this.props._onClick();
  }

  render() {

    this.layout = (

      <LinearLayout
       height="match_parent"
       width="match_parent">


       <LinearLayout
         orientation="vertical"
         gravity="center"
         height="match_parent"
         width="24">
        
         <ViewWidget 
          width="2"
          height="24"
          background={this.color} />
          
           <ImageView
            width="24"
            height="24"
            imageUrl={this.imageIcon}
            margin="0,0,0,5"/>
       
        </LinearLayout>
        
        <TextView
          text={this.props.item.name}
          margin="24,24,0,0"
          width="0"
          weight="1"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

        <TextView
          visibility={this.showResumeContent?"visible":"gone"}
          text={window.__S.RESUME}
          margin="24,24,0,0"
          onClick={this.handleResume}
          style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

       </LinearLayout>

    )
    return this.layout.render();
  }

}

class ChapterList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "chapter_list"
    this.enrolledStatus = this.props.enrolledStatus == undefined ? false : this.props.enrolledStatus;

  }

  getChapterContent = () => {

    var items = this.props.item.chapterContent.map((item) => {
      return (<ChapterItem 
                height="wrap_content"
                width="match_parent"
                _onClick={this.props._onClick}
                enrolledStatus={this.enrolledStatus}
                item={item}/>)
    })



    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">
       
        {items}

      </LinearLayout>);
  }

  render() {
    var chapterName = this.props.item.contentData.name;
    chapterName += (this.enrolledStatus ? (" (" + this.props.item.chapterFinished + "/" + this.props.item.chapterContent.length + ")") : " ")

    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       width="match_parent">
        
        <TextView
          text={chapterName}
          margin="0,24,0,0"
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

          {this.getChapterContent()}  

        

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ChapterList;
