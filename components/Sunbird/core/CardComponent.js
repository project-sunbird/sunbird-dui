var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var Button = require('../../Sunbird/Button');
var utils = require('../../../utils/GenericFunctions');
var HorizontalProgressBar = require('../../Sunbird/HorizontalProgressBar');

var _this;

class CardComponent extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([
      "leftProgress",
      "rightProgress",
      "ratingBar"
    ]);
    console.log("props in CC",this.props)
  }

  getRemainingProgress = (progress) => {
    var remainingProgress = 100 - progress;
    return remainingProgress;
  }

  capitalizeFirstLetter=(string) =>{
    return (string.charAt(0).toUpperCase() + string.slice(1));
  }

  getBody = () => {
    var myProgress = this.props.data.progressPercent||"0";
    return (
    <RelativeLayout
      width="200"
      height="110">
      <ImageView
        width="200"
        height="110"
        scaleType="centerCrop"
        circularImageUrl={"5,"+this.props.data.imageUrl}/>
      <LinearLayout
        width="200"
        height="110"
        gravity="center"
        cornerRadius="4"
        background={window.__Colors.BLACK}
        alpha="0.50"/>
      <HorizontalProgressBar
        width="match_parent"
        height="4"
        cornerRadius={"12,12,0,0"}
        currentProgress={myProgress}
        totalProgress={100}
        visibility={this.props.data.isProgress ? "visible" : "gone"}/>
      <TextView
        width="200"
        height="wrap_content"
        padding = "10,10,10,10"
        alignParentBottom="true,-1"
        text= {this.capitalizeFirstLetter(this.props.data.title)}
        enableEllipse="true"
        letterSpacing="0.05"
        style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
      <TextView
        width="wrap_content"
        height="wrap_content"
        margin = "10,10,10,10"
        visibility={this.props.data.type?"visible":"gone"}
        text= {this.props.data.type}
        letterSpacing="0.07"
        padding="5,3,5,3"
        cornerRadius="4"
        background={window.__Colors.PRIMARY_BLACK}
        alignParentRight="true,-1"
        style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
    </RelativeLayout>
    );
  }

  afterRender = () => {
    if (this.props.data.stars)
      JBridge.setRating(this.idSet.ratingBar, this.props.data.stars);
  }

  getFooter = () => {
    return (
    <LinearLayout
      margin="0,8,0,0"
      width="200"
      height="wrap_content">
      <LinearLayout
        weight="1"
        height="wrap_content"
        orientation="vertical">
        <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.props.data.footerTitle}
          visibility={this.props.data.stars?"gone":"visible"}
          style={window.__TextStyle.textStyle.CARD.SEMI_DARK}/>
        <LinearLayout
          visibility={this.props.data.stars?"visible":"gone"}
          width="wrap_content"
          height="wrap_content">
          <RatingBar
            width="0"
            height="0"
            id={this.idSet.ratingBar}/>
        </LinearLayout>
        <TextView
          width="wrap_content"
          height="wrap_content"
          visibility = {this.props.data.footerSubTitle && this.props.data.footerSubTitle!= "" ? "visible" : "gone"}
          text={utils.cropText(this.props.data.footerSubTitle, 15)}
          style={window.__TextStyle.textStyle.HINT.TINY}/>
      </LinearLayout>
      <Button
        type="SmallButton_Secondary_BT"
        width="wrap_content"
        height="wrap_content"
        onClick={this.handleCardClick}
        text={this.props.data.actionText? this.props.data.actionText : window.__S.OPEN}/>
    </LinearLayout>
    );
  }


  handleCardClick = () => {

    this.props.onCardClick(this.props.content, this.props.data.type,this.props.index);
  }


  render() {
    this.layout = (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        margin="16,0,0,22"
        onClick={this.handleCardClick}
        afterRender={this.afterRender}
        orientation="vertical">
        {this.getBody()}
        {this.getFooter()}
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CardComponent;
