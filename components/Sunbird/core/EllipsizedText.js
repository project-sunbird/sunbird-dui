var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var Button = require('../../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var _this;


class EllipsizedText extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([
      'textContainer'     
    ]);

    console.log("EllipsizedText")

  }

  afterRender = () =>{

   var text=this.props.text;
   var shortenedText = text.substring(0,parseInt(this.props.numChar)) + "...";
      var cmd = this.set({
        id: this.idSet.textContainer,
        text : shortenedText
      })

     Android.runInUI(cmd, 0);

  }


  render() {
    this.layout = (
      <LinearLayout
          width={this.props.width?this.props.width:"wrap_content"}
          height={this.props.height?this.props.height:"wrap_content"}
          visibility={this.props.visibility?this.props.visibility:"gone"}
          afterRender={this.afterRender}
          orientation="vertical">

          <TextView
            id={this.idSet.textContainer}
            padding={this.props.padding?this.props.padding:"0,0,0,0"}
            margin={this.props.margin?this.props.margin:"0,0,0,0"}
            style={this.props.style?this.props.style:""}
            width={this.props.width?this.props.width:"wrap_content"}
            height={this.props.height?this.props.height:"wrap_content"}
            letterSpacing={this.props.letterSpacing?this.props.letterSpacing:""}/>


         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = EllipsizedText;
