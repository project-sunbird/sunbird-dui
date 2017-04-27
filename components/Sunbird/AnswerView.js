var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var HorizontalProgressBar = require("../Sunbird/HorizontalProgressBar");


class AnswerView extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "completedTextView"
    ]);
    this.displayName = "answer_view"
    this.containsImage = (this.props.item.imageUrl === undefined ? true : false)

  }

  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      gravity="center"
      cornerRadius="2"
      stroke ={"2," + window.__Colors.PRIMARY_BLACK_22}
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

module.exports = AnswerView;
