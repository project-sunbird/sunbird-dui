var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class RecommendedCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "ratingBar",
    ]);
  }

  ratingChange = (data) => {
    console.log("RATING CHANGE :", data)
  }

  getCardIcon = () => {
    return (<LinearLayout
            width="130"
            height="100"
            background = {this.props.item.moduleBackground? this.props.item.moduleBackground : "#229012FE" }
            gravity="center"
            cornerRadius="5">
                  <ImageView
                    height="48"
                    width="48"
                    imageUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
                  />
           </LinearLayout>)
  }

  getRatingSection = () => {
    return (<LinearLayout
            gravity="center"
            padding="6,0,6,0">
            <RatingBar 
              id = {this.idSet.ratingBar} 
              width="0"
              weight="1"
              height="50"
              setStars = "5" 
              setRating = {this.props.item.moduleRating}
              scaleX="0.2"
              scaleY="0.2"
              onRatingChange = {this.ratingChange}
              fixedRating = {"true"}/>
            <TextView
                  text= {"("}
                  style={window.__TextStyle.textStyle.HINT.REGULAR}/> 
            <TextView
                  text= {this.props.item.moduleUserCount ? this.props.item.moduleUserCount : "NIL"}
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
        height="match_parent"
        orientation = "vertical"
        padding="16,0,16,0">

        {
          this.getCardIcon()
        }

        <LinearLayout
          width="130"
          orientation="vertical"
          height="wrap_content"
          margin="0,12,0,0">
          <TextView
                text= {this.props.item.moduleName ? this.props.item.moduleName : "Module Name"}
                style={window.__TextStyle.textStyle.HINT.BOLD}/>
          
          {
            this.getRatingSection()
          }     
            
            
          </LinearLayout>
    </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = RecommendedCard;
