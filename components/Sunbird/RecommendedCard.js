
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");

var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;


var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

class RecommendedCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "ratingBar",
    ]);

  }


  handleClick = () => {
    this.props.onClick(this.props.item.content);
  }


  ratingChange = (data) => {
    console.log("RATING CHANGE :", data)
  }

  getCardIcon = () => {
    return (
      <RelativeLayout
        width="wrap_content"
        height="wrap_content">
            <LinearLayout
              width="170"
              height="110"
              gravity="center">
                  <ImageView
                    height="match_parent"
                    width="match_parent"
                    scaleType="fixXY"
                    imageFromUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}/>
            </LinearLayout>

          <LinearLayout
            width="170"
            height="110"
            gravity="center"
            background={window.__Colors.BLACK}
            alpha="0.50"/>

          <LinearLayout
            width="150"
            height="wrap_content"
            gravity="center"
            alignParentBottom="true,-1"
            padding = "10,10,10,10">
                <TextView
                text= {this.props.item.moduleName ? this.props.item.moduleName :window.__S.MODULE_NAME}
                style={window.__TextStyle.textStyle.HINT.WBOLD}/>
           </LinearLayout>
          </RelativeLayout>)
  }

  getRatingSection = () => {
    return (<LinearLayout
              gravity="center"
              visibility = {this.props.item.hideRating}
              padding="6,0,6,0">
              <RatingBar
                id = {this.idSet.ratingBar}
                width="0"
                weight="1"
                height="50"
                setStars = "6"
                setRating = {this.props.item.moduleRating}
                scaleX="0.3"
                scaleY="0.3"
                onRatingChange = {this.ratingChange}
                fixedRating = {"true"}/>


              <TextView
                    text= {"("}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>
              <TextView
                    text= {this.props.item.moduleUserCount ? this.props.item.moduleUserCount :window.__S.NIL}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>
              <TextView
                    text= {")"}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>
          </LinearLayout>)
  }


  render() {


    this.layout = (
      <LinearLayout
        width="wrap_content"
        height="wrap_content"
        orientation = "vertical"
        padding="16,0,16,0"
        onClick={this.handleClick}>
            <LinearLayout
              width="170"
              height="110">

              {
                this.getCardIcon()
              }

          </LinearLayout>

          <LinearLayout
            height="wrap_content"
            width="match_parent">
          
            {this.getRatingSection()}

          </LinearLayout>

      </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = RecommendedCard;
