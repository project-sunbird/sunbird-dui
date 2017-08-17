
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;


class CropParagraph extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "paraContainerCroped",
      "showMoreButton",
    ]);
    this.str = this.props.contentText;
    // console.log("inside CropParagraph, content : " + this.str);
    this.len = 50;
    if(this.str.length > this.len) this.str = this.str.substring(0,len) + "...";
  }

  handleMoreClick = (data) => {
    var cmd = this.set({
      id: this.idSet.showMoreButton,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.paraContainerCroped,
      text: this.props.contentText
    })

    Android.runInUI(cmd, 0);
  }


  // getMoreButton = () => {
  //   return (
  //     <LinearLayout
  //           height="wrap_content"
  //           layoutTransition="true"
  //           id={this.idSet.showMoreButton}
  //           width="wrap_content">
  //              <TextView
  //               margin="0,0,8,0"
  //               visibility="visible"
  //               text="Read more"
  //               width = "match_parent"
  //               layoutTransition="true"
  //               onClick={this.handleMoreClick}
  //               style = {window.__TextStyle.textStyle.CARD.BODY.BLUE_R}
  //               color={window.__Colors.PRIMARY_ACCENT} />
  //
  //         </LinearLayout>);
  // }


  render() {


    this.layout = (
      <LinearLayout
      background={window.__Colors.WHITE}
      width="match_parent"
      height="wrap_content"
      visibility = {(this.props.headText==undefined || this.props.headText.length == 0) ? "gone":"visible"}
      layoutTransition="true"
      orientation="vertical">

        <TextView
          text = {this.props.headText}
          style= {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          margin="0,0,0,8"/>

          <LinearLayout
            orientation = "vertical"
            width = "match_parent"
            height = "wrap_content">

          <TextView
              id={this.idSet.paraContainerCroped}
              text = {this.str}
              width="wrap_content"
              height="wrap_content"
              layoutTransition="true"
              style= {window.__TextStyle.textStyle.CARD.BODY.REGULAR}/>

              <TextView
               margin="0,0,8,0"
               id={this.idSet.showMoreButton}
               visibility={this.str.length > this.len ? "visible" : "gone"}
               text="Read more"
               gravity = "right"
               width = "wrap_content"
               height = "wrap_content"
               layoutTransition="true"
               onClick={this.handleMoreClick}
               style = {window.__TextStyle.textStyle.CARD.BODY.BLUE_R}
               color={window.__Colors.PRIMARY_ACCENT} />
          </LinearLayout>

      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CropParagraph;
