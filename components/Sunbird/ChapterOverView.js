var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

class ChapterOverView extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "chapter_overview"

    console.log(">>>>> PROPS Index", this.props.index)
    console.log(">>>>> PROPS Item", this.props.item)


  }

  setDownloading = () => {

  }

  render() {
    var chapterName = "Module " + this.props.index + ": " + this.props.item.chapterName;
    var chapterDuration = "[ " + this.props.item.chapterDuration + " minutes ]";

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
          style={window.__TextStyle.textStyle.CARD.HEADDING}/>

        <TextView
          text={chapterDuration}
          margin="6,0,0,0"
          style={window.__TextStyle.textStyle.CARD.HEADDING}/>

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
