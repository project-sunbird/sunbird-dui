
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
  }

  handleMoreClick = (data) => {
    var cmd = this.set({
      id: this.idSet.showMoreButton,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.paraContainerCroped,
      maxLines: "100"
    })

    Android.runInUI(cmd, 0);
  }


  getMoreButton = () => {
    return (
      <LinearLayout
            height="wrap_content"
            layoutTransition="true"
            id={this.idSet.showMoreButton}
            width="match_parent">
              <ViewWidget 
                height="1"
                width="0"
                weight="1"/>
               <TextView
                margin="0,0,8,0"
                text="more"
                layoutTransition="true"
                onClick={this.handleMoreClick}
                style = {window.__TextStyle.textStyle.CARD.BODY.BLUE_R}
                color={window.__Colors.PRIMARY_ACCENT} />
           
          </LinearLayout>);
  }


  render() {


    this.layout = (
      <LinearLayout
      background={window.__Colors.WHITE}
      width="match_parent"
      height="match_parent"
      visibility = {(this.props.headText==undefined || this.props.headText.length == 0) ? "gone":"visible"}
      layoutTransition="true"
      orientation="vertical">

        <TextView
          text = {this.props.headText}
          style= {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          margin="0,0,0,8"/>

       

          <TextView
              id={this.idSet.paraContainerCroped}
              text = {this.props.contentText}
              width="match_parent"
              height="match_parent"
              maxLines="2"
               layoutTransition="true"
              style= {window.__TextStyle.textStyle.CARD.BODY.REGULAR}/>
          
          {this.getMoreButton()}


      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CropParagraph;
