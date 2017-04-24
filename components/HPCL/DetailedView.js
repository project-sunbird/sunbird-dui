var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
 
var Styles = require("../../res/Styles"); 
var TextStyle = require("../../res/TextStyle"); 
var Colors = require("../../res/Colors").color;
 
let textStyle = TextStyle.textStyle;
 
class EachItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "EachItem";
  }
  
  render() {
    this.layout = (
      <LinearLayout 
        root="true"
        weight= "1"
        margin="0,0,0,10" 
        width="match_parent">
        <LinearLayout
          width="match_parent"
          weight="0.6">
          <TextView 
            style={textStyle.smallLabelBlack} 
            alpha="0.67" 
            text={this.props.item.key.toUpperCase()} />
        </LinearLayout>
        <LinearLayout
          width="match_parent"
          weight="0.4">
          <TextView 
            style={textStyle.detailsDescription}
            text={this.props.item.value}/>
        </LinearLayout>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

class DetailedView extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "DetailedView";
  }

  renderItems() {
    return this.props.items.map((item, index)=>{
      return (
        <EachItem
          index = {index}
          item = {item}/>
      )
    });
  }
   
  render() {
    this.layout = (
      <LinearLayout 
        padding="20,10,20,10"
        background = {Colors.LIGHT_GRAY}
        orientation="vertical"
        root="true" 
        width="match_parent" >
        
        <TextView
          style={textStyle.smallLabelBlack}
          alpha="0.67"
          margin="0,0,0,20"
          text={this.props.heading.toUpperCase()}
          />
           
        {this.renderItems()}
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = DetailedView;
