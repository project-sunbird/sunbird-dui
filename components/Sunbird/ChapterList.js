var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

class ChapterItem extends View {
  constructor(props, children) {
    super(props, children);
    this.color = window.__Colors.DARK_GRAY_44;
    this.setUpUI();

  }

  setUpUI = () => {
    switch (this.props.item.type) {
      case "PLAY":
        this.imageIcon = "ic_play"
        break;
      case "QUIZ":
        this.imageIcon = "ic_quiz"
        break;
      case "ASSIGNMENT":
        this.imageIcon = "ic_assignment"
        break;
      default:
        this.imageIcon = "ic_play"
        break;
    }

    this.showExtraContent = this.props.enrolledStatus != undefined ? this.props.enrolledStatus : false;
    this.showResumeContent = false;
    if (this.showExtraContent) {
      switch (this.props.item.status) {

        case "DONE":
          this.imageIcon += "_done"
          this.color = window.__Colors.SUCCESS_GREEN;
          break;
        case "PROGRESS":
          this.imageIcon += "_progress"
          this.color = window.__Colors.ORANGE;
          this.showResumeContent = true;
          break;
        case "PENDING":
          this.color = window.__Colors.DARK_GRAY;
          break;

        default:
          this.color = window.__Colors.DARK_GRAY_44;
          break;
      }
    }

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
            text="RESUME"
            margin="24,24,0,0"
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
      return (<ChapterItem height="wrap_content"
                width="match_parent"
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
    var chapterName = this.props.item.chapterName;
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
