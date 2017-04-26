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

var Styles = require("../../res/Styles");
// TODO : NEED TO FIX THIS
//let IconStyle =  window.__Styles.Params.IconStyle;
let IconStyle = Styles.Params.IconStyle;

class SimpleToolbar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "SimpleToolbar";
  }

  getMenu() {
    // cant send null some issue with filename of null not defined
    if (this.props.showMenu == undefined || !this.props.showMenu)
      return <Space width="0"/>

    return (<ImageView  
        style = {IconStyle}
        popupMenu = {this.props.items}
        onMenuItemClick = {this.props.onMenuItemClick}
        imageUrl = {"ic_action_overflow"}/>)
  }

  getBack() {
    // send hideBack if you want to hide back button
    if (this.props.hideBack != undefined && this.props.hideBack)
      return <Space width="0"/>

    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      onClick={this.props.onBackPress}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getTitle() {
    let margin;

    if (!this.props.showBack && !this.props.logo)
      margin = "12,0,0,0";


    return (<TextView margin={margin} 
          style={window.__TextStyle.textStyle.TOOLBAR.HEADING} 
          text={this.props.title}/>)



  }

  getLogo = () => {
    if (!this.props.logo)
      return <Space width="0"/>

    return ( < ImageView margin = "0,0,10,0"
      style = {
        {
          width: '48',
          height: '48'
        }
      }
      imageUrl = { this.props.logo }
      />
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
    let icons = this.getIcons();

    this.layout = (
      <LinearLayout 
        height="56"
        padding="8,0,8,0"
        gravity="center_vertical"
        root="true" 
        background={this.props.invert?window.__Colors.WHITE:window.__Colors.LIGHT_VIOLET}
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
