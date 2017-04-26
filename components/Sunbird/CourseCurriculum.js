var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var CourseCurriculumItem = require('../Sunbird/CourseCurriculumItem');

class CourseCurriculum extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";


  }

  getCurriculumnBrief = () => {
    var data = [{
      count: "50",
      type: "Assignments"
    }, {
      count: "25",
      type: "Videos"
    }, {
      count: "5",
      type: "Quizes"
    }];

    var items = data.map((item, i) => {
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


  getCurriculumnContent = () => {
    var data = {
      chapterName: "Progression",
      chapterContent: [{
        name: "Arithemetic Progression",
        type: "Chapter",
        status: "DONE"
      }, {
        name: "Geometric Progeressions",
        type: "Chapter",
        status: "IN_PROGRESS"
      }, {
        name: "Quiz 1: 10 questions",
        type: "Quiz",
        status: "LEFT"
      }]
    }
    return (
      <CourseCurriculumItem item={data}/>)
  }


  render() {


    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       width="match_parent">
        <TextView
          text="Curriculum" 
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

        {this.getCurriculumnBrief()}  

        {this.getCurriculumnContent()}

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = CourseCurriculum;
