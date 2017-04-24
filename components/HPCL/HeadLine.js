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
const Colors = require("../../res/Colors").color;
 
let IconStyle = Styles.Params.IconStyle; 

// TODO
class Headline extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "Headline";
     
    this.setIds([
      'icon',
      'amount'
    ]);     
  }
  
  getTitle = () => {
    return (
      <LinearLayout>
        <TextView style={TextStyle.textStyle.smallLabelWhite} text={this.props.title} margin="0,0,10,0"/>
        <TextView style={TextStyle.textStyle.smallLabelWhiteDisabled} text={this.props.subText}/>
      </LinearLayout>
    )
  }
   
  handleIconClick = () => {
    this.props.onIconClick();

    if (!this.props.isFilter)
    return;
   
    let cmd = "";

    cmd += this.set({
      id: this.idSet.icon,
      imageUrl: "filtered",
    })

    Android.runInUI(cmd, null);
  }
   
  getIcon = () => {
    // cant send null some issue with filename of null not defined
    if (!this.props.icon)
    return <Space width="0"/>
   
    return (
      <ImageView
        margin="0,10,0,0"
        id = {this.idSet.icon}
        style={IconStyle}
        onClick={this.handleIconClick}
        imageUrl = {this.props.icon}/>)
    
  }
   
  getAmountData = () => {
    return (
      <LinearLayout orientation="vertical">
        <TextView style={TextStyle.textStyle.bigAmount} id={this.idSet.amount} text={this.props.amount}/>
        <TextView style={TextStyle.textStyle.smallLabelWhiteDisabled} text={this.props.bottomText} margin = "50,0,0,0"/>
      </LinearLayout>
      )
  }
   
  getBody = () => {
    return (
      <LinearLayout width="match_parent">
        {this.getAmountData()}
        <Space width="0" weight="1"/>
        {this.getIcon()}
      </LinearLayout>
      )
  }
   
  setAmount = (amount) => {
    let cmd = this.set({
      id: this.idSet.amount,
      text: amount
    });

    Android.runInUI(cmd, null);
  }
  
  render() {
    this.layout = (
      <LinearLayout 
        padding="20,0,8,20"
        background={Colors.NPCI_BLUE}
        orientation="vertical"
        root="true" 
        width="match_parent" >

          {this.getTitle()}
          {this.getBody()}
           
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = Headline;
