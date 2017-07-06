var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var Styles = require("../../res/Styles"); 
var TextStyle = require("../../res/TextStyle"); 
var _this;


class RadioListItem extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'image'
    ]);

    _this = this;
    this.clickCount = 2;
  }

 

handleClick = () =>{

  var cmd ="";

  if(this.clickCount % 2 == 0){
    cmd = this.set({
      id: this.idSet.image,
      imageUrl : "ic_checked"
    })

    this.props.onItemClick(this.props.title,true);
  }
  else {
    cmd = this.set({
      id: this.idSet.image,
      imageUrl : "ic_unchecked"
    })

    this.props.onItemClick(this.props.title,false);

  }

    this.clickCount++;
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
          padding="0,12,12,12"
          imageUrl="ic_unchecked"
          margin="0,0,10,0"
          width="48"
          height="48"/>

        <TextView style={TextStyle.textStyle.bigBody} text={this.props.title}/>


       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = RadioListItem;