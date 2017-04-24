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
 
let IconStyle = Styles.Params.IconStyle; 

class SimpleToolbar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "SimpleToolbar";
  }
   
  getMenu() {
    // cant send null some issue with filename of null not defined
    if (!this.props.showMenu)
    return <Space width="0"/>
       
    return (<ImageView  
        style = {IconStyle}
        popupMenu = {this.props.items}
        onMenuItemClick = {this.props.onMenuItemClick}
        imageUrl = {"ic_dot_menu_dark"}/> )
  }

  getBack() {
    // cant send null some issue with filename of null not defined
    if (!this.props.showBack)
    return <Space width="0"/>
   
    return (
    <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      onClick={this.props.onBackPress}
      imageUrl = {"ic_back_arrow"}/>)
  }
  
  getTitle() {
    let margin;

    if (!this.props.showBack && !this.props.logo)
    margin = "12,0,0,0";
    
    if (!this.props.subText) {
      return <TextView margin={margin} 
          style={TextStyle.textStyle.heading} 
          text={this.props.title}/>
    }

    return (
      <LinearLayout orientation="vertical">
         <TextView margin={margin} 
          style={TextStyle.textStyle.heading} 
          text={this.props.title}/>
        <TextView margin={margin} 
          style={TextStyle.textStyle.smallBody} 
          text={this.props.subText}/>
      </LinearLayout>
    )
  }
   
  getLogo = () => {
    if (!this.props.logo) 
    return <Space width="0"/>
    
    return (
      <ImageView
         margin="0,0,10,0"
         style={{
           width: '48',
           height: '48'
         }}
         imageUrl={this.props.logo}/>
    );
  }
  
  getIcons = () => {
    if (!this.props.icons)
    return <Space width="0"/>

    return this.props.icons.map((icon, index) => {
      return (<ImageView  
        onClick={() => {this.props.onIconClick(icon)}}
        style = {IconStyle}
        imageUrl = {icon}/>)
    });
  }
   
  render() {
    let menu = this.getMenu();
    let back = this.getBack();
    let logo = this.getLogo();
    let title = this.getTitle();
    let icons  = this.getIcons();
     
    this.layout = (
      <LinearLayout 
        height="80"
        padding="8,0,8,0"
        gravity="center_vertical"
        root="true" 
        width="match_parent" >
         
          {back}
          {logo}
          {title}
           
          <Space width="0" weight="1"/>
          {icons}
          {menu}
             
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = SimpleToolbar;
