var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");

var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

var ChapterList = require('../Sunbird/ChapterList');
var AnswerView = require('../Sunbird/AnswerView');
var ChapterOverView = require('../Sunbird/ChapterOverView');

class CourseCurriculum extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "course_curriculumn"
    this.enrolledStatus = this.props.enrolledStatus == undefined ? false : this.props.enrolledStatus;
    console.log("CourseCurriculum", props);
    this.currIndex = this.props.currIndex ? this.props.currIndex : "";
  }



  getChapterList = () => {
    var items = this.props.content.map((item) => {
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

    var items = this.props.content.map((item, index) => {

      return (
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="vertical">


          <ChapterOverView
            item={item}
            height="wrap_content"
            _onClick={this.handleClick}
            currIndex = {this.currIndex}
            shouldGoForward={this.props.shouldGoForward?this.props.shouldGoForward:"visible"}
            index={index}/>

          {this.getLineSeperator()}


        </LinearLayout> )

    })


    return (
      <LinearLayout
        orientation="vertical"
        height="wrap_content"
        width="match_parent">
        {items}
      </LinearLayout>);
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  handleClick = (mName, module) => {
    this.props.onClick(mName, module)
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
       padding="0,0,0,0"
       height="match_parent"
       orientation="vertical"
       width="match_parent">

        {this.getContent()}

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = CourseCurriculum;
