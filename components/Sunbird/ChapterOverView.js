var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var utils = require('../utils/GenericFunctions');

class ChapterOverView extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "chapter_overview"
    this.index = (this.props.currIndex == ""? "" : this.props.currIndex + ".") + (this.props.index + 1);
  }

  setDownloading = () => {

  }

  handleClick = () => {
    this.props.item.index = this.index;
    this.props._onClick(this.chapterName, this.props.item)
  }


  render() {

    this.chapterName = utils.cropText(this.index + " : " + this.props.item.contentData.name,25);


    this.layout = (

      <LinearLayout
       width="match_parent"
       height="60"
       padding="0,6,0,6"
       onClick={this.handleClick}
       gravity="center_vertical">

         <TextView
           weight="1"
           height="wrap_content"
           gravity="center_vertical"
           text={this.chapterName}
           style={window.__TextStyle.textStyle.CARD.HEADING}/>


         <ImageView
           width="32"
           height="32"
           gravity="center_vertical"
           padding="8,8,8,8"
           visibility={this.props.shouldGoForward?this.props.shouldGoForward:"visible"}
           imageUrl="ic_action_right"/>

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ChapterOverView;
