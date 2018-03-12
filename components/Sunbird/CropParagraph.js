
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");


var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");


class CropParagraph extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "paraContainerCroped",
      "showMoreButton",
    ]);
    this.str = this.props.contentText!=undefined ? this.props.contentText : "";
    console.log(this.props)
    // console.log("inside CropParagraph, content : " + this.str);
    this.len = parseInt(this.props.charToShow) || 50;
    if(this.props.charToShow){
      var pattern = "GRADE";
      if(this.str.indexOf(pattern)>=0) {
        this.str = this.str.substr(0,this.str.indexOf(pattern));
        this.str = this.str.replace(/<br>/g,"");
        this.str = "<br>" + this.str;
        if(this.str.length > 50) this.str = this.str.substring(0,50) + "...";
        else this.str = this.str + "<br>";

        this.len = 0;

      }
    }
    else if(this.str.length > this.len) this.str = this.str.substring(0,this.len) + "...";

    this.max = false;
    this.lockIconVisibility=this.props.privacyStatus;
    this.name=this.props.headText==window.__S.DESCRIPTION?"profileSummary":"";
  }

  handleMoreClick = (data) => {
    if (!this.max){
      var cmd = this.set({
        id: this.idSet.showMoreButton,
        text: window.__S.READ_LESS
      })
      cmd += this.set({
        id: this.idSet.paraContainerCroped,
        textFromHtml: this.props.contentText
      });
      Android.runInUI(cmd, 0);
    } else {
      var cmd = this.set({
        id: this.idSet.showMoreButton,
        text: window.__S.READ_MORE
      })
      cmd += this.set({
        id: this.idSet.paraContainerCroped,
        textFromHtml: this.str
      });
      Android.runInUI(cmd, 0);
    }
    this.max = !this.max
  }

  render() {
    this.layout = (
      <LinearLayout
      background={window.__Colors.WHITE}
      width="match_parent"
      height= "wrap_content"
      margin = {this.props.margin || "0,0,0,0"}
      layoutTransition="true"
      orientation="vertical">
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        background={this.props.background || window.__Colors.WHITE}>
      <TextView
        text = {this.props.headText}
        style= {window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin={this.props.headTextMargin || "0,0,0,8"}
        visibility = {(this.props.headText==undefined || this.props.headText.length == 0) ? "gone":"visible"}
        />
        </LinearLayout>
          <LinearLayout
        height="wrap_content"
        width="wrap_content"
        layout="horizontal">



              <ViewWidget
              height="0"
              weight="1"/>

              <LinearLayout
              width="wrap_content"
              height="wrap_content"
              layout="horizontal"
              visibility = {this.props.editable=="true" ? "visible" : "gone"}>
                  <RelativeLayout>
                    <ImageView
                    height="14"
                    width="14"
                    onClick={()=>{this.props.handleLock(this.name,this.lockIconVisibility,this.props.headText)}}
                    id={this.idSet.lockIcon}
                    visibility={this.lockIconVisibility?"visible":"gone"}
                    imageUrl="ic_action_lock"/>
                    <ImageView
                    id={this.idSet.unlockIcon}
                    height="14"
                    width="14"
                    onClick={()=>{this.props.handleLock(this.name,this.lockIconVisibility,this.props.headText)}}
                    visibility={this.lockIconVisibility?"gone":"visible"}
                    imageUrl="ic_action_unlock"/>
                  </RelativeLayout>
              </LinearLayout>
          </LinearLayout>


          <LinearLayout
            orientation = "vertical"
            width = "match_parent"
            height = "wrap_content"
            layoutTransition="true">

            <TextView
              id={this.idSet.paraContainerCroped}
              textFromHtml = {this.str}
              width="wrap_content"
              height="wrap_content"
              layoutTransition="true"
              style= {this.props.textStyle ? this.props.textStyle : window.__TextStyle.textStyle.CARD.BODY.REGULAR}/>

            <TextView
              margin="0,0,8,0"
              id={this.idSet.showMoreButton}
              visibility={this.str.length > this.len ? "visible" : "gone"}
              text={window.__S.READ_MORE}
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
