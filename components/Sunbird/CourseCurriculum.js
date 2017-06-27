var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var ChapterList = require('../Sunbird/ChapterList');
var AnswerView = require('../Sunbird/AnswerView');
var ChapterOverView = require('../Sunbird/ChapterOverView');

class CourseCurriculum extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "course_curriculumn"
    this.enrolledStatus = this.props.enrolledStatus == undefined ? false : this.props.enrolledStatus;

  }


  getCurriculumnBrief = () => {

    var items = this.props.content.courseBrief.map((item, i) => {
      return (<TextView
                style={window.__TextStyle.textStyle.HINT.REGULAR} 
                text ={(i==0?"":" | ") +item.count + " "+item.type}/>)
    })

    return (
      <LinearLayout
        margin="0,0,0,24"
        height="wrap_content"
        width="match_parent">
        {items}
      </LinearLayout>);
  }


  getChapterList = () => {



    var items = this.props.content.chapterList.map((item) => {
      return (<ChapterList 
          item={item} 
          _onClick={this.props.onItemSelected}
          enrolledStatus={this.enrolledStatus}/>)
    })

    return (
      <LinearLayout
        orientation="vertical"
        height="wrap_content"
        width="match_parent">
        {items}
      </LinearLayout>);
  }

  getCourseBreakUp = () => {

    var items = this.props.content.chapterList.map((item, index) => {
      return (<ChapterOverView
          item={item}
          index={index}/>)
    })

    return (
      <LinearLayout
        orientation="vertical"
        height="wrap_content"
        width="match_parent">
        {items}
      </LinearLayout>);
  }


  getContent = () => {
    if (this.props.brief) {
      return this.getCourseBreakUp()
    } else {
      return this.getChapterList()
    }
  }

  render() {


    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       width="match_parent">
        <TextView
          margin="0,24,0,0"
          text="Curriculum" 
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

        {this.getCurriculumnBrief()}  

        {this.getContent()}

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = CourseCurriculum;
