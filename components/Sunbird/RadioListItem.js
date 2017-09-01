var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var Styles = require("../../res/Styles");
var TextStyle = require("../../res/TextStyle");
var _this;


class RadioListItem extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'image'
    ]);

    this.isSelected = this.props.isSelected ? this.props.isSelected : false;

  }



  handleClick = () => {
    this.isSelected = !this.isSelected;
    var cmd = "";

    if (this.isSelected) {
      cmd = this.set({
        id: this.idSet.image,
        imageUrl: "ic_checked"
      })
    } else {
      cmd = this.set({
        id: this.idSet.image,
        imageUrl: "ic_unchecked"
      })
    }
    this.props.onItemClick(this.props.title, this.isSelected);

    Android.runInUI(cmd, 0);

  }



  render() {
    this.layout = (
      <LinearLayout 
        root="true" 
        margin="0,0,0,10"
        gravity="center_vertical"
        afterRender={this.afterRender}
        width="wrap_content" >
      

        <ImageView 
          onClick={this.handleClick}
          id={this.idSet.image}
          allowMultipleClicks="true"
          padding="0,12,12,12"
          imageUrl={this.isSelected?"ic_checked":"ic_unchecked"}
          margin="0,0,10,0"
          width="48"
          height="48"/>

        <TextView 
          style={TextStyle.textStyle.bigBody} 
          text={this.props.title}/>


       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = RadioListItem;
