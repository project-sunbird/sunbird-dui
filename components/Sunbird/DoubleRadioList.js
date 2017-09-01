

var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var Styles = require("../../res/Styles"); 
var TextStyle = require("../../res/TextStyle"); 
var RadioListItem = require('../Sunbird/RadioListItem');

var _this;


class DoubleRadioList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "DoubleRadioList";
    this.list = this.props.items;
    _this = this;
  }



getSingleRow = (item,index) =>{
  return (<RadioListItem
            title={item}
            index={index}/>);
}



renderItems() {
      var lengthOfMenu = Object.keys(this.list).length;
      this.totalItems = this.props.items.splice(0,lengthOfMenu/2)
      this.rightItems = this.props.items.splice(0,lengthOfMenu/2);
      this.leftItems = this.totalItems.splice(0,lengthOfMenu/2);

      var leftBar = "";
      var rightBar = "";
      leftBar = this.leftItems.map((item, index) => {
        return this.getSingleRow(item,index);
      });

      rightBar = this.rightItems.map((item, index) => {
        return this.getSingleRow(item,index);
      });
      this.totalBar = (
          <LinearLayout
            orientation = "horizontal"
            width = "wrap_content"
            height = "wrap_content">
            <LinearLayout
              orientation = "vertical"
              width = "wrap_content"
              height = "wrap_content">
              
              {leftBar}
            
            </LinearLayout>
          
            <LinearLayout
              orientation = "vertical"
              width = "wrap_content"
              height = "wrap_content"
              margin = "86,0,0,0">
              
              {rightBar}

            </LinearLayout>

          </LinearLayout>
        )

    return this.totalBar;
  }


  render() {
    this.layout = (
      <LinearLayout 
        orientation="vertical"
        root="true" 
        width="wrap_content" >
           
        {this.renderItems()}
        
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = DoubleRadioList;