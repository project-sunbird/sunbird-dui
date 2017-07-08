

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

class ChapterOverView extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "chapter_overview"

  }

  setDownloading = () => {

  }

  render() {
    var chapterName = "Module " + (this.props.index + 1) + ": " + this.props.item.contentData.name;
    //var chapterDuration = "[ " + this.props.item.chapterDuration + " minutes ]";
    var chapterDuration = "[ " + "N/A" + " minutes ]";

    this.layout = (

      <LinearLayout
       height="match_parent"
       cornerRadius="2"
       padding="6,0,6,15"
       orientation="vertical"
       gravity="center_vertical"
       onClick={this.props.onClick}
       width="match_parent">

       <LinearLayout
       width="match_parent"
       height="wrap_content">

        <TextView
          text={chapterName}
          style={window.__TextStyle.textStyle.CARD.HEADING}/>

        <TextView
          text={chapterDuration}
          margin="6,0,0,0"
          style={window.__TextStyle.textStyle.CARD.SEMI_DARK}/>

        <ViewWidget
          width="0"
          weight="1"/>

        <ImageView
          width="20"
          height="12"
          imageUrl="ic_action_right"/>


      </LinearLayout>

        <LinearLayout
        width="match_parent"
        height="2"
        margin="0,17,0,0"
        background={window.__Colors.WHITE_F4}/>

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ChapterOverView;
