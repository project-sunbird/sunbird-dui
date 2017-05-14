var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var HorizontalProgressBar = require("../Sunbird/HorizontalProgressBar");


class CourseProgress extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "completedTextView"
    ]);
    this.displayName = "course_progress"
    this.competedCount = this.props.item != undefined ? this.props.item.competedCount : "25";
    this.totalCount = this.props.item != undefined ? this.props.item.totalCount : "150";

  }

  getProgressStatus = () => {
    return (<LinearLayout
            width="match_parent"
            margin="0,0,0,12">
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={"Your Progress: "}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  id ={this.idSet.completedTextView}
                  text={this.competedCount}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={" / "}/>  
                 <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={this.totalCount}/> 
          </LinearLayout>)
  }

  updateProgressBar = (pStatus) => {
    this.competedCount = pStatus
    var cmd = this.set({
      id: this.idSet.completedTextView,
      text: pStatus
    })
    Android.runInUI(cmd, 0);
    var ProgressBar = this.find('horizontal_progress_card')[0];
    ProgressBar.updateProgressBar(pStatus);


  }

  handleResumeClick = () => {
    this.props.onResumeClick();
  }




  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      gravity="center"
      height="match_parent">

        <LinearLayout
          width="0"
          weight="1"
          height="match_parent"
          orientation="vertical">
            <TextView
              text = {"Course Progress"}
              style= {window.__TextStyle.textStyle.CARD.TITLE.DARK}
              margin="0,0,0,8"/>

            {this.getProgressStatus()}

            <HorizontalProgressBar 
              currentProgress={this.competedCount}
              totalProgress = {this.totalCount}
              width="match_parent"
              height="wrap_content"/>
         
        </LinearLayout>
         <TextView
          width="wrap_content"
          height="match_parent"
          gravity="center"
          text="RESUME"
          onClick={this.handleResumeClick}
          margin="24,0,0,0"
          style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseProgress;
