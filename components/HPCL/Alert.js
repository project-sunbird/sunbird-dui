const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
const Styles = require("../../res/Styles");
const TextStyle = require("../../res/TextStyle");
const Colors = require('../../res/Colors');

class Alert extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "Alert";
    this.setIds(["alert"]);
    this.decision();
  }

  decision = () =>{
    switch(this.props.type){
      case "success":
        this.image = Styles.Params.Alert.Success_Image;
        this.imageUrl = "ic_success";
        break;
      case "pending":
        this.image = Styles.Params.Alert.Pending_Image;
        this.imageUrl = "ic_pending";
        break;
      case "failed":
        this.image = Styles.Params.Alert.Failed_Image;
        this.imageUrl = "ic_failure";
        break;
      default:
        this.image = Styles.Params.Alert.Pending_Image;
        this.imageUrl = "ic_success";
    }
  }
  
  render() {
    this.layout = (
      <LinearLayout
        height = "20"
        gravity = "center">
         
        <ImageView
          style = {this.image}/>
        <TextView
          margin = "8,0,0,0"
          color = {this.image.color}
          style = {TextStyle.textStyle.statusAlert}
          text = {this.props.text}/>
           
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = Alert;