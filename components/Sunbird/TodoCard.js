var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;

window.R = require("ramda");
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

import CourseInfoItemList from '../Sunbird/CourseInfoItemList';


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
            width="100"
            height="100"
            background = {this.props.item.moduleBackground? this.props.item.moduleBackground : "#229012FE" }
            gravity="center">
                  <ImageView
                    height="50"
                    width="50"
                    imageUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
                  />
           </LinearLayout>)
  }

  getProgressStatus = () => {
    return (<LinearLayout
            margin= "10,3,0,10"
            width="match_parent">
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={"Your Progress: "}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={this.props.item.completedCount}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={" / "}/>  
                 <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={this.props.item.totalCount}/> 
          </LinearLayout>)
  }

  getRemainingStatus = () => {
    if (parseInt(this.props.item.remainingTime) > 60) {
      return (parseInt(parseInt(this.props.item.remainingTime) / 60) + " hours of coursework remainig")
    } else {
      return (this.props.item.remainingTime + " more minutes and you’re done!")
    }
  }
   getContent = () => {
    var timeRemainingStatus = this.getRemainingStatus();
    return (<LinearLayout
            width="match_parent"
            height="match_parent"
            orientation="vertical"
            background = {window.__Colors.WHITE}
            >
                <TextView
                    margin= "9,18,0,0"
                    style={window.__TextStyle.textStyle.CARD.HEADING}
                    text={this.props.item.moduleName}/>
                 {this.getProgressStatus()}
                 <TextView
                  margin= "10,15,12,10"
                  width="match_parent"
                  style={window.__TextStyle.textStyle.HINT.BLUE}
                  text={timeRemainingStatus}/>  


           </LinearLayout>)
  }



  handleClick = () =>{
      console.log("in card",this.props.index)
      this.props.onClick(this.props.index);
  }

  render() {
    this.layout = (
      <LinearLayout
        width="318"
        height="100"
        cornerRadius="5"
        margin="16,0,16,0"
        root="true"
        background={window.__Colors.PRIMARY_BLACK_11}
        >
          <LinearLayout
              width="318"
              height="100"
              margin="1,0,1,1"
              cornerRadius="5"
              background={window.__Colors.WHITE}
              >
              <LinearLayout
                  width="318"
                  height="100"
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