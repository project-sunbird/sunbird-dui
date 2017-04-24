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
 
const Styles = require("../../res/Styles"); 
const TextStyle = require("../../res/TextStyle"); 

class ListHeader extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ListHeader";
    this.setIds(['title']);
  }

  updateTitleText = (text) => {
    let cmd = "";

    cmd += this.set({
      id: this.idSet.title,
      text: text
    });

    Android.runInUI(cmd, null);
  }
  
  updateSubText(text, visibility) {
    let cmd = "";

    if (!text)
    text = this.text;
    else 
    this.text = text;
   
    cmd += this.set({
      id: this.idSet.subText,
      visibility: visibility,
      text: text,
    })

    Android.runInUI(
      cmd,
      null
    );
  }
   
  render() {
    this.layout = (
      <LinearLayout 
        height="50"

        padding="20,0,20,0"
        gravity="center_vertical"
        background="#10484848"
        root="true" 
        width="match_parent" >
         
        <TextView id={this.idSet.title} style={TextStyle.textStyle.listDivider} alpha ="0.67" text={this.props.title}/>
        <Space width="0" weight="1"/>
        <TextView onClick={this.props.onClick} style={TextStyle.textStyle.blueButton} text={this.props.subText}/>

       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = ListHeader;
