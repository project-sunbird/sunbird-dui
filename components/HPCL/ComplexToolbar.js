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
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
 
var Styles = require("../../res/Styles"); 
var TextStyle = require("../../res/TextStyle"); 
var Colors = require("../../res/Colors").color;

var iconStyle = Styles.Params.IconStyle; 
 
class ComplexToolbar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ComplexToolbar";
  }
   
  getBack() {
    if (!this.props.showBack)
    return <Space width="0"/>
   
    var icon =  this.props.invert ? "ic_back_arrow_dark" : "ic_back_arrow_light";
    
    return (
      <ImageView
        margin="0,0,10,0"
        onClick={this.props.onBackPress}
        style={iconStyle}
        imageUrl={icon}/>
    )
  }
   
  getTitle() {
    var margin;

    if (!this.props.showBack && !this.props.status)
    margin = "12,0,0,0";

    var titleStyle =  this.props.invert ? TextStyle.textStyle.bigBody : TextStyle.textStyle.bigBodyWhite;
    var subTextStyle =  this.props.invert ? TextStyle.textStyle.smallLabelBlack : TextStyle.textStyle.smallLabelWhiteDisabled;

    return (
      <LinearLayout margin={margin} orientation="vertical">
        <TextView style={titleStyle} text={this.props.title}/>
        <TextView style={subTextStyle} alpha="0.67" text={this.props.subText}/>
      </LinearLayout>
    )
  }
   
  getPopUpMenu() {
    if (!this.props.showMenu)
    return <Space width="0"/>
       
    var icon = this.props.invert ? "ic_dot_menu_dark" : "ic_dot_menu_light";

    return (<ImageView  
        style = {iconStyle}
        popupMenu = {this.props.items}
        onMenuItemClick = {this.props.onMenuItemClick}
        imageUrl = {icon}/> )
  }
  
  getIcons = () => {
    if (!this.props.icons)
    return <Space width="0"/>

    return this.props.icons.map((icon, index) => {
      return (<ImageView  
        onClick={() => {this.props.onIconClick(icon)}}
        style = {iconStyle}
        imageUrl = {icon}/>)
    });
  }
   
  getIconDrawer() {
    return (
      <LinearLayout >
        {this.getIcons()}
        {this.getPopUpMenu()}
      </LinearLayout>
    )
  }
   
  getStatus() {
    if (!this.props.status)
    return <Space width="0"/>;
  
    var margin;

    if (!this.props.showBack) {
      margin = "12,0,10,0";
    } else {
      margin = "0,0,10,0";
    }

    var background = this.props.status == "online" ? Colors.GREEN : Colors.RED;
     
    return <ViewWidget 
      margin={margin}
      cornerRadius="16"
      width="16"
      height="16"
      background={background}
      />
  }

  render() {
    var back = this.getBack();
    var title = this.getTitle();
    var status = this.getStatus();
    var iconDrawer = this.getIconDrawer();
     
    var background = this.props.invert ? "#FFFFFF" : Colors.NPCI_BLUE;
     
    this.layout = (
      <LinearLayout 
        height="80"
        padding="8,0,8,0"
        gravity="center_vertical"
        root="true" 
        background={background}
        width="match_parent" >
         
        {back}     
        {status}
        {title}     

        <Space width="0" weight="1" />
         
        {iconDrawer} 
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = ComplexToolbar;
