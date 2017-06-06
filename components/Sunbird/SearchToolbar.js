const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var Space = require("@juspay/mystique-backend").androidViews.Space;

var debounce = require("debounce");

var Styles = require("../../res/Styles");
// TODO : NEED TO FIX THIS
//let IconStyle =  window.__Styles.Params.IconStyle;
let IconStyle = Styles.Params.IconStyle;

class SearchToolbar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "SearchToolbar";
    this.setIds(["titleTextHolder",
      "searchHolder",
      "searchIconHolder",
      "searchCloseHolder",
      "menuContainer",
      "backIcon",
      "searchBackIcon"
    ])

    this.searchText = debounce(this.searchText, 200);
    this.isSearchEnabled = this.props.startWithSearch ? this.props.startWithSearch : false;

    window.__SearchToolbar = this;
  }

  searchText = (dataSearch) => {
    this.props.onSearch(dataSearch)
  }

  handleSearchClick = () => {
    var cmd = ""
    this.isSearchEnabled=true;
    JBridge.showKeyboard();

    cmd += this.set({
      id: this.idSet.titleTextHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchIconHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.menuContainer,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.backIcon,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchBackIcon,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.searchCloseHolder,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.searchHolder,
      text: "",
      focus: "true",
      visibility: "visible"
    })

    Android.runInUI(cmd, 0);
  }


  clearSearch = () => {
    var cmd = "";
    this.isSearchEnabled=false;
    JBridge.hideKeyboard();
    cmd += this.set({
      id: this.idSet.searchHolder,
      text: "",
      focusOut: "true",
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchCloseHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchBackIcon,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchIconHolder,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.titleTextHolder,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.menuContainer,
      visibility: "visible"
    })

    if(!this.props.hideBack){
      cmd += this.set({
      id: this.idSet.backIcon,
      visibility: "visible"
    })
    }

    Android.runInUI(cmd, 0);
  }


  getSearchIcon() {
    return (<LinearLayout
            height="match_parent"
            gravity="center_vertical">
              <ImageView  
                id={this.idSet.searchIconHolder}
                style = {IconStyle}
                onClick = {this.handleSearchClick}
                visibility={this.isSearchEnabled?"gone":"visible"}
                imageUrl = {"ic_action_search"}/>

              <ImageView  
                id={this.idSet.searchCloseHolder}
                style = {IconStyle}
                onClick = {this.clearSearch}
                visibility={this.isSearchEnabled?"visible":"gone"}
                imageUrl = {"ic_action_close"}/>  

            </LinearLayout>)

  }

  getBack() {
    return (
      <ImageView
      margin="0,0,10,0"
      id={this.idSet.backIcon}
      style={IconStyle}
      visibility={this.props.hideBack?"gone":"visible"}
      onClick={this.handleBackPress}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getSearchBack(){
    return (<ImageView
            margin="0,0,0,0"
            style={IconStyle}
            id={this.idSet.searchBackIcon}
            visibility={this.isSearchEnabled?"visible":"gone"}
            onClick={this.handleSearchBackPress}
            imageUrl = {"ic_action_arrow_left"}/>)
  }

  getTitle() {
    return (<LinearLayout
            height="match_parent"
            orientation="vertical"
            layoutTransition="true"
            weight="1">

          <TextView 
            height="match_parent"
            width="match_parent"
            gravity="center_vertical"
            layoutTransition="true"
            visibility={this.isSearchEnabled?"gone":"visible"}
            id={this.idSet.titleTextHolder}
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING} 
            text={this.props.title}/>

           <EditText 
            height="match_parent"
            width="match_parent"
            maxLines="1"
            hint={this.props.hint}
            layoutTransition="true"
            gravity="center_vertical"
            onChange = {this.searchText}
            id={this.idSet.searchHolder}
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>  


          </LinearLayout>)

  }

  getMenu = () => {
    if (!this.props.menuData)
      return <Space width="0"/>

    var menu = this.props.menuData.url.map((item, index) => {
      return (<ImageView  
        onClick={() => {this.handleMenuClick(item.imageUrl)}}
        style = {IconStyle}
        imageUrl = {item.imageUrl}/>)
    });

    return (<LinearLayout
             width="wrap_content"
             height="wrap_content"
             id={this.idSet.menuContainer}>
             {menu}
             </LinearLayout>
           )
  }

  handleMenuClick = (url) => {
    this.props.onMenuItemClick(url);
  }

  handleBackPress = () =>{
    this.props.onBackPress();
  }

  handleSearchBackPress=()=>{
    this.clearSearch();
  }

  render() {
    let searchIcon = this.getSearchIcon();
    let back = this.getBack();
    let title = this.getTitle();
    let menu = this.getMenu();
    let searchBack = this.getSearchBack();

    this.layout = (
      <LinearLayout 
        height="56"
        padding="8,0,8,0"
        gravity="center_vertical"
        root="true" 
        background={this.props.invert?window.__Colors.WHITE:window.__Colors.LIGHT_VIOLET}
        width="match_parent" >
         
          {back}
          {searchBack}
          
          {title}
           
          <Space width="0" weight="1"/>
          {menu}
          {searchIcon}
             
       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SearchToolbar;
