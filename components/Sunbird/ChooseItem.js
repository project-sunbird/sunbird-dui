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

class ChooseItem extends View {
    constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer"
    ]);
  }



  getFeatureButton (){

         return ( <LinearLayout
            width = "match_parent"
            alignParentBottom = "true,-1"
            height = "64"
            weight = "1"
            padding = "3,3,3,3"
            gravity = "center">
            <FeatureButton
              weight = "0.5"
              typeface = "bold"
              width = "match_parent"
              height = "64"
              stroke = {"3," + window.__Colors.DARK_GREEN}
              background = {window.__Colors.DARK_GREEN}
              text = {this.props.confirmText || "Confirm"}
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
            padding = "10,0,10,10"
            orientation = "vertical"
            weight = "1">
              <LinearLayout
                id={this.idSet.chooseItemContainer}
                orientation="vertical"
                height="wrap_content"
                width="match_parent">
              </LinearLayout>
            </LinearLayout>)
  }

  getHeader (){
    return(<LinearLayout
            alignParentBottom = "true,-1"
            width = "match_parent"
            height = "wrap_content"
            margin = "0,16,0,16"
            padding = "16,0,16,0"
            weight = "1">
          <TextView
           width = "wrap_content"
           height = "wrap_content"
           text = {this.props.heading}
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

          <ViewWidget 
            height = "1"
            width = "0"
            weight = "1"/>

          <ImageView
           width = "24"
           height = "24"
           imageUrl = "ic_action_close"/>
          </LinearLayout>)
  }

 afterRender = () => {
    var renderItem = (
     <LinearLayout
     width = "wrap_content"
     height = "match_parent"
     orientation = "horizontal">
      <DoubleRadioList items = {this.props.items}/>
      </LinearLayout>
      );
    this.appendChild(this.idSet.chooseItemContainer, renderItem.render(), 0);
    console.log("AFTER RENDER IS CALLED");
  }

  render() {
  
    this.layout = (
      
      <RelativeLayout
        width="match_parent"
        height="match_parent"
        afterRender = {this.afterRender} >

        <LinearLayout
          cornerRadius = "2"
          width = "match_parent"
          height = "wrap_content"
          orientation= "vertical"
          clickable = "true"
          alignParentBottom = "true,-1"
          background="#ffffff">
          
         {this.getHeader()}

         {this.getRadioList()}

         {this.getFeatureButton()}
            
           
        </LinearLayout>
      </RelativeLayout>
    )

    return this.layout.render();
  }
}

module.exports = ChooseItem;
