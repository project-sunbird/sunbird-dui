const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var DoubleRadioList = require('../../components/Sunbird/DoubleRadioList');
var FeatureButton = require('../../components/Sunbird/FeatureButton');

var Styles = require("../../res/Styles");

let IconStyle = Styles.Params.IconStyle;
var _this;
class ChooseItem extends View {
    constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer"
    ]);
    _this = this;
    this.chosenItem;
  }



  getFeatureButton (isClickable){
     var color = isClickable=="true" ? window.__Colors.PRIMARY_ACCENT:window.__Colors.PRIMARY_BLACK_22;
         return (<LinearLayout
                  width = "match_parent"
                  alignParentBottom = "true,-1"
                  width="match_parent"
                  orientation="vertical"
                  height="wrap_content"
                  id={this.idSet.featureContainer}
                  weight = "1"
                  padding = "3,3,3,3"
                  gravity = "center">
                  <FeatureButton
                    weight = "0.5"
                    typeface = "bold"
                    clickable={isClickable}
                    width = "match_parent"
                    height = "64"
                    stroke = {"3," + window.__Colors.WHITE}
                    background = {color}
                    text = {this.props.data.confirmText || "Confirm"}
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "18"/>
                </LinearLayout>)
    

  }


  getRadioList (){
    return( <LinearLayout
            alignParentBottom = "true,-1"
            width = "match_parent"
            height = "wrap_content"
            margin = "0,0,0,0"
            padding = "0,0,10,10"
            orientation = "vertical"
            weight = "1">
               <DoubleRadioList items = {this.props.data.items} onSelect={this.handleSelection}/>
            </LinearLayout>)
  }

  getHeader (){
    return(<LinearLayout
            alignParentBottom = "true,-1"
            width = "match_parent"
            height = "wrap_content"
            margin = "0,16,0,16"
            padding = "0,0,16,0"
            weight = "1">
          <TextView
           width = "wrap_content"
           height = "wrap_content"
           text = {this.props.data.heading}
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
    
          </LinearLayout>)
  }


  onConfirm(){
    _this.replaceChild(_this.idSet.featureContainer, _this.getFeatureButton("false").render(), 0);
    window.__RootScreen.hideFilterDialog();
    _this.props.onSelect(_this.chosenItem);
  }

  handleSelection=(index)=>{
    this.replaceChild(this.idSet.featureContainer, this.getFeatureButton("true").render(), 0);
    this.chosenItem=index;
  }

  afterRender = () => {
  }

  render() {
  
    this.layout = (
       <LinearLayout
          cornerRadius = "2"
          afterRender={this.afterRender}
          width = "match_parent"
          height = "wrap_content"
          orientation= "vertical"
          clickable = "true"
          padding="16,18,16,16"
          alignParentBottom = "true,-1"
          background="#ffffff">
          
         {this.getHeader()}

         {this.getRadioList()}

         {this.getFeatureButton("false")}
            
           
        </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ChooseItem;
