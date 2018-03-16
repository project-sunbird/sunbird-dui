
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");


class CropContentDetails extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "paraContainerCroped",
      "showMoreButton",
      "upDownBlueArrow"
    ]);

    this.str = this.props.contentDescription!=undefined ? this.props.contentText : "";
    console.log(this.props)

    this.str = "<br>" + this.props.contentDescription;
    this.max = false;
  }

  handleMoreClick = (data) => {
    if (!this.max){
      var cmd = this.set({
        id: this.idSet.showMoreButton,
        text: window.__S.READ_LESS,
        padding:"0,16,0,0"
      })
      cmd += this.set({
        id: this.idSet.paraContainerCroped,
        textFromHtml: this.props.contentText,
        maxLines: "5000"
      });
      cmd+= this.set({
        id: this.idSet.upDownBlueArrow,
        visibility:"visible",
        imageUrl: "ic_action_up_blue",
        margin:"8,20,0,0"

      })
      Android.runInUI(cmd, 0);
    } else {
      var cmd = this.set({
        id: this.idSet.showMoreButton,
        text: window.__S.READ_MORE,
        padding:"0,8,0,0"
      })
      cmd += this.set({
        id: this.idSet.paraContainerCroped,
        textFromHtml: this.str,
        maxLines:"3"
      });
      cmd+= this.set({
        id: this.idSet.upDownBlueArrow,
        visibility:"visible",
        imageUrl:"ic_action_down_blue",
        margin:"8,12,0,0"
      })
      Android.runInUI(cmd, 0);
    }
    this.max = !this.max
  }

  render() {
    this.layout = (
      <LinearLayout
      background={window.__Colors.WHITE}
      width="match_parent"
      height= "match_parent"
      margin = {this.props.margin || "0,0,0,0"}
      orientation="vertical"
      layoutTransition="true">
            <TextView
              id={this.idSet.paraContainerCroped}
              maxLines = "3"
              enableEllipse="true"
              textFromHtml = {this.str}
              enableEllipse="true"
              style= {this.props.textStyle ? this.props.textStyle : window.__TextStyle.textStyle.CARD.BODY.REGULAR}/>
              <LinearLayout
                orientation="horizontal">
            <TextView
              id={this.idSet.showMoreButton}
              padding="0,8,0,0"
              text={window.__S.READ_MORE}
              gravity = "left"
              onClick={this.handleMoreClick}
              style = {window.__TextStyle.textStyle.CARD.BODY.BLUE_R}
              color={window.__Colors.PRIMARY_ACCENT} />
              <ImageView
                width="10"
                height="10"
                id={this.idSet.upDownBlueArrow}
                gravity="left"
                margin="8,12,0,0"
                imageUrl="ic_action_down_blue" />
                </LinearLayout>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CropContentDetails;
