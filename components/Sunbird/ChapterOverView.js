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
    this.index = (this.props.currIndex == ""? "" : this.props.currIndex + ".") + (this.props.index + 1);
  }

  setDownloading = () => {

  }

  handleClick = () => {
    this.props.item.index = this.index;
    this.props._onClick(this.chapterName, this.props.item)
  }


  getLineSeperator = () => {
    return (<LinearLayout
              width="match_parent"
              height="1"
              margin="0,16,0,16"
              background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  render() {

    this.chapterName = this.index + " : " + this.props.item.contentData.name;


    this.layout = (

      <LinearLayout
       width="match_parent"
       height="60"
       padding="0,6,0,6"
       onClick={this.handleClick}
       gravity="center_vertical">

         <TextView
           width="0"
           weight="1"
           height="wrap_content"
           gravity="center_vertical"
           text={this.chapterName}
           enableEllipse = "true"
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
