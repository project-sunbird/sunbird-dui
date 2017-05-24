var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;

window.R = require("ramda");
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class TodoCard extends View {
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
            width="72"
            height="74"
            background = {this.props.item.moduleBackground? this.props.item.moduleBackground : "#229012FE" }
            gravity="center">
                  <ImageView
                    height="38"
                    width="35"
                    imageUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
                  />
           </LinearLayout>)
  }
   getContent = () => {
    return (<LinearLayout
            width="match_parent"
            height="match_parent"
            orientation="vertical"
            background = {window.__Colors.WHITE}
            >
                <TextView
                    margin= "9,18,0,5"
                    style={window.__TextStyle.textStyle.CARD.HEADING}
                    text={this.props.item.moduleName}/>
              <LinearLayout
                width="match_parent"
                height="match_parent"
                margin="9,0,0,0"
                >
                  <TextView
                      style={window.__TextStyle.textStyle.HINT.REGULAR}
                      text={"Std "+ this.props.item.moduleClass}/>
                  <TextView
                      style={window.__TextStyle.textStyle.HINT.REGULAR}
                      text={"   "+ this.props.item.modulePendingClass + " Classes More"}/>
              </LinearLayout>
           </LinearLayout>)
  }

  handleClick = () =>{
      console.log("in card",this.props.index)
      this.props.onClick(this.props.index);
  }

  


  render() {


    this.layout = (
      <LinearLayout
        width="320"
        height="75"
        cornerRadius="5"
        margin="16,0,16,0"
        root="true"
        background={window.__Colors.PRIMARY_BLACK_11}
        >
          <LinearLayout
              width="318"
              height="74"
              margin="1,0,1,1"
              cornerRadius="5"
              background={window.__Colors.WHITE}
              >
              <LinearLayout
                  width="318"
                  height="74"
                  cornerRadius="5"
                  onClick = {this.handleClick}
                  >
                  {
                    this.getCardIcon()
                  }
                  
                  {
                    this.getContent()
                  }

                </LinearLayout>
          </LinearLayout>
    </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = TodoCard;