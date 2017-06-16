var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this=this;


  }


  getHeader(){
    return (  <LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Creator of"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="View all"
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }



  getCardIcon = () => {
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="16,0,0,22"
            orientation="vertical">

              <RelativeLayout
               width="wrap_content"
               height="wrap_content">

              <ImageView
                height="110"
                width="200"
                scaleType="fixXY"
                gravity="center"
                circularImageUrl={"4,"+"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg"}/>

              <LinearLayout
                width="200"
                height="110"
                gravity="center"
                cornerRadius="4"
                background={window.__Colors.BLACK}
                alpha="0.50"/>

                <TextView
                  gravity="center"
                  width="200"
                  alignParentRight="true"
                  height="wrap_content"
                  padding = "10,10,10,10"
                  text= "hello world"
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

              <TextView
                gravity="center"
                width="150"
                height="wrap_content"
                padding = "10,10,10,10"
                alignParentBottom="true,-1"
                text= "hello world"
                style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

            </RelativeLayout>
            <LinearLayout
            width="wrap_content"
            height="wrap_content">
            <RatingBar
              width="0"
              weight="1"
              setStars = "6"
              setRating = "5"
              scaleX="0.3"
              scaleY="0.3"
              onRatingChange = {this.ratingChange}
              fixedRating = {"false"}/>
              </LinearLayout>
            </LinearLayout>);

  }

ratingChange(){

}


  render() {
    this.layout= (
              <LinearLayout
                margin="0,16,0,0"
                orientation="vertical">

                {this.getHeader()}

                <HorizontalScrollView
                 width = "wrap_content"
                 height = "wrap_content"
                 scrollBarX="false"
                 fillViewport="true">

                {this.getCardIcon()}

                </HorizontalScrollView>

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileCreations;
