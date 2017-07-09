

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;



class CourseProgress extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "completedTextView"
    ]);
    this.displayName = "course_progress"

    var curValue = this.props.content.competedCount;
    var totalValue = this.props.content.totalCount;

    this.percentVal = parseFloat(curValue / totalValue);
    this.percentVal *= 100;

  }

  getProgressStatus = () => {
    return (<LinearLayout
            width="match_parent"
            margin="0,0,0,0">
                <TextView
                  style={window.__TextStyle.textStyle.HINT.REGULAR}
                  text={"Your Progress: "}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.REGULAR}
                  id ={this.idSet.completedTextView}
                  text={this.percentVal.toFixed(2)}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.REGULAR}
                  text={" %"}/> 
          </LinearLayout>)
  }

  updateProgress = (pStatus) => {
    this.competedCount = pStatus
    var cmd = this.set({
      id: this.idSet.completedTextView,
      text: pStatus
    })
    Android.runInUI(cmd, 0);

  }

  handleResumeClick = () => {
    this.props.onResumeClick();
  }


  getResumeButton = () => {
    return (<LinearLayout
          width="wrap_content"
          height="wrap_content"
          background={window.__Colors.PRIMARY_ACCENT}
          cornerRadius="2"
          gravity="center">
          <TextView 
            width="wrap_content"
            height="wrap_content"
            text="RESUME"
            gravity="center"
            onClick={this.handleResumeClick}
            style={window.__TextStyle.textStyle.TABBAR.WHITE}/>

        </LinearLayout>)
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
              text = {this.props.title||"Course Progress"}
              style= {window.__TextStyle.textStyle.HEADING.DARK}
              margin="0,0,0,8"/>

            {this.getProgressStatus()}

           
         
        </LinearLayout>
        <LinearLayout
          height="match_parent"
          margin="24,0,0,0"
          window="wrap_content"
          gravity="center"> 
           
         </LinearLayout>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseProgress;
