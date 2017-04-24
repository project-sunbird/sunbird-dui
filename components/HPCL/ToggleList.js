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

class ToggleListItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ToggleListItem";

    this.setIds([
      'image'
    ]);

    this.checked = false;
  }
  
  handleClick = () => {
    this.checked = !this.checked;
    this.props.onClick(this.props.index, this.checked);
     
    if (this.props.type == "readOnly") 
    return;

    if (this.checked)
    this.check();
    else 
    this.uncheck();
  }
   
  check = () =>  {
    let cmd = "";

    cmd += this.set({
      id: this.idSet.image,
      imageUrl: "ic_check_large"
    });

    Android.runInUI(
      cmd, 
      null
    );
  }
   
  uncheck = () => {
    let cmd = "";

    cmd += this.set({
      id: this.idSet.image,
      imageUrl: "ic_uncheck_large"
    });
     
    Android.runInUI(
      cmd, 
      null
    );
  }
  
  getImageView() {
    let icon = "ic_uncheck_large";
    
    if (this.props.type == "readOnly") {
      if (this.props.item.subText.toLowerCase() == "online now") 
      icon = "ic_agent_online";
      else
      icon = "ic_agent_offline";
    }

    return <ImageView 
      id={this.idSet.image}
      margin="0,0,20,0"
      imageUrl={icon}
      width="40"
      height="40"/>
  }

  render() {
    this.layout = (
      <LinearLayout 
        root="true" 
        allowMultipleClicks="true"
        onClick={this.handleClick}
        height="68"
        gravity="center_vertical"
        width="match_parent"
        background="#00000" >

        {this.getImageView()}
         
        <LinearLayout 
          orientation="vertical">
           
          <TextView style={TextStyle.textStyle.bigBody} text={this.props.item.title}/>
          <TextView style={TextStyle.textStyle.smallBody} text={this.props.item.subText}/>

        </LinearLayout>

        <Space width="0" weight="1"/>
         
        <LinearLayout 
          orientation="vertical">
          <TextView 
            style={TextStyle.textStyle.listAmount} 
            text={this.props.item.amount}/>
           
          {
            //dummy textView fot textAlignment
          }
           
          <TextView style={TextStyle.textStyle.transactionStatus} />
           
        </LinearLayout>
         
      </LinearLayout>
    )

    return this.layout.render();
  }
}

class ToggleList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ToggleList";
  }

  renderItems = () => {
    return this.props.items.map((item, index)=>{
      return (
        <ToggleListItem
          type = {this.props.type}
          index = {index}
          onClick={this.props.onSelect}
          item = {item}/>
      )
    });
  }
   
  render() {
    this.layout = (
      <LinearLayout 
        showDividers="2"
        dividerDrawable="divider"
        padding="20,0,20,0"
        orientation="vertical"
        root="true" 
        width="match_parent" >
        
        {this.renderItems()}
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = ToggleList;
