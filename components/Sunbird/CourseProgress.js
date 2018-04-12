var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");


var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");


var utils = require('../../utils/GenericFunctions');

class CourseProgress extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "completedTextView"
    ]);

    this.displayName = "course_progress"

    var curValue = this.props.content.competedCount;
    var totalValue = this.props.content.totalCount;

    this.progressBar = this.props.content.completedProgress;
    this.percentVal = parseFloat(curValue / totalValue);
    this.percentVal *= 100;

  }

  getProgressStatus = () => {
    return (<LinearLayout
      visibility={this.props.visibility}
      width="match_parent"
      margin="0,0,0,4">

      <TextView
        style={window.__TextStyle.textStyle.HINT.REGULAR}
        id={this.idSet.completedTextView}
        text={window.__S.YOUR_PROGRESS.format(this.progressBar)} />

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
          <LinearLayout
            orientation="horizontal">
          <TextView
            text={utils.firstLeterCapital(this.props.title || this.props.name || "No title")}
            style={window.__TextStyle.textStyle.HEADING.DARK}
            margin="0,0,0,4" />
            <ImageView
              width="16"
              height="16"
              visibility={"gone"}
              gravity="left"
              margin="8,6,0,4"
              imageUrl="ic_check_circle"/>
              </LinearLayout>

            <LinearLayout
              orientation="horizontal"
              visibility={this.props.batchCreatedBy? "visible":"gone"}>

              <TextView
                height="wrap_content"
                width="match_parent"
                margin="0,0,0,4"
                visibility={this.props.batchCreatedBy!="" ? "visible":"gone"}
                text={window.__S.BY}
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>

              <TextView
                height="wrap_content"
                width="match_parent"
                margin="0,0,0,4"
                visibility={this.props.batchCreatedBy!="" ? "visible":"gone"}
                text={" "+this.props.batchCreatedBy}/>
                </LinearLayout>

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
